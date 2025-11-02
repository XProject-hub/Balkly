# Balkly Platform - Complete Deployment Guide

**Last Updated**: November 2, 2025

---

## 🚀 Quick Deploy (5 Minutes)

### Prerequisites
- Server with Ubuntu 22.04+
- Docker & Docker Compose installed
- Domain name pointed to your server

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Clone & Configure

```bash
# Clone repository
git clone <your-repo-url> /var/www/balkly
cd /var/www/balkly

# Create environment files
cp balkly-api/.env.example balkly-api/.env
cp balkly-web/.env.local.example balkly-web/.env.local

# Edit configuration
nano balkly-api/.env
```

**Required Changes in `.env`:**
```env
APP_URL=https://yourdomain.com
APP_ENV=production
APP_DEBUG=false

# Add your real Stripe keys
STRIPE_KEY=pk_live_YOUR_KEY
STRIPE_SECRET=sk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET

# Add OpenAI key (optional)
OPENAI_API_KEY=sk-YOUR_KEY

# Email configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=YOUR_SENDGRID_API_KEY
```

### Step 3: Deploy

```bash
# Start services
docker-compose up -d

# Setup backend
docker exec -it balkly_api bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan migrate --seed --force
exit

# Setup frontend
docker exec -it balkly_web sh
npm install --production
npm run build
exit

# Create MinIO bucket
# Access http://your-server:9001
# Login: balkly / balkly_minio_pass
# Create bucket: balkly-media
# Set to public read
```

### Step 4: SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already set up by certbot)
sudo certbot renew --dry-run
```

### Step 5: Test

Visit `https://yourdomain.com` and test:
- ✅ Homepage loads
- ✅ Registration works
- ✅ Login works
- ✅ Create listing works
- ✅ Stripe checkout works

---

## 📦 Production Configuration

### Update Docker Compose for Production

Edit `docker-compose.yml`:

```yaml
services:
  api:
    restart: always
    environment:
      APP_ENV: production
      APP_DEBUG: false
    
  web:
    restart: always
    command: npm run start  # Production build
    
  mysql:
    restart: always
    volumes:
      - ./backups:/backups  # Backup location
      
  nginx:
    restart: always
    ports:
      - "443:443"  # HTTPS
```

### Configure Nginx for Production

Edit `nginx/conf.d/balkly.conf`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Rest of configuration...
    location /api/ {
        proxy_pass http://api:8000/api/;
        # ... proxy settings
    }
    
    location / {
        proxy_pass http://web:3000/;
        # ... proxy settings
    }
}
```

---

## 🔐 Security Hardening

### 1. Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### 2. Secure Environment Variables

```bash
# Restrict permissions
chmod 600 balkly-api/.env
chmod 600 balkly-web/.env.local

# Add to .gitignore (already done)
echo ".env" >> .gitignore
```

### 3. Database Security

```bash
# Change MySQL root password
docker exec -it balkly_mysql mysql -u root -p
# Then run: ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_strong_password';

# Update .env with new password
```

### 4. Enable Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📊 Monitoring & Logs

### Setup Log Rotation

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/balkly
```

Add:
```
/var/www/balkly/balkly-api/storage/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### Monitor Services

```bash
# Check all containers
docker-compose ps

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Check resource usage
docker stats
```

### Setup Monitoring (Optional)

**Using Uptime Kuma:**
```bash
docker run -d \
  --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  --restart=always \
  louislam/uptime-kuma:1
```

Access at: `http://your-server:3001`

---

## 💾 Backup Strategy

### Automated Database Backup

Create backup script:
```bash
nano /var/www/balkly/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/balkly/backups"
DB_NAME="balkly"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MySQL
docker exec balkly_mysql mysqldump -u balkly -pbalkly_pass $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Backup .env files
cp balkly-api/.env $BACKUP_DIR/env_api_$DATE.bak
cp balkly-web/.env.local $BACKUP_DIR/env_web_$DATE.bak

# Compress
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/*.sql $BACKUP_DIR/*.bak

# Clean up old backups (keep last 30 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

# Remove temporary files
rm $BACKUP_DIR/*.sql $BACKUP_DIR/*.bak

echo "Backup completed: backup_$DATE.tar.gz"
```

