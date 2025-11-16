# 🚀 Deployment Instructions - Dark Theme & Events

## ✅ What's Ready to Deploy

### Features Completed:
1. ✅ **Full Dark Theme** - Works on all pages (homepage, events, listings, auth, forum)
2. ✅ **15 Platinumlist Events** - Real attractions with working images
3. ✅ **Affiliate Links** - All events use `?ref=zjblytn`
4. ✅ **Automatic Updates** - Laravel command to fetch from XML feed
5. ✅ **HTTPS Configuration** - SSL certificates properly mounted
6. ✅ **Theme Toggle** - Moon/Sun icon in header (desktop & mobile)

---

## 📋 Deploy to Server (Copy & Paste These Commands)

### Step 1: Pull Latest Code

```bash
cd /var/www/balkly
git reset --hard HEAD
git pull origin main
```

### Step 2: Restart Services

```bash
docker-compose down
docker-compose up -d
```

### Step 3: Start Laravel API

```bash
sleep 10
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
```

### Step 4: Test Events Automation (Optional but Recommended)

```bash
# Fetch Platinumlist events from XML feed
docker exec balkly_api php artisan platinumlist:fetch

# You should see:
# 🎪 Fetching events from Platinumlist...
# ✓ Added: Event Name 1
# ✅ Successfully imported X events
```

### Step 5: Verify Everything

```bash
# Check all containers are running
docker ps --format "table {{.Names}}\t{{.Status}}"

# All should show "Up" and "(healthy)"
```

---

## 🧪 Test on Website

### 1. Test Dark Theme:
```
1. Visit: https://balkly.live
2. Click MOON ICON (🌙) in header
3. Entire site turns dark ✅
4. Refresh - stays dark ✅
5. Click SUN ICON (☀️) - back to light ✅
```

### 2. Test Events:
```
1. Visit: https://balkly.live/events
2. See 15 events with images ✅
3. All have "FEATURED" purple badge ✅
4. Click "Burj Khalifa"
5. Click "Get Tickets"
6. Opens Platinumlist with ?ref=zjblytn ✅
```

### 3. Test Prices in Dark Mode:
```
1. Enable dark theme
2. Click any event
3. Price (AED value) should be clearly visible ✅
```

---

## 📊 What Changed

| Component | Change |
|-----------|--------|
| Header | + Theme toggle button with state management |
| Homepage | + Full dark theme support on all sections |
| Events Pages | + Dark theme + 15 Platinumlist attractions |
| Auth Pages | + Dark theme on inputs |
| Footer | Already had dark theme ✅ |
| Backend | + Laravel command for auto-updates |
| Images | Fixed with reliable CDN URLs |
| Nginx | + HTTPS/SSL configuration |

---

## 🤖 Automatic Events Updates

### How It Works:
- **Schedule**: Daily at 3:00 AM
- **Source**: Platinumlist XML feed (https://bit.ly/pl_events)
- **Method**: Laravel scheduled command
- **Duration**: ~30 seconds
- **Result**: Fresh events in database with affiliate links

### Manual Run (Anytime):
```bash
docker exec balkly_api php artisan platinumlist:fetch
```

### Check What Events Were Added:
```bash
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "SELECT title, city, partner_url FROM events WHERE type='affiliate' ORDER BY created_at DESC LIMIT 10;"
```

---

## 💰 Revenue Tracking

### Your Affiliate Setup:
- **Ref Code**: `zjblytn`
- **Base URL**: `https://platinumlist.net/aff/?ref=zjblytn&link=`
- **15 Events**: All attractions with affiliate links

### Example Affiliate Links:
```
https://platinumlist.net/aff/?ref=zjblytn&link=https://burj-khalifa.platinumlist.net
https://platinumlist.net/aff/?ref=zjblytn&link=https://skydive.platinumlist.net
https://platinumlist.net/aff/?ref=zjblytn&link=https://imgworld.platinumlist.net
```

### Track Revenue:
1. **Platinumlist Dashboard** - Your affiliate account
2. **Google Analytics** - Event tracking: `affiliate_click`
3. **Backend Logs** - Click tracking in console

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Site loads on https://balkly.live
- [ ] Dark theme toggle works (moon/sun icon)
- [ ] All pages respond to theme (home, events, listings, login)
- [ ] 15 events show on /events page
- [ ] Event images load correctly
- [ ] Prices visible in dark mode
- [ ] "Get Tickets" opens Platinumlist with ?ref=zjblytn
- [ ] Filter placeholder says "Dubai" not "Sarajevo"
- [ ] API responds (no 502 errors)

---

## 🐛 If Something Doesn't Work

### Site not loading?
```bash
docker logs balkly_nginx --tail 30
docker logs balkly_web --tail 30
```

### API errors (502)?
```bash
# Restart API
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
```

### Events not showing?
```bash
# Check if events exist
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "SELECT COUNT(*) as total FROM events;"

# Manually fetch from Platinumlist
docker exec balkly_api php artisan platinumlist:fetch
```

### Theme not working?
```bash
# Clear browser cache (Ctrl+Shift+Del)
# Or test in incognito mode
```

---

## 🎉 You're Ready!

All code is in Git. Just run the deploy commands above and everything will work!

**Total Time**: ~3 minutes to deploy

---

*Deployment Date: November 16, 2025*
*Git Branch: main*
*Status: ✅ Ready for Production*

