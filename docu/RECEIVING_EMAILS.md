# Receiving Emails at @balkly.live Addresses

## 📧 **How It Works:**

When someone sends an email to ANY `@balkly.live` address:

1. **Email arrives at Resend** (via MX records)
2. **Resend triggers webhook** → `https://balkly.live/api/v1/webhooks/resend`
3. **Balkly automatically forwards** → Your Gmail/Outlook (`h.kravarevic@gmail.com`)

---

## ✉️ **Available Email Addresses:**

All these addresses work automatically and forward to your Gmail:

- **info@balkly.live** - General inquiries
- **support@balkly.live** - Customer support
- **haris.kravarevic@balkly.live** - Personal email
- **ANY@balkly.live** - Any address works!

---

## 📥 **How to Receive in Outlook:**

### **Option 1: Check Your Gmail (h.kravarevic@gmail.com)**

All emails are **automatically forwarded** to your Gmail! Just check your Gmail inbox.

### **Option 2: Add Gmail to Outlook**

1. Open **Outlook**
2. Go to **File** → **Add Account**
3. Enter: `h.kravarevic@gmail.com`
4. Enter your Gmail password
5. Done! You'll see forwarded emails in Outlook

### **Option 3: Forward Gmail → Outlook**

If you have a separate Outlook email:

1. Go to Gmail Settings → **Forwarding and POP/IMAP**
2. Add forwarding address: `your-outlook@outlook.com`
3. Verify the forwarding address
4. Set up filter: Forward emails with subject containing "[Balkly"

---

## 🎯 **Email Flow:**

```
Customer sends to: support@balkly.live
        ↓
Arrives at Resend (MX records)
        ↓
Webhook to: balkly.live/api/v1/webhooks/resend
        ↓
Forwarded to: h.kravarevic@gmail.com
        ↓
You see it in Gmail/Outlook!
```

Subject will be: `[Balkly - support@balkly.live] Original Subject`

---

## 📤 **Sending FROM @balkly.live:**

### **Method 1: Through Balkly Platform**
- When users contact support through the site
- System sends from `support@balkly.live` automatically

### **Method 2: Gmail "Send As"**

1. In Gmail, go to **Settings** → **Accounts**
2. Click **Add another email address**
3. Enter: `info@balkly.live` or `support@balkly.live`
4. SMTP Server: Use Resend SMTP:
   - Server: `smtp.resend.com`
   - Port: `465` (SSL) or `587` (TLS)
   - Username: `resend`
   - Password: `re_ekq54c3z_6FjSE9sTJJs5kCV2vAuCaHWB`
5. Verify and done!

Now in Gmail, you can choose to send from `@balkly.live` addresses!

---

## 📋 **What You Get:**

✅ **Receive emails** at any @balkly.live address
✅ **Auto-forward** to your Gmail
✅ **Send from** @balkly.live in Gmail
✅ **Professional** domain email
✅ **Track** opens, clicks in Resend dashboard
✅ **Spam-free** delivery with verified domain

---

## 🧪 **Test the System:**

1. Send email to: `test@balkly.live` from your phone
2. Check `h.kravarevic@gmail.com` 
3. You should receive forwarded email with subject: `[Balkly - test@balkly.live] ...`

**Everything is automatic!** 🎉

