"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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

  return (
    <div className={`ad-banners-${position} ${className}`}>
      {banners.map((banner) => (
        <div key={banner.id} className="ad-banner mb-4">
          {banner.type === "image" && banner.image_url && (
            <div
              onClick={() => handleClick(banner)}
              className={`cursor-pointer rounded-lg overflow-hidden ${banner.link_url ? 'hover:opacity-90 transition-opacity' : ''}`}
            >
              <img
                src={banner.image_url}
                alt={banner.name}
                className="w-full h-auto"
              />
            </div>
          )}
          
          {banner.type === "html" && banner.html_content && (
            <div
              dangerouslySetInnerHTML={{ __html: banner.html_content }}
              onClick={() => handleClick(banner)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

