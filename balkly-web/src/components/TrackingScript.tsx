"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TrackingScript() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        // Get better page title based on URL
        const getPageTitle = () => {
          const path = window.location.pathname;
          if (path === '/') return 'Homepage';
          if (path.includes('/listings/')) return 'Listing Detail';
          if (path === '/listings') return 'Browse Listings';
          if (path === '/auto') return 'Auto Category';
          if (path === '/real-estate') return 'Real Estate Category';
          if (path === '/electronics') return 'Electronics Category';
          if (path === '/fashion') return 'Fashion Category';
          if (path === '/jobs') return 'Jobs Category';
          if (path === '/events') return 'Events';
          if (path === '/forum') return 'Forum';
          if (path.includes('/forum/topics/')) return 'Forum Topic';
          if (path === '/auth/login') return 'Login';
          if (path === '/auth/register') return 'Register';
          if (path.includes('/dashboard')) return 'Dashboard';
          return document.title;
        };

        await fetch("/api/v1/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
          },
          body: JSON.stringify({
            page_url: window.location.pathname,
            page_title: getPageTitle(),
          }),
        });

        // Track online status
        await fetch("/api/v1/online/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_url: window.location.pathname,
          }),
        });
      } catch (error) {
        // Silent fail
      }
    };

    trackVisit();

    // Track every 2 minutes while on page
    const interval = setInterval(trackVisit, 120000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}

