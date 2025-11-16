#!/bin/bash
#==============================================================================
# Enable Resend Email Service for Balkly
#==============================================================================

echo ""
echo "📧 =========================================="
echo "📧  ENABLING RESEND EMAIL SERVICE"
echo "📧 =========================================="
echo ""

cd /var/www/balkly

# Step 1: Pull latest code
echo "📥 Step 1/6: Pulling latest code..."
git pull origin main
echo "✓ Code updated"
echo ""

# Step 2: Add Resend configuration to .env
echo "⚙️  Step 2/6: Configuring Resend email..."
docker exec balkly_api sh -c 'cat >> /var/www/.env << "EOF"

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
EOF
'
echo "✓ Resend config added to .env"
echo ""

# Step 3: Clear Laravel cache
echo "🧹 Step 3/6: Clearing Laravel cache..."
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan route:clear
echo "✓ Cache cleared"
echo ""

# Step 4: Restart services
echo "🔄 Step 4/6: Restarting services..."
docker-compose restart api queue
sleep 10
echo "✓ Services restarted"
echo ""

# Step 5: Start Laravel server
echo "🚀 Step 5/6: Starting Laravel API..."
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
sleep 5
echo "✓ API started"
echo ""

# Step 6: Test email sending
echo "📧 Step 6/6: Testing email delivery..."
docker exec balkly_api php artisan tinker --execute="
try {
    \$user = App\Models\User::first();
    if (\$user) {
        \$user->notify(new App\Notifications\WelcomeNotification());
        echo '✓ Test email sent to: ' . \$user->email . PHP_EOL;
        echo 'Check your inbox!' . PHP_EOL;
    } else {
        echo '⚠ No users found. Register a user to test email.' . PHP_EOL;
    }
} catch (\Exception \$e) {
    echo '✗ Email failed: ' . \$e->getMessage() . PHP_EOL;
    echo 'Please check your Resend API key and configuration.' . PHP_EOL;
}
"
echo ""

echo "=========================================="
echo "✅ RESEND EMAIL SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "📧 Configuration:"
echo "   SMTP: smtp.resend.com:587"
echo "   From: noreply@balkly.live"
echo "   API Key: re_ekq54c3z...CaHWB"
echo ""
echo "🧪 Test registration:"
echo "   1. Visit https://balkly.live/auth/register"
echo "   2. Register new user"
echo "   3. Check email for welcome message"
echo ""
echo "📊 Monitor emails at:"
echo "   https://resend.com/emails"
echo ""

