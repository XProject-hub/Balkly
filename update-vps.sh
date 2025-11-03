#!/bin/bash

#==============================================================================
# Balkly Platform - VPS Update Script
#==============================================================================
# This script pulls latest changes from GitHub and updates the platform
#
# Usage: curl -fsSL https://raw.githubusercontent.com/XProject-hub/Balkly/main/update-vps.sh | sudo bash
#==============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

INSTALL_DIR="/var/www/balkly"

echo ""
echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE}     🔄 Balkly Platform - Update from GitHub${NC}"
echo -e "${BLUE}================================================================${NC}"
echo ""

cd $INSTALL_DIR

echo -e "${BLUE}Step 1/8:${NC} Pulling latest changes from GitHub..."
git fetch origin main
git reset --hard origin/main
echo -e "${GREEN}✓${NC} Code updated"
echo ""

echo -e "${BLUE}Step 2/8:${NC} Stopping services..."
docker-compose down
echo -e "${GREEN}✓${NC} Services stopped"
echo ""

echo -e "${BLUE}Step 3/8:${NC} Rebuilding containers..."
docker-compose build --no-cache
echo -e "${GREEN}✓${NC} Containers rebuilt"
echo ""

echo -e "${BLUE}Step 4/8:${NC} Starting services..."
docker-compose up -d
sleep 10
echo -e "${GREEN}✓${NC} Services started"
echo ""

echo -e "${BLUE}Step 5/8:${NC} Preparing directories..."
docker exec balkly_api bash -c "mkdir -p /var/www/bootstrap/cache /var/www/storage/framework/{cache,sessions,views} /var/www/storage/logs"
docker exec balkly_api bash -c "chmod -R 777 /var/www/bootstrap/cache /var/www/storage"
echo -e "${GREEN}✓${NC} Directories ready"
echo ""

echo -e "${BLUE}Step 6/8:${NC} Updating backend dependencies..."
docker exec balkly_api bash -c "COMPOSER_ALLOW_SUPERUSER=1 composer install --no-interaction --optimize-autoloader"
echo -e "${GREEN}✓${NC} Backend updated"
echo ""

echo -e "${BLUE}Step 7/8:${NC} Running migrations..."
docker exec balkly_api bash -c "php artisan migrate --force"
docker exec balkly_api bash -c "php artisan config:cache"
docker exec balkly_api bash -c "php artisan route:cache"
echo -e "${GREEN}✓${NC} Database updated"
echo ""

echo -e "${BLUE}Step 8/8:${NC} Updating frontend..."
docker exec balkly_web sh -c "npm install"
docker-compose restart web
echo -e "${GREEN}✓${NC} Frontend updated"
echo ""

# Start Laravel server
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"

echo ""
echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN}     ✅ UPDATE COMPLETE!${NC}"
echo -e "${GREEN}================================================================${NC}"
echo ""
echo "Platform updated to latest version!"
echo ""
echo "Services are running. Visit: http://$(curl -s ifconfig.me)"
echo ""

