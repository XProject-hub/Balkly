"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Banner position configurations - controls size and layout
const POSITION_STYLES: Record<string, { container: string; image: string; wrapper: string }> = {
  // Horizontal banners (full width, limited height)
  homepage_top: {
    container: "max-w-4xl mx-auto",
    wrapper: "rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700",
    image: "w-full h-auto max-h-32 object-cover"
  },
  homepage_middle: {
    container: "max-w-5xl mx-auto",
    wrapper: "rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700",
    image: "w-full h-auto max-h-40 object-cover"
  },
  listings_top: {
    container: "max-w-4xl mx-auto",
    wrapper: "rounded-lg overflow-hidden shadow-md",
    image: "w-full h-auto max-h-28 object-cover"
  },
  events_top: {
    container: "max-w-4xl mx-auto",
    wrapper: "rounded-lg overflow-hidden shadow-md",
    image: "w-full h-auto max-h-28 object-cover"
  },
  forum_top: {
    container: "max-w-4xl mx-auto",
    wrapper: "rounded-lg overflow-hidden shadow-md",
    image: "w-full h-auto max-h-28 object-cover"
  },
  
  // Sidebar banners (fixed width, flexible height)
  homepage_sidebar: {
    container: "w-full max-w-[280px]",
    wrapper: "rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700",
    image: "w-full h-auto max-h-[400px] object-contain"
  },
  listings_sidebar: {
    container: "w-full",
    wrapper: "rounded-lg overflow-hidden shadow-md",
    image: "w-full h-auto max-h-[350px] object-contain"
  },
  
  // Small inline banners
  listing_detail: {
    container: "max-w-sm mx-auto",
    wrapper: "rounded-lg overflow-hidden shadow-sm",
    image: "w-full h-auto max-h-48 object-cover"
  },
  
  // Default fallback
  default: {
    container: "max-w-3xl mx-auto",
    wrapper: "rounded-lg overflow-hidden shadow-md",
    image: "w-full h-auto max-h-32 object-cover"
  }
};

interface AdBannerProps {
  position: string;
  className?: string;
}

export default function AdBanner({ position, className = "" }: AdBannerProps) {
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    loadBanners();
  }, [position]);

  const loadBanners = async () => {
    try {
      const response = await fetch(`${API_URL}/banners/${position}`);
      const data = await response.json();
      setBanners(data.banners || []);
      
      // Track impressions
      data.banners?.forEach((banner: any) => {
        fetch(`${API_URL}/banners/${banner.id}/impression`, { method: "POST" });
      });
    } catch (error) {
      console.error("Failed to load banners:", error);
    }
  };

  const handleClick = async (banner: any) => {
    await fetch(`${API_URL}/banners/${banner.id}/click`, { method: "POST" });
    if (banner.link_url) {
      window.open(banner.link_url, banner.open_new_tab ? "_blank" : "_self");
    }
  };

  if (banners.length === 0) return null;

  const styles = POSITION_STYLES[position] || POSITION_STYLES.default;

  return (
    <div className={`ad-banners ${styles.container} ${className}`}>
      {banners.map((banner) => (
        <div key={banner.id} className="ad-banner mb-3">
          {banner.type === "image" && banner.image_url && (
            <div
              onClick={() => handleClick(banner)}
              className={`${styles.wrapper} ${banner.link_url ? 'cursor-pointer hover:opacity-90 hover:scale-[1.01] transition-all duration-200' : ''}`}
            >
              <img
                src={banner.image_url}
                alt={banner.name || "Advertisement"}
                className={styles.image}
              />
            </div>
          )}
          
          {banner.type === "html" && banner.html_content && (
            <div
              className={styles.wrapper}
              dangerouslySetInnerHTML={{ __html: banner.html_content }}
              onClick={() => handleClick(banner)}
            />
          )}
          
          {/* Small "Ad" label */}
          <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-1 uppercase tracking-wider">
            Sponsored
          </div>
        </div>
      ))}
    </div>
  );
}

