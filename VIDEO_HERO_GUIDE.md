# Adding Video Background to Balkly Hero Section

Your Balkly platform has a beautiful animated gradient hero that's ready for a video background! Here's how to add it:

---

## 🎥 Quick Setup (2 Minutes)

### Step 1: Get Your Video

**Recommended Sources:**
- **Pexels Videos**: https://www.pexels.com/videos/ (Free, high-quality)
- **Pixabay**: https://pixabay.com/videos/ (Free)
- **Unsplash**: https://unsplash.com/backgrounds/stock (Free)

**Recommended Video Type:**
- **Topic**: City skyline, marketplace, people shopping, modern office
- **Length**: 15-30 seconds (will loop)
- **Resolution**: 1920x1080 (Full HD)
- **Format**: MP4 (H.264)
- **Size**: Under 5MB (compress if needed)

### Step 2: Add Video File

```bash
# Place your video in the public folder
mv your-video.mp4 balkly-web/public/videos/hero-bg.mp4
```

### Step 3: Update Homepage Component

Open `balkly-web/src/app/page.tsx` and replace this section:

**FIND** (around line 52):
```tsx
<div className="absolute inset-0 z-0">
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 animate-gradient" />
  {/* Fallback gradient - add video element here when you have video file */}
</div>
```

**REPLACE WITH**:
```tsx
<div className="absolute inset-0 z-0">
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
  
  {/* Video Background */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover"
  >
    <source src="/videos/hero-bg.mp4" type="video/mp4" />
    {/* Fallback gradient */}
    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 animate-gradient" />
  </video>
</div>
```

That's it! Your hero section now has a professional video background! 🎉

---

## 🎨 Alternative: Multiple Videos

Want to rotate different videos? Here's the code:

```tsx
"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [currentVideo, setCurrentVideo] = useState(0);
  
  const videos = [
    "/videos/hero-1.mp4",
    "/videos/hero-2.mp4",
    "/videos/hero-3.mp4",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 30000); // Change every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
          
          <video
            key={currentVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videos[currentVideo]} type="video/mp4" />
          </video>
        </div>
        
        {/* Rest of hero content... */}
      </section>
    </div>
  );
}
```

---

## 🎬 Recommended Videos by Theme

### Marketplace Theme:
- **Shopping**: People browsing, shopping bags, storefronts
- **City**: Aerial city views, urban life, modern buildings
- **Technology**: Clean tech backgrounds, digital themes
- **Nature**: Subtle nature, calm backgrounds

### Search Keywords:
- "marketplace aerial"
- "shopping modern"
- "city skyline timelapse"
- "business professional"
- "people browsing shopping"

---

## 📐 Video Optimization

### Compress Your Video:

**Using FFmpeg** (recommended):
```bash
# Install FFmpeg
# Windows: Download from ffmpeg.org
# Mac: brew install ffmpeg
# Linux: sudo apt install ffmpeg

# Compress video to under 5MB
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 1000k -b:a 128k output.mp4
```

**Online Tools:**
- https://www.freeconvert.com/video-compressor
- https://www.videosmaller.com/
- https://cloudconvert.com/mp4-compressor

---

## 🎯 Perfect Video Specs

```
Format: MP4
Codec: H.264
Resolution: 1920x1080 (or 1280x720)
Frame Rate: 24-30 fps
Bitrate: 1-2 Mbps
Audio: Optional (will be muted anyway)
Length: 15-30 seconds
Size: 3-5 MB
```

---

## 🚀 Performance Tips

### 1. Lazy Load Video (For Better Performance):

```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  preload="metadata"  // Only load metadata first
  className="w-full h-full object-cover"
>
  <source src="/videos/hero-bg.mp4" type="video/mp4" />
</video>
```

### 2. Mobile-Friendly (Use Image on Mobile):

```tsx
<div className="absolute inset-0 z-0">
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
  
  {/* Video for desktop */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="hidden md:block w-full h-full object-cover"
  >
    <source src="/videos/hero-bg.mp4" type="video/mp4" />
  </video>
  
  {/* Image for mobile (better performance) */}
  <img
    src="/images/hero-bg.jpg"
    alt="Hero background"
    className="md:hidden w-full h-full object-cover"
  />
</div>
```

### 3. Add Loading State:

```tsx
const [videoLoaded, setVideoLoaded] = useState(false);

<video
  autoPlay
  loop
  muted
  playsInline
  onLoadedData={() => setVideoLoaded(true)}
  className={`w-full h-full object-cover transition-opacity duration-1000 ${
    videoLoaded ? 'opacity-100' : 'opacity-0'
  }`}
>
  <source src="/videos/hero-bg.mp4" type="video/mp4" />
</video>

{/* Gradient shows while video loads */}
{!videoLoaded && (
  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 animate-gradient" />
)}
```

---

## 💡 Pro Tips

1. **Use Multiple Formats** for browser compatibility:
   ```tsx
   <video autoPlay loop muted playsInline>
     <source src="/videos/hero.webm" type="video/webm" />
     <source src="/videos/hero.mp4" type="video/mp4" />
   </video>
   ```

2. **Add Poster Image** (shows before video loads):
   ```tsx
   <video
     poster="/images/hero-poster.jpg"
     autoPlay
     loop
     muted
     playsInline
   >
     <source src="/videos/hero-bg.mp4" type="video/mp4" />
   </video>
   ```

3. **Parallax Effect** (optional):
   ```tsx
   <div
     className="absolute inset-0 z-0"
     style={{
       transform: `translateY(${scrollY * 0.5}px)`,
     }}
   >
     <video...>
   ```

---

## 🎨 Alternative: Animated SVG Background

If you prefer not to use video, here's a beautiful animated SVG alternative:

```tsx
<div className="absolute inset-0 z-0">
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
  
  <div className="w-full h-full bg-gradient-to-br from-primary via-purple-600 to-blue-600 animate-gradient" />
  
  {/* Animated shapes */}
  <div className="absolute top-0 left-0 w-full h-full opacity-20">
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />
  </div>
</div>
```

---

## ✅ Current Status

Your hero section currently has:
- ✅ Beautiful animated gradient
- ✅ Glassmorphism search bar
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Professional typography
- ✅ CTA buttons with hover effects
- ✅ Scroll indicator
- ⏳ Video background (ready to add!)

---

**Just add your video and you're done!** 🎬✨

For questions, check the video examples at: https://www.pexels.com/search/videos/marketplace/

