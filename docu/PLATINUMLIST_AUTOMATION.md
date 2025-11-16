# Platinumlist Events Automation Guide

## 📋 Overview

Your Balkly platform now automatically fetches events from **Platinumlist** and displays them with your affiliate referral link: `?ref=zjblytn`

---

## 🎯 How It Works

### 1. **Automatic Daily Updates**
- Laravel command runs every day at 3 AM
- Fetches latest events from Platinumlist XML feed
- Saves them as affiliate events in your database
- Frontend automatically displays them

### 2. **Affiliate Revenue**
- Every event link includes: `https://platinumlist.net/aff/?ref=zjblytn&link=`
- When users click "Get Tickets" → You earn commission
- All clicks are tracked via Google Analytics

### 3. **Current Events**
**15 Featured Attractions** (always available):
1. Burj Khalifa - At The Top
2. Skydive Dubai - Tandem Jump
3. Atlantis Aquaventure Waterpark
4. IMG Worlds of Adventure
5. Guided Tours Inside Burj Al Arab
6. Dubai Safari Park
7. Dubai Frame - Sky Bridge
8. Ski Dubai - Snow Park
9. Jebel Jais Flight - Zipline
10. Dubai Miracle Garden
11. Dubai Helicopter Tour
12. The View at The Palm
13. Desert Safari with BBQ Dinner
14. Dubai Museums & Heritage
15. Water Sports & Activities

---

## ⚙️ Setup Automation (On Your Server)

### Option 1: Manual Test (Run Once)

```bash
# SSH to your server
cd /var/www/balkly

# Run the command manually to test
docker exec balkly_api php artisan platinumlist:fetch

# You should see:
# 🎪 Fetching events from Platinumlist...
# ✓ Added: Event Name 1
# ✓ Added: Event Name 2
# ✅ Successfully imported X events
```

### Option 2: Automatic Daily Updates (Recommended)

The schedule is **already configured** to run daily at 3 AM!

```bash
# Verify the schedule is set up
docker exec balkly_api php artisan schedule:list

# You should see:
# platinumlist:fetch ..... Every day at 03:00
```

### Option 3: Force Update Now

```bash
# Force fetch events right now (don't wait for 3 AM)
docker exec balkly_api php artisan platinumlist:fetch
```

---

## 🔗 Affiliate Links

### Format
```
Base URL: https://platinumlist.net/aff/?ref=zjblytn&link=
Example: https://platinumlist.net/aff/?ref=zjblytn&link=https%3A%2F%2Fburj-khalifa.platinumlist.net
```

### Your Affiliate Ref
```
zjblytn
```

### How to Add Manually
For any Platinumlist attraction landing page, just add:
```
?ref=zjblytn
```

Example:
```
https://burj-khalifa.platinumlist.net/?ref=zjblytn
https://skydive.platinumlist.net/?ref=zjblytn
https://imgworld.platinumlist.net/?ref=zjblytn
```

---

## 📊 Data Sources

### XML Feed (Automatic Updates)
- **URL**: https://bit.ly/pl_events
- **Content**: All upcoming events
- **Update**: Real-time from Platinumlist
- **Format**: XML with event details

### Attractions Landing Pages
- **URL**: https://bit.ly/attractions-landings
- **Content**: All attraction subdomains
- **Use**: Manual reference or scraping

### Direct Website
- **URL**: https://platinumlist.net/
- **Method**: Not recommended (requires web scraping)
- **Better**: Use XML feed instead

---

## 🚀 Recommended Approach: XML Feed Automation

### Why XML Feed is Best:
✅ **Automatic** - Runs daily, no manual work  
✅ **Reliable** - Direct from Platinumlist  
✅ **Up-to-date** - Latest events always  
✅ **Scalable** - Handles any number of events  
✅ **Approved** - Official Platinumlist method  

### How It Works:
```
3:00 AM Daily
    ↓
Laravel command runs
    ↓
Fetches XML from Platinumlist
    ↓
Parses event data
    ↓
Adds affiliate ref: zjblytn
    ↓
Saves to your database
    ↓
Frontend shows automatically
    ↓
Users click → You earn! 💰
```

---

## 🛠️ Manual Run Instructions

### Test the Command Now:

```bash
# SSH to server
ssh root@balkly.live

# Navigate to project
cd /var/www/balkly

# Run command
docker exec balkly_api php artisan platinumlist:fetch

# Check events in database
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "SELECT id, title, type, city FROM events WHERE type='affiliate' ORDER BY created_at DESC LIMIT 10;"
```

---

## 📈 Monitoring & Analytics

### Check Event Count
```bash
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "SELECT COUNT(*) as total_events, type FROM events GROUP BY type;"
```

### View Latest Affiliate Events
```bash
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "SELECT title, city, start_at, partner_url FROM events WHERE type='affiliate' LIMIT 5;"
```

### Track Affiliate Clicks
- Check Google Analytics → Events → `affiliate_click`
- Event label = Event name
- Value = Event ID

---

## 🔄 Update Frequency

### Current Setup:
- **Frequency**: Daily at 3:00 AM
- **Timezone**: Server timezone (UAE: GST)
- **Duration**: ~30 seconds per run
- **New Events**: Added automatically
- **Duplicate Prevention**: Checks existing before adding

### Change Frequency (Optional):

Edit `balkly-api/routes/console.php`:

```php
// Hourly
Schedule::command('platinumlist:fetch')->hourly();

// Twice daily
Schedule::command('platinumlist:fetch')->twiceDaily(3, 15);

// Every 6 hours
Schedule::command('platinumlist:fetch')->everySixHours();
```

---

## 🐛 Troubleshooting

### Events Not Updating?

```bash
# Check if cron is running
docker exec balkly_api php artisan schedule:work

# Or check crontab
crontab -l
```

### Command Fails?

```bash
# Check logs
docker logs balkly_api | grep platinumlist

# Run with verbose output
docker exec balkly_api php artisan platinumlist:fetch -v
```

### No New Events?

```bash
# Check XML feed is accessible
curl -I https://bit.ly/pl_events

# Manually run command
docker exec balkly_api php artisan platinumlist:fetch
```

---

## 💰 Revenue Tracking

### Where to See Earnings:
1. **Platinumlist Dashboard** - Login to your affiliate account
2. **Google Analytics** - Track clicks and conversions
3. **Your Database** - See which events get most views

### Optimize Revenue:
- Promote high-ticket events (Skydive, Burj Al Arab, Helicopter)
- Feature seasonal events (Miracle Garden, Desert Safari)
- Target specific audiences (Balkan Night for community)

---

## 📝 Next Steps

### Immediate:
1. ✅ Run manual fetch to test: `docker exec balkly_api php artisan platinumlist:fetch`
2. ✅ Visit `/events` to see all Platinumlist attractions
3. ✅ Click "Get Tickets" to test affiliate link

### This Week:
1. Monitor which events get most clicks
2. Check Platinumlist dashboard for conversions
3. Adjust event descriptions for better SEO

### Long Term:
1. Add more event categories
2. Create event recommendation engine
3. Email notifications for new events
4. Social media auto-posting

---

## 🎉 You're All Set!

Your platform now:
- ✅ **Automatically fetches** Platinumlist events daily
- ✅ **Displays 15+ attractions** with your affiliate link
- ✅ **Tracks clicks** for analytics
- ✅ **Earns commission** on every ticket sale

**Just sit back and let the automation work!** 💰

---

*Last Updated: November 16, 2025*
*Affiliate Ref: zjblytn*

