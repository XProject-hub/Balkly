#!/bin/bash
cd /var/www/balkly

echo "Setting up auto-update for events..."

# Add cron job to docker-compose for queue container
echo "Adding Laravel scheduler..."

# Run scheduler in background (will run tasks defined in Kernel.php)
docker exec -d balkly_queue bash -c "while true; do php artisan schedule:run >> /var/www/storage/logs/scheduler.log 2>&1; sleep 60; done"

echo ""
echo "✅ Auto-update configured!"
echo ""
echo "Scheduler will:"
echo "  • Fetch Platinumlist events every 6 hours"
echo "  • Delete events older than 30 days (daily)"
echo ""
echo "Manual fetch:"
echo "  docker exec balkly_api php artisan platinumlist:fetch"

