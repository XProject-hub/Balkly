"use client";

import { useEffect } from "react";
import { Car, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CarRentalSearchPage() {
  useEffect(() => {
    // Set default values for the search results page
    (window as any).default_values = {
      affiliate_id: "vip_3285",
      width: "100%",
      page: "step2",
      step2Url: "https://balkly.live/car-rental/search",
      manage_booking_page: "https://balkly.live/car-rental/manage-booking",
      terms_page: "https://balkly.live/terms",
      privacy_page: "https://balkly.live/privacy",
      unsubscribe_page: "https://balkly.live/settings",
      gmap_api_key: "",
      div_id: "bookingengine",
    };

    // Load jQuery first (required by VIP Cars)
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jquery.async = true;
    document.head.appendChild(jquery);

    jquery.onload = () => {
      // Load VIP Cars booking engine script after jQuery
      const script = document.createElement("script");
      script.src = "https://res.supplycars.com/jsbookingengine/script1.js?v=0.04";
      script.async = true;
      document.body.appendChild(script);
    };

    return () => {
      const scripts = document.querySelectorAll('script[src*="supplycars"], script[src*="jquery"]');
      scripts.forEach(s => s.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-balkly-blue to-purple-600 text-white py-6">
        <div className="container mx-auto px-4">
          <Link
            href="/car-rental"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Search Results</h1>
              <p className="text-white/80 text-sm">Compare prices from 50+ suppliers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div id="bookingengine" style={{ minHeight: "600px" }}>
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading available cars...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6 border border-border">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Our customer support team is available 24/7 to assist you with your booking.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="text-primary hover:underline text-sm font-medium"
            >
              Contact Support
            </Link>
            <Link
              href="/car-rental/manage-booking"
              className="text-primary hover:underline text-sm font-medium"
            >
              Manage Existing Booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
