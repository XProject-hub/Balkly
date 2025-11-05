#!/bin/bash

echo "🚀 Deploying Balkly Platform..."

# Navigate to project directory
cd /var/www/balkly

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Rebuild web container (includes new npm packages)
echo "🔨 Rebuilding web container..."
docker-compose build --no-cache web

# Stop all containers cleanly
echo "⏹️  Stopping containers..."
docker-compose down

# Remove any corrupted web containers
docker ps -a | grep web | awk '{print $1}' | xargs -r docker rm -f 2>/dev/null

# Start all containers
echo "▶️  Starting all containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Start Laravel API server
echo "🔧 Starting Laravel API server..."
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"

# Check status
echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📊 Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}"
echo ""
echo "🌐 Your site is live at: http://balkly.live"
echo "🔐 Admin panel: http://balkly.live/admin"
echo ""
echo "📝 To view logs:"
echo "   docker logs -f balkly_web    # Frontend logs"
echo "   docker logs -f balkly_api    # API logs"
echo ""

