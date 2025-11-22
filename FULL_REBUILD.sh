#!/bin/bash
cd /var/www/balkly

echo "Complete rebuild..."

# Stop everything
docker-compose down

# Remove ALL containers and volumes
docker container prune -f
docker image prune -f

# Start fresh
docker-compose up -d --force-recreate

sleep 10

# Check status
docker-compose ps

echo "✅ Done!"

