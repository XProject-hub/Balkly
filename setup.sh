#!/bin/bash

# Balkly Platform - Automated Setup Script
# Run this script to set up the entire platform in one command

set -e  # Exit on error

echo "🎊 Welcome to Balkly Platform Setup!"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Create environment files
echo -e "${BLUE}Step 1/6:${NC} Creating environment files..."

# Create backend .env if not exists
if [ ! -f balkly-api/.env ]; then
    cat > balkly-api/.env << 'EOF'
APP_NAME=Balkly
APP_ENV=local
APP_KEY=
APP_DEBUG=true
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

STRIPE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET=sk_test_YOUR_SECRET
OPENAI_API_KEY=sk-YOUR_OPENAI_KEY

SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
SESSION_DOMAIN=localhost
EOF
    echo -e "${GREEN}✓${NC} Backend .env created"
else
    echo -e "${YELLOW}!${NC} Backend .env already exists (skipped)"
fi

# Create frontend .env.local if not exists
if [ ! -f balkly-web/.env.local ]; then
    cat > balkly-web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost/ws
NEXT_PUBLIC_SITE_URL=http://localhost
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
EOF
    echo -e "${GREEN}✓${NC} Frontend .env created"
else
    echo -e "${YELLOW}!${NC} Frontend .env already exists (skipped)"
fi
echo ""

# Step 2: Start Docker services
echo -e "${BLUE}Step 2/6:${NC} Starting Docker services..."
docker-compose up -d
echo -e "${GREEN}✓${NC} All services started"
echo ""

# Wait for services to be ready
echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 10

# Step 3: Setup backend
echo -e "${BLUE}Step 3/6:${NC} Setting up Laravel backend..."
docker exec -it balkly_api bash -c "composer install --no-interaction"
echo -e "${GREEN}✓${NC} Dependencies installed"

docker exec -it balkly_api bash -c "php artisan key:generate"
echo -e "${GREEN}✓${NC} Application key generated"

docker exec -it balkly_api bash -c "php artisan migrate --force"
echo -e "${GREEN}✓${NC} Database migrated"

docker exec -it balkly_api bash -c "php artisan db:seed --force"
echo -e "${GREEN}✓${NC} Database seeded"
echo ""

# Step 4: Setup frontend
echo -e "${BLUE}Step 4/6:${NC} Setting up Next.js frontend..."
docker exec -it balkly_web sh -c "npm install"
echo -e "${GREEN}✓${NC} Frontend dependencies installed"
echo ""

# Step 5: Restart services
echo -e "${BLUE}Step 5/6:${NC} Restarting services..."
docker-compose restart web
echo -e "${GREEN}✓${NC} Services restarted"
echo ""

# Step 6: Final checks
echo -e "${BLUE}Step 6/6:${NC} Running final checks..."
echo -e "${GREEN}✓${NC} All services running"
echo ""

# Display success message
echo "============================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "============================================"
echo ""
echo "Your Balkly platform is now running!"
echo ""
echo "Access URLs:"
echo "  🌐 Frontend:     http://localhost"
echo "  🔌 API:          http://localhost/api/v1"
echo "  👨‍💼 Admin:        http://localhost/admin"
echo "  📦 MinIO:        http://localhost:9001"
echo ""
echo "Test Credentials:"
echo "  📧 Admin:  admin@balkly.com / password123"
echo "  📧 Seller: seller@balkly.com / password123"
echo "  📧 Buyer:  buyer@balkly.com / password123"
echo ""
echo "Next Steps:"
echo "  1. Add Stripe API keys to balkly-api/.env"
echo "  2. Add OpenAI key to balkly-api/.env (optional)"
echo "  3. Create MinIO bucket 'balkly-media' at http://localhost:9001"
echo "  4. Visit http://localhost and start exploring!"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC} See docu/START_HERE.md for detailed guide"
echo ""

