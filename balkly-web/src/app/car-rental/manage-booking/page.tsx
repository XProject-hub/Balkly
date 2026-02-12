"use client";

import { useState } from "react";
import { Car, ArrowLeft, Calendar, FileText, HelpCircle, Search, Mail, Hash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ManageBookingPage() {
  const [bookingRef, setBookingRef] = useState("");
  const [email, setEmail] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to VIP Cars manage booking page
    window.open(`https://www.vipcars.com/manage-booking?affiliate_id=vip_3285`, '_blank');
  };

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
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Enter Your Booking Details</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Use your confirmation number and email to access your booking
                </p>
              </div>
              <form onSubmit={handleSearch} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Booking Reference Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={bookingRef}
                      onChange={(e) => setBookingRef(e.target.value)}
                      placeholder="e.g., VIP123456"
                      className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full py-6 text-lg font-bold"
                  style={{background: 'linear-gradient(135deg, #1E63FF 0%, #7C3AED 100%)'}}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find My Booking
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You'll be redirected to our partner's secure booking management portal
                </p>
              </form>
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
