# 🚀 Balkly - Ubuntu 22 VPS Installation Guide

**Automated installation for Ubuntu 22.04 VPS**

---

## ⚡ One-Command Installation

### Method 1: Direct from GitHub (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/XProject-hub/Balkly/main/install-vps.sh | sudo bash
```

Or using wget:
```bash
wget -O - https://raw.githubusercontent.com/XProject-hub/Balkly/main/install-vps.sh | sudo bash
```

**That's it!** The script will:
1. ✅ Update Ubuntu system
2. ✅ Install Docker & Docker Compose
3. ✅ Configure firewall
4. ✅ Clone repository from GitHub
5. ✅ Set up environment files
6. ✅ Start all services
7. ✅ Run migrations & seeders
8. ✅ Configure backend & frontend

**Time**: ~5-10 minutes

---

## 🖥️ VPS Requirements

### Minimum Specs:
- **OS**: Ubuntu 22.04 LTS
- **RAM**: 4GB (8GB recommended)
- **CPU**: 2 cores (4 recommended)
- **Storage**: 50GB SSD
- **Network**: Public IP address

### Recommended Providers:
- **DigitalOcean** - Droplet ($24/month for 4GB)
- **Vultr** - Cloud Compute ($24/month for 4GB)
- **Hetzner** - Cloud Server (€9/month for 4GB)
- **Linode/Akamai** - Shared CPU ($24/month for 4GB)

---

## 📋 Installation Steps Explained

### What the Script Does:

**Step 1-2**: System Preparation
- Updates all packages
- Installs prerequisites (curl, git, etc.)

**Step 3-4**: Docker Installation
- Adds Docker repository
- Installs Docker Engine & Docker Compose
- Enables Docker service

**Step 5**: Security
- Configures UFW firewall
- Opens ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

**Step 6**: Repository
- Clones from GitHub
- Installs to `/var/www/balkly`

**Step 7**: Configuration
- Creates `.env` files from examples
- Ready for your API keys

**Step 8**: Docker Services
- Starts MySQL, Redis, MinIO, Meilisearch
- Starts API and Web containers
- Starts Nginx reverse proxy

**Step 9**: Backend Setup
- Installs Composer dependencies
- Generates application key
- Runs database migrations
- Seeds initial data
- Caches configuration

**Step 10**: Frontend Setup
- Installs npm dependencies
- Builds Next.js app
- Restarts services

---

## 🔧 Post-Installation Configuration

### 1. Add Stripe API Keys (Required)

```bash
cd /var/www/balkly
nano balkly-api/.env
```

Add these lines:
```env
STRIPE_KEY=pk_live_YOUR_LIVE_KEY
STRIPE_SECRET=sk_live_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

**Get keys from**: https://dashboard.stripe.com/apikeys

### 2. Configure Email Service (Required)

In the same `.env` file, add:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.YOUR_SENDGRID_API_KEY
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

**SendGrid**: https://sendgrid.com (100 free emails/day)

### 3. Create MinIO Bucket (Required)

```bash
# Visit in browser:
http://YOUR_SERVER_IP:9001

# Login:
Username: balkly
Password: balkly_minio_pass

# Create bucket:
1. Click "Create Bucket"
2. Name: balkly-media
3. Access Policy: public
4. Click "Create"
```

### 4. Configure Domain & SSL (Recommended)

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

Update `balkly-api/.env`:
```env
APP_URL=https://yourdomain.com
```

Update `balkly-web/.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 5. Restart Services

```bash
cd /var/www/balkly
docker-compose restart
```

---

## 🔒 Security Hardening

### Change Default Passwords

```bash
cd /var/www/balkly

# Change database password
nano balkly-api/.env
# Update DB_PASSWORD to a strong password

# Update docker-compose.yml MySQL password
nano docker-compose.yml
# Update MYSQL_PASSWORD

# Change MinIO credentials
# Update MINIO_ROOT_PASSWORD in docker-compose.yml
```

### Enable Fail2Ban

```bash
apt-get install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### Restrict File Permissions

