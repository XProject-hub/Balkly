# 🔑 Admin Access - Balkly Platform

## 👨‍💼 Admin Account

**Email**: `admin@balkly.com`  
**Password**: `password123`

**⚠️ IMPORTANT**: Change this password after first login in production!

---

## 📊 Admin Features Available

### 1. **Dashboard** (`/admin`)
- Platform overview
- Quick stats (users, listings, revenue)
- Recent activity

### 2. **Advanced Analytics** (`/admin/analytics-full`)
- **Website Traffic**: Total visits, unique visitors
- **Time Tracking**: Average time on site, bounce rate
- **Device Breakdown**: Desktop, mobile, tablet usage
- **Browser Stats**: Chrome, Firefox, Safari, etc.
- **Top Pages**: Most visited pages
- **Conversion Funnel**: Visit → Registration → Listing → Payment
- **Revenue Trends**: Daily/weekly/monthly revenue
- **User Growth**: New users over time

### 3. **Ad Banner Management** (`/admin/banners`)
- Create image or HTML banners
- Multiple positions (homepage, listings, events, forum)
- Track impressions & clicks
- CTR (Click-through rate) statistics
- Schedule start/end dates
- Active/inactive toggle

### 4. **Content Moderation** (`/admin/moderation`)
- Review pending listings
- Content safety scoring
- Approve/reject with one click
- Bulk operations

### 5. **User Management** (`/admin/users`)
- Search users by name/email
- Filter by role
- View user details
- Ban/suspend users
- See verification status (email, 2FA)

### 6. **Manage All Content**
- Listings, events, forum posts
- Edit, delete, or feature items
- User reports review

---

## 🎯 Ad Banner Positions

You can place banners in these locations:

- `homepage_top` - Top of homepage (after hero)
- `homepage_sidebar` - Homepage right sidebar
- `listings_top` - Above listings grid
- `listings_sidebar` - Listings page sidebar
- `events_top` - Events page top
- `forum_top` - Forum page top

**Banner Types**:
- **Image**: Upload image URL, add link
- **HTML**: Custom HTML code for ads

---

## 📈 Analytics Tracking

The platform automatically tracks:
- Every page visit
- Time spent on each page
- Device type (desktop/mobile/tablet)
- Browser used
- User location (IP-based)
- Conversion events

**Access**: `/admin/analytics-full`

---

## 💰 Revenue Tracking

View all payments:
- Total revenue (all time, today, week, month)
- Revenue by type (listings, forum, tickets)
- Revenue trends over time
- Payment success/failure rates

---

## 🚀 Quick Actions

### View All Users:
```
Visit: /admin/users
Search, filter, ban users
```

### Create Ad Banner:
```
Visit: /admin/banners
Click "New Banner"
Upload image or HTML
Select position
Set active
```

### View Analytics:
```
Visit: /admin/analytics-full
Select time period (7/30/90 days)
View all metrics
```

---

## ⚠️ Security Recommendations

1. **Change admin password immediately**:
   - Go to `/settings/security`
   - Update password

2. **Enable 2FA for admin account**:
   - Go to `/settings/security`
   - Enable Two-Factor Authentication
   - Save recovery codes

3. **Restrict admin access**:
   - Only access from trusted IPs
   - Use strong password
   - Enable 2FA

---

**Admin dashboard is fully functional - login and explore all features!** ✅

