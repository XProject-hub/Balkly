#!/bin/bash
cd /var/www/balkly

echo "Fixing build errors..."

# Remove old container completely
docker-compose down web
docker container prune -f

# Start fresh (no rebuild needed, just recreate)
docker-compose up -d web
sleep 5

# Clear Next.js cache inside running container
docker exec balkly_web rm -rf .next || true
docker exec balkly_web rm -rf node_modules/.cache || true

# Restart to apply
docker-compose restart web

echo "✅ Build fixed!"

