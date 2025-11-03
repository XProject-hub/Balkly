# 🚀 Balkly Platform - Production Launch Checklist

**Use this checklist before going live!**

---

## ⚡ PRE-LAUNCH (Critical)

### 1. Environment Configuration
- [ ] Copy `.env.example` files to `.env`
- [ ] Generate Laravel APP_KEY (`php artisan key:generate`)
- [ ] Add **Stripe LIVE API keys** (pk_live_ and sk_live_)
- [ ] Add OpenAI API key (for smart features)
- [ ] Configure production database credentials
- [ ] Set `APP_ENV=production` and `APP_DEBUG=false`
- [ ] Configure email service (SendGrid/Postmark)
- [ ] Update `APP_URL` to your domain

### 2. Database Setup
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Seed initial data: `php artisan db:seed --force`
- [ ] Verify all tables created
- [ ] Create admin user
- [ ] Test database connection

### 3. Storage & Media
- [ ] Create MinIO bucket: `balkly-media`
- [ ] Set bucket to public-read
- [ ] Test image upload
- [ ] Configure CDN (optional)
- [ ] Set up backup automation

### 4. Payment Setup
- [ ] Add Stripe live API keys
- [ ] Configure Stripe webhook endpoint: `https://yourdomain.com/api/v1/webhooks/stripe`
- [ ] Test webhook with Stripe CLI
- [ ] Test payment with real card
- [ ] Verify invoice generation
- [ ] Test refund flow

### 5. Security
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure firewall (UFW)
- [ ] Enable Fail2Ban
- [ ] Restrict .env file permissions: `chmod 600 .env`
- [ ] Change default database passwords
- [ ] Enable rate limiting
- [ ] Add security headers in Nginx
- [ ] Review CORS settings

### 6. DNS & Domain
- [ ] Point domain A record to server IP
- [ ] Configure www subdomain
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Verify domain resolves correctly

---

## 🎨 CONTENT & BRANDING

### Homepage
- [ ] Add hero video background (see VIDEO_HERO_GUIDE.md)
- [ ] Update company information in footer
- [ ] Add social media links
- [ ] Update contact email
- [ ] Test all navigation links

### Branding
- [ ] Add logo to `/ico` and `/logo` folders
- [ ] Generate PWA icons (72x72 to 512x512)
- [ ] Add favicon.ico
- [ ] Update brand colors in tailwind.config.ts
- [ ] Update company name in invoices

### Content Pages
- [ ] Create Terms of Service
- [ ] Create Privacy Policy
- [ ] Create Refund Policy
- [ ] Create FAQ page
- [ ] Add safety tips
- [ ] Create help center

---

## 🧪 TESTING

### Functional Testing
- [ ] User registration works
- [ ] Login works
- [ ] Create listing wizard (all 4 steps)
- [ ] Payment checkout completes
- [ ] Invoice PDF generates
- [ ] Email notifications send (when configured)
- [ ] Chat messaging works
- [ ] Forum post creation
- [ ] Sticky payment works
- [ ] Event ticket purchase
- [ ] QR code generation
- [ ] Search returns results
- [ ] Admin can moderate content

### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Mobile Testing
- [ ] Responsive on iPhone
- [ ] Responsive on Android
- [ ] Touch interactions work
- [ ] Forms work on mobile
- [ ] PWA installation works

### Performance Testing
- [ ] Homepage loads < 3 seconds
- [ ] Listing pages load < 2 seconds
- [ ] Images are optimized
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## 📧 NOTIFICATIONS (Recommended)

### Email Setup
- [ ] Configure SMTP (SendGrid recommended)
- [ ] Test email sending
- [ ] Create welcome email template
- [ ] Create order confirmation template
- [ ] Create ticket email template
- [ ] Create message notification template

### Email Templates Needed:
1. Welcome email (after registration)
2. Order confirmation (with invoice)
3. Ticket purchase (with QR codes)
4. Message notification
5. Listing approved/rejected
6. Password reset
7. 2FA codes

---

## 🔧 OPTIMIZATION

### Performance
- [ ] Enable Redis caching
- [ ] Configure OPcache for PHP
- [ ] Enable Gzip compression in Nginx
- [ ] Set up CDN for static assets
- [ ] Optimize images (already done via Intervention)
- [ ] Enable browser caching headers
- [ ] Minimize CSS/JS (Next.js does this)

