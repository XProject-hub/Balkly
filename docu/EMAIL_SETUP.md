# Email Configuration for Balkly

## ✅ CURRENT SETUP: Self-Hosted Mail Server (mail.balkly.live)

**Your mail server is set up and running!**

### Mail Server Details:
- **SMTP Host:** `mail.balkly.live`
- **SMTP Port:** `587` (TLS)
- **IMAP Port:** `993` (SSL)
- **Accounts:**
  - `info@balkly.live` (verification emails)
  - `support@balkly.live` (support emails)
- **Password:** `Sarajevo1323`
- **Webmail:** `https://mail.balkly.live` (Roundcube)

### .env Configuration (Already Set):

```env
MAIL_MAILER=smtp
MAIL_HOST=mail.balkly.live
MAIL_PORT=587
MAIL_USERNAME=info@balkly.live
MAIL_PASSWORD=Sarajevo1323
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@balkly.live
MAIL_FROM_NAME="Balkly"
```

---

## 📧 Email Verification Flow

### How It Works:

1. **User Registers** → System sends verification email from `info@balkly.live`
2. **User Cannot Login** → Until they click the verification link
3. **User Clicks Link** → Email is verified, they can now login
4. **Resend Option** → Users can request new verification email from login page

### Key Points:
- ✅ Verification email sent immediately after registration
- ✅ Login blocked until email verified
- ✅ Resend verification available without logging in
- ✅ 60-minute link expiration
- ✅ Social login users (Google/Facebook) are auto-verified

---

## DNS Records Required

Add these DNS records at your domain registrar (balkly.live):

| Type | Name | Value |
|------|------|-------|
| MX | @ | `mail.balkly.live` (Priority: 10) |
| A | mail | `91.211.90.11` |
| TXT | @ | `v=spf1 ip4:91.211.90.11 mx -all` |
| TXT | default._domainkey | (DKIM key from OpenDKIM) |
| TXT | _dmarc | `v=DMARC1; p=none; rua=mailto:postmaster@balkly.live` |

---

## Alternative Options

### Option 1: Resend (Modern, Developer-Friendly)

```env
RESEND_API_KEY=re_your_api_key_here
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=info@balkly.live
MAIL_FROM_NAME="Balkly"
```

### Option 2: SendGrid (Free 100 emails/day)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=YOUR_SENDGRID_API_KEY
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@balkly.live
MAIL_FROM_NAME="Balkly"
```

### Option 3: Gmail SMTP (Testing Only)

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

## Apply Configuration

```bash
# On your server:
cd /var/www/balkly

# Edit .env file (if not using Docker env)
nano balkly-api/.env

# Restart API to load new config
docker-compose restart api queue

# Clear config cache
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan cache:clear
```

---

## What Emails Are Sent:

| Email Type | From Address | Description |
|------------|--------------|-------------|
| ✅ Email Verification | `info@balkly.live` | Sent after registration |
| ✅ Password Reset | `info@balkly.live` | Sent when user forgets password |
| ✅ Welcome Email | `info@balkly.live` | Sent after email verification |
| ✅ Order Confirmation | `info@balkly.live` | When user makes a purchase |
| ✅ Ticket QR Codes | `info@balkly.live` | Event tickets with QR |
| ✅ Contact Form Reply | `support@balkly.live` | Auto-reply to contact submissions |

---

## Troubleshooting

### Emails Not Sending?

1. **Check mail server status:**
   ```bash
   systemctl status postfix dovecot opendkim
   ```

2. **Check mail logs:**
   ```bash
   tail -f /var/log/mail.log
   ```

3. **Test SMTP connection:**
   ```bash
   swaks --to test@example.com --from info@balkly.live --server mail.balkly.live --port 587 --tls --auth LOGIN --auth-user info@balkly.live --auth-password Sarajevo1323
   ```

### Emails Going to Spam?

1. **Verify DNS records** - SPF, DKIM, DMARC must be set
2. **Check DKIM signing** - Emails should be signed
3. **Warm up IP** - New mail servers need reputation building

---

## Test Email Verification

```bash
# Register a new user and check logs:
docker exec balkly_api php artisan tinker --execute="
\$user = App\Models\User::where('email', 'test@example.com')->first();
echo 'Verified: ' . (\$user->email_verified_at ? 'Yes' : 'No');
"
```
