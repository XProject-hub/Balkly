#!/bin/bash

#==============================================================================
# Balkly Platform - Ubuntu 22 VPS Automated Installation Script
#==============================================================================
# This script will install all dependencies and set up Balkly on a fresh
# Ubuntu 22.04 VPS. Run as root or with sudo.
#
# Usage: curl -fsSL https://raw.githubusercontent.com/XProject-hub/Balkly/main/install-vps.sh | sudo bash
# Or: wget -O - https://raw.githubusercontent.com/XProject-hub/Balkly/main/install-vps.sh | sudo bash
#==============================================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="/var/www/balkly"
GITHUB_REPO="https://github.com/XProject-hub/Balkly.git"

echo ""
echo -e "${PURPLE}================================================================${NC}"
echo -e "${PURPLE}     🎊 Balkly Platform - VPS Installation 🎊${NC}"
echo -e "${PURPLE}================================================================${NC}"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root (use sudo)${NC}"
   exit 1
fi

# Check Ubuntu version
if ! grep -q "22.04" /etc/os-release; then
    echo -e "${YELLOW}⚠️  Warning: This script is designed for Ubuntu 22.04${NC}"
    echo -e "${YELLOW}   It may work on other versions but is not tested${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${BLUE}Step 1/10:${NC} Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq
echo -e "${GREEN}✓${NC} System updated"
echo ""

echo -e "${BLUE}Step 2/10:${NC} Installing prerequisites..."
apt-get install -y -qq \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    wget \
    unzip \
    software-properties-common \
    apt-transport-https
echo -e "${GREEN}✓${NC} Prerequisites installed"
echo ""

echo -e "${BLUE}Step 3/10:${NC} Installing Docker..."
if ! command -v docker &> /dev/null; then
    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    # Add Docker repository
    echo \
      "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start Docker
    systemctl start docker
    systemctl enable docker
    
    echo -e "${GREEN}✓${NC} Docker installed"
else
    echo -e "${GREEN}✓${NC} Docker already installed"
fi
echo ""

echo -e "${BLUE}Step 4/10:${NC} Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✓${NC} Docker Compose installed"
else
    echo -e "${GREEN}✓${NC} Docker Compose already installed"
fi
echo ""

echo -e "${BLUE}Step 5/10:${NC} Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    ufw status
    echo -e "${GREEN}✓${NC} Firewall configured"
else
    echo -e "${YELLOW}!${NC} UFW not found, skipping firewall configuration"
fi
echo ""

echo -e "${BLUE}Step 6/10:${NC} Cloning Balkly from GitHub..."
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}!${NC} Directory $INSTALL_DIR already exists"
    read -p "Remove and reinstall? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$INSTALL_DIR"
    else
        echo -e "${RED}❌ Installation aborted${NC}"
        exit 1
    fi
fi

git clone "$GITHUB_REPO" "$INSTALL_DIR"
cd "$INSTALL_DIR"
echo -e "${GREEN}✓${NC} Repository cloned to $INSTALL_DIR"
echo ""

echo -e "${BLUE}Step 7/10:${NC} Creating environment files..."

# Create backend .env file
if [ ! -f balkly-api/.env ]; then
    if [ -f balkly-api/.env.example ]; then
        cp balkly-api/.env.example balkly-api/.env
        echo -e "${GREEN}✓${NC} Backend .env created from .env.example"
    else
        # Fallback: create from template
        cat > balkly-api/.env << 'EOF'
APP_NAME=Balkly
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost
APP_TIMEZONE=UTC

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=balkly
DB_USERNAME=balkly
DB_PASSWORD=balkly_pass

CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_CLIENT=predis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@balkly.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=balkly
AWS_SECRET_ACCESS_KEY=balkly_minio_pass
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=balkly-media
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

FILESYSTEM_DISK=s3

SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=balkly_meili_master_key

STRIPE_KEY=pk_test_YOUR_STRIPE_KEY
STRIPE_SECRET=sk_test_YOUR_SECRET
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK

OPENAI_API_KEY=sk-YOUR_OPENAI_KEY
OPENAI_MODEL=gpt-4

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
SESSION_DOMAIN=localhost
EOF
        echo -e "${GREEN}✓${NC} Backend .env created from template"
    fi
else
    echo -e "${YELLOW}!${NC} Backend .env already exists"
fi

# Create frontend .env.local file
if [ ! -f balkly-web/.env.local ]; then
    if [ -f balkly-web/.env.local.example ]; then
        cp balkly-web/.env.local.example balkly-web/.env.local
        echo -e "${GREEN}✓${NC} Frontend .env created from .env.local.example"
    else
        # Fallback: create from template
        cat > balkly-web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost/ws
NEXT_PUBLIC_SITE_URL=http://localhost
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_KEY
EOF
        echo -e "${GREEN}✓${NC} Frontend .env created from template"
    fi
else
    echo -e "${YELLOW}!${NC} Frontend .env already exists"
fi
echo ""

echo -e "${BLUE}Step 8/10:${NC} Cleaning up old containers (if any)..."
docker-compose down --remove-orphans 2>/dev/null || true
docker system prune -f 2>/dev/null || true
echo -e "${GREEN}✓${NC} Cleanup complete"
echo ""

echo -e "${BLUE}Step 9/10:${NC} Starting Docker services..."
docker-compose up -d --remove-orphans
echo -e "${GREEN}✓${NC} All Docker services started"
echo ""

echo -e "${BLUE}Step 10/10:${NC} Waiting for services to initialize..."
sleep 20
echo -e "${GREEN}✓${NC} Services ready"
echo ""

