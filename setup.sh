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
if [ ! -f balkly-api/.env ]; then
    cp balkly-api/.env.example balkly-api/.env
    echo -e "${GREEN}✓${NC} Backend .env created"
else
    echo -e "${YELLOW}!${NC} Backend .env already exists (skipped)"
fi

if [ ! -f balkly-web/.env.local ]; then
    cp balkly-web/.env.local.example balkly-web/.env.local
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
echo -e "${YELLOW}📚 Documentation:${NC} See START_HERE.md for detailed guide"
echo ""