```bash
cd /var/www/balkly
chmod 600 balkly-api/.env
chmod 600 balkly-web/.env.local
chown -R www-data:www-data balkly-api/storage
```

---

## 📊 Verify Installation

### Check Services

```bash
cd /var/www/balkly
docker-compose ps
```

All services should show "Up" status.

### Check Logs

```bash
# API logs
docker-compose logs -f api

# Web logs
docker-compose logs -f web

# All logs
docker-compose logs -f
```

### Test API

```bash
curl http://localhost/api/v1
# Should return: {"name":"Balkly API","status":"online"}
```

### Test Frontend

Visit in browser: `http://YOUR_SERVER_IP`

---

## 🔄 Updating the Platform

```bash
cd /var/www/balkly

# Pull latest code from GitHub
git pull origin main

# Update backend
docker exec balkly_api bash -c "composer install --no-dev --optimize-autoloader"
docker exec balkly_api bash -c "php artisan migrate --force"
docker exec balkly_api bash -c "php artisan config:cache"
docker exec balkly_api bash -c "php artisan route:cache"

# Update frontend
docker exec balkly_web sh -c "npm install --production"

# Restart
docker-compose restart
```

---

## 💾 Automated Backups

### Create Backup Script

```bash
nano /root/backup-balkly.sh
```

Paste:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/balkly"
mkdir -p $BACKUP_DIR

# Backup database
docker exec balkly_mysql mysqldump -u balkly -pbalkly_pass balkly > $BACKUP_DIR/db_$DATE.sql

# Backup .env files
cp /var/www/balkly/balkly-api/.env $BACKUP_DIR/env_api_$DATE.bak

# Compress
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/*.sql $BACKUP_DIR/*.bak
rm $BACKUP_DIR/*.sql $BACKUP_DIR/*.bak

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

Make executable and schedule:
```bash
chmod +x /root/backup-balkly.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /root/backup-balkly.sh >> /var/log/balkly-backup.log 2>&1
```

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
cd /var/www/balkly
docker-compose down
docker-compose up -d
docker-compose logs
```

### Database Connection Failed

```bash
# Check MySQL
docker exec balkly_mysql mysql -u balkly -pbalkly_pass -e "SHOW DATABASES;"

# Restart MySQL
docker-compose restart mysql
```

### Frontend Not Loading

```bash
# Rebuild frontend
docker-compose down
docker-compose up -d --build web
```

### Port Already in Use

```bash
# Check what's using port 80
lsof -i :80
# Kill the process or change ports in docker-compose.yml
```

---

## 📈 Performance Optimization

### Enable Swap (if needed)

```bash
# Create 2GB swap file
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Optimize Docker

```bash
# Clean up unused Docker resources
docker system prune -a --volumes
```

---

## 🔍 Monitoring

### Check Resource Usage

```bash
# Overall system
htop  # or top

# Docker containers
docker stats

# Disk usage
df -h
```

### Set Up Uptime Monitoring

```bash
# Install Uptime Kuma
docker run -d \
  --name uptime-kuma \
  --restart always \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1

# Access at: http://YOUR_SERVER_IP:3001
```

---

## 🚀 Going Live Checklist

- [ ] Installation script completed
- [ ] Stripe API keys added
- [ ] Email SMTP configured
- [ ] MinIO bucket created
- [ ] Domain DNS pointed to server
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Backups automated
- [ ] Tested all features
- [ ] Changed default passwords
- [ ] Monitoring set up
- [ ] **READY TO LAUNCH!** 🎊

---

## 📞 Support

**Installation Issues**: Check logs with `docker-compose logs`

**Documentation**: `/var/www/balkly/docu/`

**GitHub**: https://github.com/XProject-hub/Balkly

---

## 🎯 After Installation

1. Visit `http://YOUR_SERVER_IP`
2. Login: `admin@balkly.com` / `password123`
3. Test all features
4. Configure Stripe keys
5. Set up your domain
6. Add SSL certificate
7. **GO LIVE!** 🚀

---

**Installation complete!** Your Balkly platform is running on Ubuntu 22 VPS! ✅

**For migration to dedicated server**: Just run the same script on the new server!

