"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TrackingScript() {
  const pathname = usePathname();
  const pageLoadTime = useRef<number>(Date.now());

  useEffect(() => {
    // Reset page load time on pathname change
    pageLoadTime.current = Date.now();

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
      if (path.includes('/admin')) return 'Admin Panel';
      return document.title;
    };

    // Track page visit with time tracking
    const trackVisit = async () => {
      const timeOnPage = Math.floor((Date.now() - pageLoadTime.current) / 1000); // seconds

      try {
        // Only track analytics once per page (not repeatedly)
        if (timeOnPage < 5) {
          await fetch("/api/v1/analytics/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
            },
            body: JSON.stringify({
              page_url: window.location.pathname,
              page_title: getPageTitle(),
              time_on_page: timeOnPage,
            }),
          });
        }

        // Update online status (every 30 seconds for real-time)
        await fetch("/api/v1/online/track", {
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
      } catch (error) {
        // Silent fail
      }
    };

    trackVisit();

    // Track online status every 30 seconds (real-time presence)
    const interval = setInterval(trackVisit, 30000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}

