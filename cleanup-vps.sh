#!/bin/bash

# Balkly VPS - Disk Cleanup Script
# Run when disk space is low

echo "🧹 Cleaning up disk space..."
echo ""

# Check current disk usage
echo "Current disk usage:"
df -h /
echo ""

# Stop all containers
echo "Stopping containers..."
cd /var/www/balkly
docker-compose down

# Clean Docker
echo "Cleaning Docker..."
docker system prune -af --volumes
docker builder prune -af

echo ""
echo "After cleanup:"
df -h /
echo ""
echo "✅ Cleanup complete! Now rebuild:"
echo "cd /var/www/balkly && docker-compose up -d --build"

