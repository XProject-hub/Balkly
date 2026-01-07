# 🔄 Server Restart Guide

## After Server Restart/Crash - Run These Commands

If the server restarts or crashes, some services need to be manually started. Run these commands:

```bash
cd /var/www/balkly

# 1. Check all containers
docker ps

# 2. If any container is missing, start all services
docker-compose up -d

# 3. IMPORTANT: Start Laravel Scheduler (for auto-fetch events)
docker exec -d balkly_queue sh -c "while true; do php artisan schedule:run >> /var/www/storage/logs/scheduler.log 2>&1; sleep 60; done"

# 4. Verify all services are running
docker ps | grep balkly

# 5. Check if API server is responding
curl -s http://localhost:8000/api/v1/categories | head -50

# 6. Check nginx status
curl -I https://balkly.live
```

---

## ✅ Expected Status After Restart:

All containers should show **"Up"** and **"healthy"**:

- ✅ **balkly_nginx** - (healthy) - Ports 80, 443
- ✅ **balkly_web** - (healthy) - Port 3000
- ✅ **balkly_api** - (healthy) - Port 8000 - **AUTO-STARTS NOW!**
- ✅ **balkly_queue** - Up
- ✅ **balkly_mysql** - (healthy)
- ✅ **balkly_redis** - (healthy)
- ✅ **balkly_minio** - (healthy)
- ✅ **balkly_meilisearch** - (healthy)

---

## 🔧 Automatic Services:

These services **automatically start** after container restart (no manual intervention needed):

- ✅ **API Server** - `php artisan serve` (auto-starts via docker-compose command)
- ✅ **Queue Worker** - Horizon (auto-starts)
- ✅ **Next.js Web** - Development server (auto-starts)

---

## ⚠️ Manual Services (After Restart):

These need to be started **once** after server reboot:

### **Laravel Scheduler** (for auto-fetch events every 6 hours):

```bash
docker exec -d balkly_queue sh -c "while true; do php artisan schedule:run >> /var/www/storage/logs/scheduler.log 2>&1; sleep 60; done"
```

**What it does:**
- ✅ Fetch Platinumlist events every 6 hours
- ✅ Cleanup old events (30+ days) daily
- ✅ Runs other scheduled tasks

**Verify it's running:**
```bash
docker exec balkly_queue ps aux | grep schedule
docker exec balkly_queue tail -20 /var/www/storage/logs/scheduler.log
```

---

## 🧪 Test After Restart:

```bash
# Test API
curl -s https://balkly.live/api/v1/categories | head -50

# Test Web
curl -I https://balkly.live

# Test Events API
curl -s https://balkly.live/api/v1/events?per_page=5 | head -100

# Test Translation (MyMemory - FREE!)
docker exec balkly_api php -r "
\$ch = curl_init('https://api.mymemory.translated.net/get?q=Hello&langpair=en|bs');
curl_setopt(\$ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec(\$ch);
"
```

---

## 🚨 Troubleshooting:

### Problem: Nginx "unhealthy" or site not loading

**Solution:**
```bash
# Restart nginx
docker-compose restart nginx

# If port 80 is blocked by system nginx
sudo systemctl stop nginx
sudo pkill nginx
docker-compose up -d nginx
```

### Problem: API returns 502 Bad Gateway

**Solution:**
```bash
# Check if API server is running
docker exec balkly_api ps aux | grep artisan

# If not running, API will auto-start on container restart
docker-compose restart api
```

### Problem: Events not updating

**Solution:**
```bash
# Manually fetch now
docker exec balkly_api php artisan platinumlist:fetch

# Restart scheduler
docker exec balkly_queue pkill -f "schedule:run" || true
docker exec -d balkly_queue sh -c "while true; do php artisan schedule:run >> /var/www/storage/logs/scheduler.log 2>&1; sleep 60; done"
```

---

## 📊 Health Check Commands:

```bash
# Check all container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# Check API logs
docker logs balkly_api --tail 30

# Check Web logs
docker logs balkly_web --tail 30

# Check Nginx logs
docker logs balkly_nginx --tail 30

# Check scheduler logs
docker exec balkly_queue tail -50 /var/www/storage/logs/scheduler.log

# Check Laravel logs
docker exec balkly_api tail -50 /var/www/storage/logs/laravel.log
```

---

## 🎯 Quick Recovery Commands:

If something is completely broken, run this to reset everything:

```bash
cd /var/www/balkly

# Pull latest code
git pull origin main

# Stop all
docker-compose down

# Clean up
docker system prune -f

# Start fresh
docker-compose up -d

# Wait for all services to be healthy (30-60 seconds)
sleep 60

# Start scheduler
docker exec -d balkly_queue sh -c "while true; do php artisan schedule:run >> /var/www/storage/logs/scheduler.log 2>&1; sleep 60; done"

# Verify
docker ps
curl -I https://balkly.live
```

---

## 🔒 Security Note:

**System Nginx** has been **disabled** to prevent conflicts:
```bash
sudo systemctl disable nginx
```

This ensures Docker nginx can use port 80/443 without conflicts.

---

## 🎊 Everything is Now:

- ✅ **Auto-starting** - API server starts automatically
- ✅ **Self-recovering** - Containers restart on failure
- ✅ **Auto-updating** - Events fetch every 6 hours
- ✅ **Free Translation** - MyMemory API (no cost!)
- ✅ **Admin Controls** - Delete forum/listings/events
- ✅ **Production Ready** - Stable and reliable

**Last Updated:** January 7, 2026