Make executable and schedule:
```bash
chmod +x /var/www/balkly/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /var/www/balkly/backup.sh >> /var/log/balkly-backup.log 2>&1
```

### Restore from Backup

```bash
# Extract backup
tar -xzf backups/backup_YYYYMMDD_HHMMSS.tar.gz

# Restore database
docker exec -i balkly_mysql mysql -u balkly -pbalkly_pass balkly < backup_file.sql
```

---

## 🔄 Updates & Maintenance

### Update Application

```bash
cd /var/www/balkly

# Pull latest code
git pull origin main

# Update backend
docker exec -it balkly_api bash
composer install --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
exit

# Update frontend
docker exec -it balkly_web sh
npm install --production
npm run build
exit

# Restart services
docker-compose restart
```

### Update Dependencies

```bash
# Backend
docker exec -it balkly_api bash
composer update --no-dev
exit

# Frontend
docker exec -it balkly_web sh
npm update
exit
```

---

## ⚡ Performance Optimization

### Enable Redis Caching

Already configured! Just verify:
```bash
docker exec -it balkly_redis redis-cli ping
# Should respond: PONG
```

### Enable OPcache

Add to `balkly-api/Dockerfile`:
```dockerfile
RUN docker-php-ext-install opcache
COPY opcache.ini /usr/local/etc/php/conf.d/opcache.ini
```

Create `opcache.ini`:
```ini
[opcache]
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
```

### CDN Setup (Optional)

Use BunnyCDN or Cloudflare:

1. Point domain to CDN
2. Configure CDN to proxy your server
3. Enable caching rules for static assets

---

## 📧 Email Configuration

### Using SendGrid

1. Sign up at sendgrid.com
2. Create API key
3. Update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.YOUR_API_KEY
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### Using Postmark

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.postmarkapp.com
MAIL_PORT=587
MAIL_USERNAME=YOUR_SERVER_TOKEN
MAIL_PASSWORD=YOUR_SERVER_TOKEN
```

---

## 🐛 Troubleshooting

### Application not loading

```bash
# Check all services
docker-compose ps

# Restart services
docker-compose restart

# Check logs
docker-compose logs -f
```

### Database connection failed

```bash
# Check MySQL
docker exec -it balkly_mysql mysql -u balkly -pbalkly_pass -e "SHOW DATABASES;"

# Restart MySQL
docker-compose restart mysql
```

### Payment not working

1. Verify Stripe keys in `.env`
2. Check webhook endpoint in Stripe dashboard
3. Test with test cards: `4242 4242 4242 4242`
4. Check logs: `docker-compose logs api | grep stripe`

### Images not uploading

```bash
# Check MinIO
docker-compose logs minio

# Verify bucket exists
# Access http://your-server:9001

# Check Laravel storage permissions
docker exec -it balkly_api bash
chmod -R 775 storage
chown -R www-data:www-data storage
```

---

## 📱 Post-Deployment Checklist

### Day 1
- [ ] Test all user flows
- [ ] Verify Stripe webhooks receiving events
- [ ] Check email notifications working
- [ ] Test mobile responsiveness
- [ ] Set up monitoring alerts
- [ ] Configure backup automation

### Week 1
- [ ] Monitor error logs daily
- [ ] Check server resources
- [ ] Review user feedback
- [ ] Optimize slow queries
- [ ] Test backup restoration

### Monthly
- [ ] Review security updates
- [ ] Update dependencies
- [ ] Analyze performance metrics
- [ ] Check disk space
- [ ] Test disaster recovery

---

## 🎯 Production URLs

- **Main Site**: https://yourdomain.com
- **API**: https://yourdomain.com/api/v1
- **Admin**: https://yourdomain.com/admin
- **MinIO Console**: https://yourdomain.com:9001 (or separate subdomain)

---

## 📞 Support Resources

- **Laravel Docs**: https://laravel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Stripe Docs**: https://stripe.com/docs
- **Docker Docs**: https://docs.docker.com

---

## 🎉 You're Live!

Your Balkly platform is now running in production! 🚀

**Next Steps:**
1. Announce launch
2. Monitor closely for first 48 hours
3. Gather user feedback
4. Iterate and improve

---

**Happy Selling! 💰**

