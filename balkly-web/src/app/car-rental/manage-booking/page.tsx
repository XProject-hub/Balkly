"use client";

import { useEffect } from "react";
import { Car, ArrowLeft, Calendar, FileText, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ManageBookingPage() {
  useEffect(() => {
    // Load VIP Cars booking engine script
    const script = document.createElement("script");
    script.src = "https://res.supplycars.com/jsbookingengine/script1.js?v=0.04";
    script.async = true;
    document.body.appendChild(script);

    // Set default values for manage booking page
    (window as any).default_values = {
      affiliate_id: "vip_3285",
      page: "managebooking",
      language: "en",
      show_multilingual: "1",
      step2Url: "https://balkly.live/car-rental/search",
      manage_booking_page: "https://balkly.live/car-rental/manage-booking",
      terms_page: "https://balkly.live/terms",
      privacy_page: "https://balkly.live/privacy",
      unsubscribe_page: "https://balkly.live/settings",
      div_id: "bookingengine",
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const helpItems = [
    {
      icon: Calendar,
      title: "Modify Your Dates",
      description: "Need to change your pick-up or drop-off dates? You can easily modify your booking.",
    },
    {
      icon: FileText,
      title: "View Booking Details",
      description: "Check your reservation details, including vehicle info and pricing breakdown.",
    },
    {
      icon: HelpCircle,
      title: "Cancel Booking",
      description: "Free cancellation available on most bookings. Check your booking for details.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-balkly-blue to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/car-rental"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Car Rental
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Car className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Manage Your Booking</h1>
              <p className="text-white/80">View, modify, or cancel your car rental reservation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Engine */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Enter Your Booking Details</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Use your confirmation number and email to access your booking
                </p>
              </div>
              <div className="p-6">
                <div id="bookingengine" style={{ minHeight: "400px" }}>
                  <div className="flex items-center justify-center h-[400px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading booking manager...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">What You Can Do</h3>
              <div className="space-y-4">
                {helpItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-muted-foreground text-xs mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-2">Can't Find Your Booking?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Check your email for the confirmation number. If you still have issues, our support team can help.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </Link>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-3">Looking for a New Rental?</h3>
              <Link
                href="/car-rental"
                className="inline-flex items-center gap-2 w-full justify-center bg-balkly-blue text-white px-4 py-3 rounded-lg font-medium hover:bg-balkly-blue/90 transition-colors"
              >
                <Car className="h-5 w-5" />
                Search Cars
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
