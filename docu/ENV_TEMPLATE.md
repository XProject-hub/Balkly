# Environment Configuration Template for Balkly

Copy this to `balkly-api/.env` and replace placeholders with your actual values.

```env
APP_NAME=Balkly
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://balkly.live

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=balkly
DB_USERNAME=balkly
DB_PASSWORD=balkly_pass

BROADCAST_DRIVER=redis
CACHE_DRIVER=redis
FILESYSTEM_DISK=s3
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# ==========================================
# EMAIL CONFIGURATION (RESEND)
# ==========================================
RESEND_API_KEY=re_ekq54c3z_6FjSE9sTJJs5kCV2vAuCaHWB
RESEND_WEBHOOK_SECRET=whsec_71Xtoa/kpD0v3xV3Wk9S48UvlocJGrea
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=noreply@balkly.live
MAIL_FROM_NAME="Balkly"

# MinIO S3 Storage
AWS_ACCESS_KEY_ID=balkly
AWS_SECRET_ACCESS_KEY=balkly_minio_pass
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=balkly-media
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

# Meilisearch
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=balkly_meili_master_key
SCOUT_DRIVER=meilisearch

# Stripe Payment (Optional)
STRIPE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET=sk_test_YOUR_SECRET
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# Facebook OAuth (Optional)
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_REDIRECT_URI=
```

---

## 🚀 **How to Apply:**

```bash
# On your server:
cd /var/www/balkly

# Copy this template
cat > balkly-api/.env << 'EOF'
# Paste the entire .env content from above
EOF

# Or manually edit
nano balkly-api/.env
# Paste the content and save

# Generate APP_KEY
docker exec balkly_api bash -c "php artisan key:generate --force"

# Restart to load config
docker-compose restart api
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
```

---

## ⚠️ **IMPORTANT SECURITY:**

- ✅ `.env` files are in `.gitignore` (NOT pushed to GitHub)
- ✅ This template is in `docu/` for reference only
- ✅ Your real API keys stay ONLY on the server
- ✅ Never commit API keys to GitHub!

---

## 📝 **Your Resend Credentials:**

```
API Key: re_ekq54c3z_6FjSE9sTJJs5kCV2vAuCaHWB
Webhook Secret: whsec_71Xtoa/kpD0v3xV3Wk9S48UvlocJGrea
```

**Keep these safe!** They're like passwords for sending emails.