### Database
- [ ] Review slow queries
- [ ] Add missing indexes (already optimized)
- [ ] Set up query caching
- [ ] Configure connection pooling

### Monitoring
- [ ] Set up uptime monitoring (Uptime Kuma)
- [ ] Configure error tracking (Sentry)
- [ ] Set up log rotation
- [ ] Create monitoring alerts
- [ ] Configure backup alerts

---

## 🔐 SECURITY AUDIT

### Pre-Launch Security
- [ ] Change all default passwords
- [ ] Review API rate limits
- [ ] Test authentication flows
- [ ] Verify CSRF protection
- [ ] Test XSS prevention
- [ ] Test SQL injection prevention
- [ ] Review file upload security
- [ ] Verify webhook signatures work
- [ ] Test user permissions
- [ ] Review admin access controls

### Post-Launch Monitoring
- [ ] Monitor failed login attempts
- [ ] Watch for spam listings
- [ ] Review moderation queue daily
- [ ] Check for suspicious payments
- [ ] Monitor error logs

---

## 📊 ANALYTICS

### Setup Analytics
- [ ] Install PostHog or Plausible (optional)
- [ ] Configure Google Analytics (optional)
- [ ] Set up conversion tracking
- [ ] Configure goals/events
- [ ] Test analytics firing

### Key Metrics to Track:
- User registrations
- Listing creations
- Successful payments
- Message counts
- Search queries
- Page views
- Conversion rates

---

## 🎯 GO-LIVE

### Day of Launch
- [ ] **Final backup** of everything
- [ ] Deploy to production server
- [ ] Run migrations
- [ ] Seed categories and plans
- [ ] Test all critical flows
- [ ] Verify payments work
- [ ] Check email notifications
- [ ] Monitor error logs
- [ ] Test from mobile device
- [ ] Share on social media 🎉

### First 24 Hours
- [ ] Monitor server resources
- [ ] Watch error logs closely
- [ ] Test user signups
- [ ] Verify payments processing
- [ ] Check webhook delivery
- [ ] Respond to user feedback
- [ ] Fix any critical bugs

### First Week
- [ ] Daily monitoring
- [ ] User feedback collection
- [ ] Performance optimization
- [ ] Content moderation
- [ ] Marketing push
- [ ] Customer support
- [ ] Bug fixes

---

## 📝 NICE-TO-HAVE (Not Blocking)

These can be added after launch:

- [ ] Calendar view for events
- [ ] Map view with pins
- [ ] Saved favorites
- [ ] User reviews/ratings
- [ ] Advanced search filters
- [ ] Seller insights dashboard
- [ ] Email campaigns
- [ ] Referral program
- [ ] Mobile apps
- [ ] Advanced analytics
- [ ] A/B testing
- [ ] Loyalty program

---

## ✅ LAUNCH CRITERIA

**Minimum Requirements to Launch:**
- ✅ Users can register and login
- ✅ Listings can be created and paid for
- ✅ Payments process successfully
- ✅ Invoices generate correctly
- ✅ Site is secure (HTTPS)
- ✅ Mobile responsive
- ✅ No critical bugs
- ✅ Admin can moderate

**Your Platform**: **MEETS ALL CRITERIA!** ✅

---

## 🎊 POST-LAUNCH

### Marketing
- [ ] Announce on social media
- [ ] Email marketing campaign
- [ ] Partner outreach
- [ ] SEO optimization
- [ ] Content marketing
- [ ] Community building

### Growth
- [ ] Analyze user behavior
- [ ] Optimize conversion funnel
- [ ] Add requested features
- [ ] Improve based on feedback
- [ ] Scale infrastructure

---

## 🆘 EMERGENCY CONTACTS

**If Something Goes Wrong:**

1. **Site Down**: Check docker-compose logs
2. **Payments Failing**: Verify Stripe keys, check webhooks
3. **Images Not Loading**: Check MinIO bucket permissions
4. **Database Errors**: Check connection, run migrations
5. **High CPU**: Enable Redis caching, optimize queries

**Support Resources:**
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Stripe Guide: `STRIPE_INTEGRATION_GUIDE.md`
- Features List: `FEATURES_CHECKLIST.md`

---

## 🎯 READY TO LAUNCH?

**✅ YES!** - If you've completed the critical sections above.

**⚠️ ALMOST** - If you need email notifications first.

**❌ NOT YET** - If payments aren't configured.

---

**Good luck with your launch! 🚀🎉**

**Questions?** Review the comprehensive documentation in the project root.

