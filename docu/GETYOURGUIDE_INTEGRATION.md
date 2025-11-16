# 🎫 GetYourGuide Integration Guide

## 📋 Overview

Balkly now integrates with **GetYourGuide** to display tours and experiences in UAE, providing an additional revenue stream alongside Platinumlist.

**Partner ID**: `MG30TZM`  
**Campaign**: `UAE_Post`

---

## ✅ What's Integrated

### 1. **Analytics Script** (Global)
- **Location**: `balkly-web/src/app/layout.tsx`
- **Script**: `https://widget.getyourguide.com/dist/pa.umd.production.min.js`
- **Purpose**: Tracks widget interactions and analytics

### 2. **Widget Display** (Events Page)
- **Location**: `balkly-web/src/app/events/page.tsx`
- **Position**: Bottom of events page
- **Type**: Auto widget (shows relevant tours)
- **Styling**: Gradient card with dark theme support

---

## 💰 Revenue Sources

Your Balkly platform now has **2 affiliate revenue streams**:

### 1. **Platinumlist** (Events/Attractions)
- 15 attractions (Burj Khalifa, Skydive, etc.)
- Ref: `zjblytn`
- Auto-updates: Every 2 hours
- Link format: `https://platinumlist.net/aff/?ref=zjblytn&link=...`

### 2. **GetYourGuide** (Tours/Experiences)
- Auto widget shows relevant tours
- Partner ID: `MG30TZM`
- Campaign: `UAE_Post`
- Analytics tracking enabled

---

## 📊 Where Widget Appears

### Events Page (`/events`)
- **Position**: Below the event listings
- **Display**: Beautiful card with gradient background
- **Content**: Tours and experiences in UAE
- **Responsive**: Works on mobile and desktop

---

## 🎨 Widget Styling

```tsx
<Card className="bg-gradient-to-br from-primary/5 to-accent/5">
  <CardHeader>
    <CardTitle>Explore Tours & Experiences in UAE</CardTitle>
  </CardHeader>
  <CardContent>
    <div data-gyg-widget="auto" data-gyg-partner-id="MG30TZM" data-gyg-cmp="UAE_Post" />
  </CardContent>
</Card>
```

Features:
- ✅ Gradient background (primary to accent)
- ✅ Dark theme support
- ✅ Minimum height 400px
- ✅ Branded footer text

---

## 🔧 Configuration

### Partner ID
```
MG30TZM
```

### Campaign Code
```
UAE_Post
```

### Widget Type
```
auto (automatically shows relevant content)
```

---

## 📈 Analytics & Tracking

### GetYourGuide Dashboard
- Login to your GetYourGuide partner account
- View analytics and commission
- Track bookings and revenue

### What's Tracked
- Widget impressions
- Click-through rate
- Bookings
- Commission earned

---

## 🚀 How It Works

```
User visits /events
    ↓
Sees Platinumlist attractions (top)
    ↓
Scrolls down
    ↓
Sees GetYourGuide widget
    ↓
Browses tours/experiences
    ↓
Clicks and books
    ↓
You earn commission! 💰
```

---

## 💡 Additional Placement Ideas (Future)

Consider adding GetYourGuide widget to:

1. **Homepage** - "Things to Do" section
2. **Specific event pages** - Related activities
3. **Blog posts** - About UAE tourism
4. **Dashboard** - Personalized recommendations

---

## 🎯 Revenue Optimization

### Platinumlist
- **Best for**: Attractions, theme parks, experiences
- **Price range**: AED 50 - 2,199
- **Commission**: Per ticket sale

### GetYourGuide  
- **Best for**: Tours, activities, day trips
- **Price range**: Varies by tour
- **Commission**: Per booking

**Combined Strategy**: Offer both! Users can choose what fits their needs.

---

## 🧪 Testing

### Verify Integration:
```
1. Visit https://balkly.live/events
2. Scroll to bottom
3. Should see GetYourGuide widget loading
4. Shows tours in UAE
5. Click any tour
6. Should track via partner ID MG30TZM
```

### Check Analytics:
```
1. Login to GetYourGuide partner dashboard
2. Check impressions
3. Monitor click-through rate
4. Track bookings
```

---

## 📋 Summary

Your platform now offers:
- **Platinumlist**: 15 attractions with affiliate links
- **GetYourGuide**: Dynamic tours widget
- **Combined reach**: More revenue opportunities
- **User choice**: Best experiences from both platforms

---

## 🎉 Revenue Status

✅ **Platinumlist**: Active (`?ref=zjblytn`)  
✅ **GetYourGuide**: Active (`MG30TZM`)  
✅ **Double revenue**: Two affiliate programs  
✅ **Auto-updates**: Platinumlist every 2 hours  
✅ **Analytics**: Both platforms tracked  

---

**Your platform is now a comprehensive events marketplace!** 🎪

*Integration Date: November 16, 2025*  
*Platinumlist Ref: zjblytn*  
*GetYourGuide ID: MG30TZM*

