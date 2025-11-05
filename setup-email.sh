#!/bin/bash

echo "📧 Setting up Resend Email for Balkly..."

# Navigate to project
cd /var/www/balkly

# Check if .env exists
if [ ! -f balkly-api/.env ]; then
    echo "❌ Error: balkly-api/.env not found!"
    echo "Creating from template..."
    cp docu/ENV_TEMPLATE.md balkly-api/.env
fi

# Add/Update Resend configuration in .env
echo ""
echo "Adding Resend configuration..."

# Remove old mail config if exists
sed -i '/^MAIL_/d' balkly-api/.env
sed -i '/^RESEND_/d' balkly-api/.env

# Append new config
cat >> balkly-api/.env << 'EOF'

# Email Configuration (Resend)
RESEND_API_KEY=re_ekq54c3z_6FjSE9sTJJs5kCV2vAuCaHWB
RESEND_WEBHOOK_SECRET=whsec_71Xtoa/kpD0v3xV3Wk9S48UvlocJGrea
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=noreply@balkly.live
MAIL_FROM_NAME="Balkly"
EOF

echo "✅ Email configuration added to .env"

# Generate app key if not set
docker exec balkly_api bash -c "php artisan key:generate --force"

# Clear config cache
docker exec balkly_api bash -c "php artisan config:clear"

# Restart API
docker-compose restart api
sleep 3
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"

echo ""
echo "✅ Email Setup Complete!"
echo ""
echo "📧 You can now send from:"
echo "   - noreply@balkly.live"
echo "   - info@balkly.live"
echo "   - support@balkly.live"
echo "   - haris.kravarevic@balkly.live"
echo ""
echo "⚠️  IMPORTANT: Add DNS records in Resend dashboard!"
echo "   Go to: https://resend.com/domains/balkly.live"
echo ""
echo "🧪 Test email with:"
echo "   docker exec balkly_api bash -c 'php artisan tinker --execute=\"use Illuminate\\\\Support\\\\Facades\\\\Mail; Mail::raw(\\\"Test from Balkly!\\\", function(\\\$m) { \\\$m->to(\\\"YOUR_EMAIL@gmail.com\\\")->from(\\\"noreply@balkly.live\\\", \\\"Balkly\\\")->subject(\\\"Test\\\"); });\"'"
echo ""

