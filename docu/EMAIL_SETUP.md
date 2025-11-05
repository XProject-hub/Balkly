# Email Configuration for Balkly

## Option 1: Gmail SMTP (Free - Recommended for Testing)

1. **Create App Password in Gmail:**
   - Go to https://myaccount.google.com/apppasswords
   - Create app password for "Balkly"
   - Copy the 16-character password

2. **Update .env:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Balkly"
```

---

## Option 2: SendGrid (Free 100 emails/day)

1. **Create SendGrid Account:**
   - Go to https://sendgrid.com
   - Sign up for free account
   - Create API Key

2. **Update .env:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=YOUR_SENDGRID_API_KEY
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@balkly.live
MAIL_FROM_NAME="Balkly"
```

---

## Option 3: Mailgun (Free 1000 emails/month)

1. **Create Mailgun Account:**
   - Go to https://mailgun.com
   - Add domain: balkly.live
   - Get SMTP credentials

2. **Update .env:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@balkly.live
MAIL_PASSWORD=your-mailgun-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@balkly.live
MAIL_FROM_NAME="Balkly"
```

---

## How to Apply Configuration:

```bash
# On your server:
cd /var/www/balkly

# Edit .env file
nano balkly-api/.env

# Add email settings (use one of the options above)

# Restart API to load new config
docker-compose restart api

# Start Laravel server
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"

# Test email (send a test):
docker exec balkly_api bash -c "php artisan tinker --execute=\"Mail::raw('Test email from Balkly', function(\$m) { \$m->to('test@example.com')->subject('Test'); });\""
```

---

## What Emails Will Be Sent:

✅ **Welcome email** - When user registers
✅ **Email verification** - To verify new accounts
✅ **Password reset** - When user forgets password
✅ **Order confirmation** - When user makes a purchase
✅ **Ticket QR codes** - Event tickets with QR
✅ **Admin notifications** - For important events

---

## 🎯 Recommended for Production:

**SendGrid** or **Mailgun** - Both offer:
- Professional delivery
- Email tracking
- Good deliverability
- Free tier sufficient for starting out
- Easy setup

**Note:** Gmail works great for testing but may hit rate limits in production.

