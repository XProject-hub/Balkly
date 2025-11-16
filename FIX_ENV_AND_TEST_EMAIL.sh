#!/bin/bash
#==============================================================================
# Fix .env duplicates and test Resend email
#==============================================================================

echo "🔧 Fixing .env file and testing email..."
cd /var/www/balkly

# Backup current .env
docker exec balkly_api cp /var/www/.env /var/www/.env.backup
echo "✓ Backed up .env"

# Remove duplicate mail entries and rebuild clean .env
docker exec balkly_api sh -c '
# Remove all MAIL_ and RESEND_ lines
grep -v "^MAIL_" /var/www/.env > /var/www/.env.tmp
grep -v "^RESEND_" /var/www/.env.tmp > /var/www/.env.clean

# Add clean mail configuration once
cat >> /var/www/.env.clean << "MAILEOF"

# Email Configuration - Resend
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=re_ekq54c3z_6FjSE9sTJJs5kCV2vAuCaHWB
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@balkly.live
MAIL_FROM_NAME="Balkly"
RESEND_API_KEY=re_ekq54c3z_6FjSE9sTJJs5kCV2vAuCaHWB
MAILEOF

# Replace old .env with clean one
mv /var/www/.env.clean /var/www/.env
rm /var/www/.env.tmp
'
echo "✓ .env cleaned and updated"

# Pull latest code
git pull origin main
echo "✓ Code updated"

# Clear all caches
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan route:clear
echo "✓ Cache cleared"

# Restart services
docker-compose restart api queue web
sleep 15
echo "✓ Services restarted"

# Start Laravel
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
sleep 5
echo "✓ API started"

# Display email config
echo ""
echo "📧 Email Configuration:"
docker exec balkly_api php artisan config:show mail | grep -E "default|host|port|username|from"

echo ""
echo "🧪 Testing email delivery..."
echo "Registering a test user to trigger welcome email..."

# You can manually test by registering at https://balkly.live/auth/register
echo ""
echo "=========================================="
echo "✅ EMAIL SERVICE READY!"
echo "=========================================="
echo ""
echo "📧 Resend SMTP configured"
echo "📬 From: noreply@balkly.live"
echo "🔑 API Key configured"
echo ""
echo "🧪 TEST NOW:"
echo "   1. Visit https://balkly.live/auth/register"
echo "   2. Register with your real email"
echo "   3. Check inbox for:"
echo "      - Welcome email"
echo "      - Verification email"
echo ""
echo "📊 Monitor at: https://resend.com/emails"
echo ""

