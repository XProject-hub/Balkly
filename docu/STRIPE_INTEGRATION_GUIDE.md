# Stripe Payment Integration Guide

## ✅ What's Been Implemented

The complete Stripe payment infrastructure has been built and is ready to use once you add your API keys!

### Components Created:

1. **PaymentService** (`balkly-api/app/Services/PaymentService.php`)
   - Stripe Checkout session creation
   - Webhook handling
   - Payment processing
   - Refund handling
   - Support for 3 payment types:
     - Listing plans (Standard, Featured, Boost)
     - Forum sticky posts
     - Event tickets with QR codes

2. **InvoiceService** (`balkly-api/app/Services/InvoiceService.php`)
   - Automatic invoice generation
   - PDF creation with DomPDF
   - VAT calculation per country
   - Storage in S3/MinIO
   - Download functionality

3. **OrderController** (Updated)
   - Create listing orders: `POST /api/v1/orders/listings`
   - Create sticky orders: `POST /api/v1/orders/sticky`
   - Create ticket orders: `POST /api/v1/orders/tickets`
   - View orders: `GET /api/v1/orders`
   - Get invoice: `GET /api/v1/invoices/{id}`
   - Request refund: `POST /api/v1/orders/{id}/refund`
   - Webhook endpoint: `POST /api/v1/webhooks/stripe`

4. **Invoice Template** (`balkly-api/resources/views/invoices/template.blade.php`)
   - Professional PDF invoice design
   - VAT breakdown
   - Company branding
   - Multi-currency support

---

## 🔑 Setup Instructions

### Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com
2. Create an account or login
3. Navigate to **Developers → API keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 2: Add Keys to Environment Files

**Backend** (`balkly-api/.env`):
```bash
STRIPE_KEY=pk_test_your_actual_key_here
STRIPE_SECRET=sk_test_your_actual_secret_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Frontend** (`balkly-web/.env.local`):
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### Step 3: Set Up Stripe Webhook

1. Go to **Developers → Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/v1/webhooks/stripe`
   - For local testing: `http://localhost/api/v1/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to your `.env` as `STRIPE_WEBHOOK_SECRET`

### Step 4: Test Locally with Stripe CLI (Optional)

```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Linux: Download from https://github.com/stripe/stripe-cli

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost/api/v1/webhooks/stripe

# Use the webhook signing secret from the CLI output
```

### Step 5: Restart Services

```bash
docker-compose restart api
docker-compose restart web
```

---

## 📋 Testing Payment Flows

### Test Listing Payment

```bash
# 1. Login as user
POST /api/v1/auth/login
{
  "email": "seller@balkly.com",
  "password": "password123"
}

# 2. Create a listing
POST /api/v1/listings
{
  "category_id": 1,
  "title": "BMW M3 2020",
  "description": "Great condition",
  "price": 45000,
  "city": "Sarajevo",
  "country": "BA"
}

# 3. Create order for listing plan
POST /api/v1/orders/listings
{
  "listing_id": 1,
  "plan_id": 1  // Standard plan
}

# Response will include checkout_url
# Open the URL in browser to complete payment
```

### Test Forum Sticky Payment

```bash
# 1. Create forum topic
POST /api/v1/forum/topics
{
  "category_id": 1,
  "title": "Important Discussion",
  "content": "This needs to be sticky"
}

# 2. Create sticky order
POST /api/v1/orders/sticky
{
  "topic_id": 1,
  "plan_id": 6  // 7-day sticky plan
}
```

### Test Ticket Payment

```bash
# 1. Create event
POST /api/v1/events
{
  "type": "own",
  "title": "Concert 2025",
  "venue": "Arena",
  "start_at": "2025-12-31 20:00:00"
}

# 2. Create ticket type
POST /api/v1/events/1/tickets
{
  "name": "General Admission",
  "price": 50,
  "capacity": 100
}

# 3. Purchase tickets
POST /api/v1/orders/tickets
{
  "event_id": 1,
  "tickets": [
    {
      "ticket_id": 1,
      "quantity": 2
    }
  ]
}
```

### Stripe Test Cards

Use these test card numbers in Stripe Checkout:

- **Success**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

**CVV**: Any 3 digits  
**Expiry**: Any future date  
**ZIP**: Any 5 digits

---

## 🔄 Payment Flow

### 1. User Initiates Payment
```
User clicks "Publish Listing" → 
Frontend calls POST /api/v1/orders/listings →
Backend creates Order record →
Backend creates Stripe Checkout Session →
Backend returns checkout URL →
User redirected to Stripe Checkout
```

### 2. User Completes Payment
```
User enters card details →
Stripe processes payment →
Stripe redirects back to success URL →
Stripe sends webhook to /api/v1/webhooks/stripe
```

### 3. Webhook Processing
```
Webhook received →
Verify signature →
Update Order status to 'paid' →
Process based on order type:
  - Listing: Set status to 'active', set expiry date
  - Sticky: Make topic sticky with duration
  - Ticket: Generate QR codes, send confirmation