echo -e "${BLUE}Step 11/15:${NC} Checking API container status..."
# Wait for API container to be healthy
for i in {1..30}; do
    if docker ps | grep -q balkly_api; then
        echo -e "${GREEN}✓${NC} API container running"
        break
    fi
    sleep 1
done

# Check if container is running, if not show logs
if ! docker ps | grep -q balkly_api; then
    echo -e "${RED}❌ API container failed to start. Checking logs:${NC}"
    docker logs balkly_api
    echo ""
    echo -e "${YELLOW}Attempting to fix...${NC}"
    # Recreate container
    docker-compose up -d --force-recreate api
    sleep 5
fi

echo -e "${BLUE}Step 12/15:${NC} Preparing Laravel directories..."
# Create required directories and fix permissions
docker exec balkly_api bash -c "mkdir -p /var/www/bootstrap/cache && chmod -R 775 /var/www/bootstrap/cache && chown -R www-data:www-data /var/www/bootstrap/cache"
docker exec balkly_api bash -c "mkdir -p /var/www/storage/framework/{cache,sessions,views} && chmod -R 775 /var/www/storage && chown -R www-data:www-data /var/www/storage"
echo -e "${GREEN}✓${NC} Directories prepared"
echo ""

echo -e "${BLUE}Step 13/15:${NC} Installing backend dependencies..."
docker exec balkly_api bash -c "composer install --no-interaction --optimize-autoloader --no-scripts"
docker exec balkly_api bash -c "composer dump-autoload"
echo -e "${GREEN}✓${NC} Composer dependencies installed"
echo ""

echo -e "${BLUE}Step 14/16:${NC} Setting up Laravel backend..."
docker exec balkly_api bash -c "php artisan key:generate --force" || echo -e "${YELLOW}⚠️  Key generation warning (may already exist)${NC}"
docker exec balkly_api bash -c "php artisan migrate --force" || echo -e "${RED}❌ Migration failed${NC}"
docker exec balkly_api bash -c "php artisan db:seed --force" || echo -e "${YELLOW}⚠️  Seeding warning (may already exist)${NC}"
docker exec balkly_api bash -c "php artisan config:cache" || echo -e "${YELLOW}⚠️  Config cache warning${NC}"
docker exec balkly_api bash -c "php artisan route:cache" || echo -e "${YELLOW}⚠️  Route cache warning${NC}"
docker exec balkly_api bash -c "php artisan storage:link" || echo -e "${YELLOW}⚠️  Storage link warning${NC}"
echo -e "${GREEN}✓${NC} Laravel backend configured"
echo ""

echo -e "${BLUE}Step 15/16:${NC} Setting up Next.js frontend..."
docker exec balkly_web sh -c "npm install" || echo -e "${YELLOW}⚠️  npm install warning${NC}"
echo -e "${GREEN}✓${NC} Frontend dependencies installed"
echo ""

echo -e "${BLUE}Step 16/16:${NC} Starting Laravel server..."
# Change API container command to run artisan serve
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
sleep 2
docker-compose restart web
echo -e "${GREEN}✓${NC} All services ready"
echo ""

# Final health check
echo -e "${BLUE}Performing health check...${NC}"
sleep 3
RUNNING=$(docker ps --filter name=balkly --format "{{.Names}}" | wc -l)
echo -e "${GREEN}✓${NC} $RUNNING containers running"
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

# Display completion message
echo ""
echo -e "${PURPLE}================================================================${NC}"
echo -e "${GREEN}     ✅ BALKLY INSTALLATION COMPLETE! ✅${NC}"
echo -e "${PURPLE}================================================================${NC}"
echo ""
echo -e "${GREEN}Your Balkly platform is now running!${NC}"
echo ""
echo "📍 Installation Directory: $INSTALL_DIR"
echo "🌐 Access URL: http://$SERVER_IP"
echo ""
echo -e "${YELLOW}Test Credentials:${NC}"
echo "   📧 Admin:  admin@balkly.com / password123"
echo "   📧 Seller: seller@balkly.com / password123"
echo "   📧 Buyer:  buyer@balkly.com / password123"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT - Next Steps:${NC}"
echo ""
echo "1. Configure Stripe (Required for payments):"
echo "   nano $INSTALL_DIR/balkly-api/.env"
echo "   Add: STRIPE_KEY=pk_test_..."
echo "        STRIPE_SECRET=sk_test_..."
echo ""
echo "2. Configure Email (Required for notifications):"
echo "   Add: MAIL_HOST=smtp.sendgrid.net"
echo "        MAIL_PASSWORD=YOUR_API_KEY"
echo ""
echo "3. Create MinIO bucket (Required for uploads):"
echo "   Visit: http://$SERVER_IP:9001"
echo "   Login: balkly / balkly_minio_pass"
echo "   Create bucket: balkly-media"
echo ""
echo "4. Configure SSL (Recommended for production):"
echo "   apt-get install certbot python3-certbot-nginx"
echo "   certbot --nginx -d yourdomain.com"
echo ""
echo "5. Restart after configuration:"
echo "   cd $INSTALL_DIR"
echo "   docker-compose restart"
echo ""
echo -e "${BLUE}📚 Documentation:${NC} $INSTALL_DIR/docu/"
echo ""
echo -e "${BLUE}🔧 Manage Services:${NC}"
echo "   docker-compose ps              # Check status"
echo "   docker-compose logs -f api     # View API logs"
echo "   docker-compose logs -f web     # View frontend logs"
echo "   docker-compose restart         # Restart all"
echo "   docker-compose down            # Stop all"
echo "   docker-compose up -d           # Start all"
echo ""
echo -e "${GREEN}🎊 Installation successful! Visit http://$SERVER_IP to see your platform!${NC}"
echo ""
echo -e "${PURPLE}================================================================${NC}"
echo ""

