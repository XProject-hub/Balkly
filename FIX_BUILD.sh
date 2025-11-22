#!/bin/bash
cd /var/www/balkly

echo "Fixing build errors..."

# Stop web
docker-compose stop web

# Clear Next.js cache
docker exec balkly_web rm -rf .next || true
docker exec balkly_web rm -rf node_modules/.cache || true

# Rebuild
docker-compose build --no-cache web

# Start
docker-compose up -d web

echo "✅ Build fixed!"

