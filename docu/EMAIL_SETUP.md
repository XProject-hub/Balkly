# Email Configuration for Balkly

## ✅ RECOMMENDED: Resend (Modern, Developer-Friendly)

**You're already registered! Here's how to complete setup:**

### **1. Add DNS Records (In Your Domain Registrar)**

Go to your domain provider and add these records from Resend dashboard:

```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEB... (copy from Resend)
TTL: Auto

Type: MX
Name: send
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10

Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
```

### **2. Configure on Your Server**

```bash
# On your server (91.211.90.121):
cd /var/www/balkly
nano balkly-api/.env

# Add these lines:
RESEND_API_KEY=re_ekq54c3z_6FjSE9sTJJs5kCV2vAuCaHWB
RESEND_WEBHOOK_SECRET=whsec_71Xtoa/kpD0v3xV3Wk9S48UvlocJGrea

MAIL_MAILER=resend
MAIL_FROM_ADDRESS=noreply@balkly.live
MAIL_FROM_NAME="Balkly"

# Save and exit

# Restart API
docker-compose restart api
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
```

### **3. Configure Webhook in Resend Dashboard**

1. Go to https://resend.com/webhooks
2. Add webhook endpoint: `https://balkly.live/api/v1/webhooks/resend`
3. Select events: `email.sent`, `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`
4. Save

### **4. Multiple Send Addresses**

In Resend, you can send from:
- ✉️ `noreply@balkly.live` (default)
- ✉️ `info@balkly.live` (just change from address)
- ✉️ `support@balkly.live` (change from address)
- ✉️ `haris.kravarevic@balkly.live` (change from address)

**No extra setup needed!** Once domain is verified, you can use ANY @balkly.live address!

---

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

