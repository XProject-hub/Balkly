"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TrackingScript() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        await fetch("/api/v1/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
          },
          body: JSON.stringify({
            page_url: window.location.href,
            page_title: document.title,
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

