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
if [ ! -f balkly-api/.env ]; then
    cp balkly-api/.env.example balkly-api/.env
    echo -e "${GREEN}✓${NC} Backend .env created"
else
    echo -e "${YELLOW}!${NC} Backend .env already exists"
fi

if [ ! -f balkly-web/.env.local ]; then
    cp balkly-web/.env.local.example balkly-web/.env.local
    echo -e "${GREEN}✓${NC} Frontend .env created"
else
    echo -e "${YELLOW}!${NC} Frontend .env already exists"
fi
echo ""

echo -e "${BLUE}Step 8/10:${NC} Starting Docker services..."
docker-compose up -d
echo -e "${GREEN}✓${NC} All Docker services started"
echo ""

echo -e "${BLUE}Step 9/10:${NC} Waiting for services to initialize..."
sleep 15
echo -e "${GREEN}✓${NC} Services ready"
echo ""

echo -e "${BLUE}Step 10/10:${NC} Setting up Laravel backend..."
docker exec balkly_api bash -c "composer install --no-interaction --optimize-autoloader --no-dev"
docker exec balkly_api bash -c "php artisan key:generate --force"
docker exec balkly_api bash -c "php artisan migrate --force"
docker exec balkly_api bash -c "php artisan db:seed --force"
docker exec balkly_api bash -c "php artisan config:cache"
docker exec balkly_api bash -c "php artisan route:cache"
echo -e "${GREEN}✓${NC} Laravel backend configured"
echo ""

echo -e "${BLUE}Step 10/10:${NC} Setting up Next.js frontend..."
docker exec balkly_web sh -c "npm install --production"
echo -e "${GREEN}✓${NC} Frontend dependencies installed"
echo ""

echo -e "${BLUE}Final step:${NC} Restarting services..."
docker-compose restart web
echo -e "${GREEN}✓${NC} All services restarted"
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