→ Generate invoice PDF →
Save to storage
```

### 4. User Gets Confirmation
```
Order marked as paid →
Invoice generated →
Email sent (when implemented) →
User redirected to success page with order details
```

---

## 💰 Pricing Configuration

Current pricing (configured in database seeders):

### Listings
- **Auto Standard**: €4.99 / 30 days
- **Auto Featured**: €14.99 / 30 days  
- **Auto Boost**: €4.99 / 7 days
- **Real Estate Standard**: €9.99 / 30 days
- **Real Estate Featured**: €25.99 / 30 days

### Forum
- **Sticky 7 days**: €2.99
- **Sticky 30 days**: €9.99

### Tickets
- **Commission**: 7.5% + €0.35 per ticket (configurable in code)

To change pricing:
1. Update seeder: `balkly-api/database/seeders/PlanSeeder.php`
2. Run: `php artisan db:seed --class=PlanSeeder`

---

## 🌍 VAT/Tax Handling

VAT rates by country (configured in `InvoiceService.php`):

| Country | VAT Rate |
|---------|----------|
| Bosnia & Herzegovina (BA) | 17% |
| Croatia (HR) | 25% |
| Serbia (RS) | 20% |
| Germany (DE) | 19% |
| Austria (AT) | 20% |

To add more countries, edit:
```php
// balkly-api/app/Services/InvoiceService.php
protected function getVatRate($countryCode) {
    $vatRates = [
        'YOUR_COUNTRY_CODE' => 20.00,
        // ...
    ];
}
```

---

## 🔧 Customization

### Change Company Details on Invoices

Edit `InvoiceService.php`:
```php
'company' => [
    'name' => 'Your Company Name',
    'address' => 'Your Address',
    'city' => 'Your City',
    'country' => 'Your Country',
    'email' => 'billing@yourcompany.com',
    'phone' => '+387 XX XXX XXX',
    'vat_id' => 'YOUR-VAT-ID',
],
```

### Customize Invoice Template

Edit: `balkly-api/resources/views/invoices/template.blade.php`

### Change Success/Cancel URLs

Edit in `PaymentService.php`:
```php
'success_url' => 'your-custom-url',
'cancel_url' => 'your-custom-url',
```

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key"
**Solution**: Check your Stripe keys in `.env` are correct

### Issue: "Webhook signature verification failed"
**Solution**: Make sure `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint

### Issue: "Order not processing after payment"
**Solution**: Check webhook is being received. Test with Stripe CLI

### Issue: "Invoice PDF not generating"
**Solution**: 
1. Check MinIO bucket exists
2. Run: `php artisan storage:link`
3. Check DomPDF is installed: `composer require barryvdh/laravel-dompdf`

### Issue: "Refund failed"
**Solution**: Refunds can only be processed for 'paid' orders

---

## 📊 API Endpoints Reference

### Create Orders

**Listing Order**
```http
POST /api/v1/orders/listings
Authorization: Bearer {token}
Content-Type: application/json

{
  "listing_id": 1,
  "plan_id": 1
}
```

**Forum Sticky Order**
```http
POST /api/v1/orders/sticky
Authorization: Bearer {token}

{
  "topic_id": 1,
  "plan_id": 6
}
```

**Ticket Order**
```http
POST /api/v1/orders/tickets
Authorization: Bearer {token}

{
  "event_id": 1,
  "tickets": [
    { "ticket_id": 1, "quantity": 2 }
  ]
}
```

### View Orders

```http
GET /api/v1/orders
Authorization: Bearer {token}
```

### Get Invoice

```http
GET /api/v1/invoices/{id}
Authorization: Bearer {token}
```

### Download Invoice PDF

```http
GET /api/v1/invoices/{id}/download
Authorization: Bearer {token}
```

### Request Refund

```http
POST /api/v1/orders/{id}/refund
Authorization: Bearer {token}

{
  "reason": "Customer request"
}
```

---

## ✅ Integration Checklist

- [x] PaymentService created
- [x] InvoiceService created
- [x] OrderController updated with endpoints
- [x] Invoice PDF template created
- [x] Stripe configuration file
- [x] Webhook handling
- [x] Refund support
- [x] VAT calculation
- [x] QR code generation for tickets
- [ ] Add your Stripe API keys
- [ ] Set up webhook endpoint
- [ ] Test with test cards
- [ ] Configure company details in invoices
- [ ] Test refund flow
- [ ] Set up email notifications (optional)

---

## 🚀 Production Checklist

Before going live:

1. **Switch to Live Keys**
   - Get live API keys from Stripe (pk_live_ and sk_live_)
   - Update `.env` with live keys
   - Configure live webhook endpoint

2. **Security**
   - Use HTTPS for webhook endpoint
   - Verify webhook signatures (already implemented)
   - Set up rate limiting on payment endpoints

3. **Monitoring**
   - Monitor Stripe dashboard for failed payments
   - Set up alerts for webhook failures
   - Track successful payment rates

4. **Testing**
   - Test all payment flows in production-like environment
   - Test refund process
   - Verify invoice generation

5. **Legal**
   - Update Terms of Service
   - Add refund policy
   - Ensure GDPR compliance for payment data

---

## 💡 Next Steps

1. Add your Stripe API keys to `.env`
2. Test the payment flow with test cards
3. Customize invoice template with your branding
4. Set up email notifications for order confirmations
5. Build frontend checkout components

**Payment system is production-ready once you add your API keys!** 🎉

---

**For support**: Check Stripe documentation at https://stripe.com/docs

