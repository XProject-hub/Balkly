"use client";

import { useEffect } from "react";
import { Car, Shield, Clock, CreditCard, MapPin, Star, Check, Truck, Sparkles } from "lucide-react";
import Link from "next/link";

// Car type icons as SVG components
const EconomyCarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 17a2 2 0 100-4 2 2 0 000 4zM17 17a2 2 0 100-4 2 2 0 000 4z" />
    <path d="M5 17H3v-4l2-5h10l2 5v4h-2M9 17h6" />
    <path d="M5 8l1-3h12l1 3" />
  </svg>
);

const SUVIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 18a2 2 0 100-4 2 2 0 000 4zM17 18a2 2 0 100-4 2 2 0 000 4z" />
    <path d="M5 18H3V9l3-4h8l4 4v9h-2M9 18h6" />
    <path d="M6 5v4M18 5v4M6 9h12" />
  </svg>
);

const CompactCarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 17a2 2 0 100-4 2 2 0 000 4zM18 17a2 2 0 100-4 2 2 0 000 4z" />
    <path d="M4 17H2v-5l3-4h10l3 4v5h-2M8 17h8" />
  </svg>
);

const LuxuryCarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 17a2 2 0 100-4 2 2 0 000 4zM18 17a2 2 0 100-4 2 2 0 000 4z" />
    <path d="M4 17H2v-4l2-6h4l2 3h4l2-3h4l2 6v4h-2M8 17h8" />
    <path d="M7 7l1-2h8l1 2" />
  </svg>
);

export default function CarRentalPage() {
  useEffect(() => {
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

    // Set default values for the booking engine
    (window as any).default_values = {
      affiliate_id: "vip_3285",
      page: "step1",
      aff_tid: "balkly_rental",
      step2Url: "https://balkly.live/car-rental/search",
      formType: "form6",
      terms_page: "https://balkly.live/terms",
      show_multilingual: "1",
      language: "en",
      privacy_page: "https://balkly.live/privacy",
      unsubscribe_page: "https://balkly.live/settings",
      width: "100%",
      height: "420px",
      pickup_country: "ae",
      pickup_city: "",
      pickup_loc: "",
      dropoff_country: "ae",
      dropoff_city: "",
      dropoff_loc: "",
      pickupdate: "1",
      dropoffdate: "4",
      pickuptime: "10:00",
      dropofftime: "10:00",
      currency: "AED",
      driver_age: "25",
      div_id: "bookingengine",
    };

    return () => {
      // Cleanup scripts on unmount
      const scripts = document.querySelectorAll('script[src*="supplycars"], script[src*="jquery"]');
      scripts.forEach(s => s.remove());
    };
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Full Insurance Included",
      description: "Comprehensive coverage for peace of mind",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
    },
    {
      icon: CreditCard,
      title: "Best Price Guarantee",
      description: "We match any competitor's price",
    },
    {
      icon: MapPin,
      title: "Multiple Locations",
      description: "Pick up from airports, hotels & more",
    },
  ];

  const carTypes = [
    { name: "Economy", price: "From AED 89/day", icon: EconomyCarIcon, color: "from-blue-500 to-cyan-500" },
    { name: "Compact", price: "From AED 119/day", icon: CompactCarIcon, color: "from-green-500 to-emerald-500" },
    { name: "SUV", price: "From AED 179/day", icon: SUVIcon, color: "from-orange-500 to-amber-500" },
    { name: "Luxury", price: "From AED 349/day", icon: LuxuryCarIcon, color: "from-purple-500 to-pink-500" },
  ];

  const popularLocations = [
    "Dubai International Airport (DXB)",
    "Abu Dhabi Airport (AUH)",
    "Dubai Mall",
    "JBR - Jumeirah Beach",
    "Downtown Dubai",
    "Dubai Marina",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Booking Engine */}
      <section className="relative bg-gradient-to-br from-balkly-blue via-purple-600 to-balkly-blue overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-4">
              <Car className="h-4 w-4" />
              <span>Compare prices from 50+ suppliers</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Rent a Car in UAE
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Best prices guaranteed. Free cancellation on most bookings.
            </p>
          </div>

          {/* Booking Engine Container */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-border">
              <div id="bookingengine" style={{ position: "relative", minHeight: "380px" }}>
                <div className="flex items-center justify-center h-[380px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading booking engine...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Types Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Perfect Ride</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From budget-friendly economy cars to luxury vehicles, find the perfect car for your trip
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {carTypes.map((car, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border text-center hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${car.color} p-3 group-hover:scale-110 transition-transform`}>
                  <car.icon className="w-full h-full text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{car.name}</h3>
                <p className="text-primary font-medium">{car.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Pick-up Locations</h2>
            <p className="text-muted-foreground">
              Convenient locations across Dubai and Abu Dhabi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {popularLocations.map((location, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition-all"
              >
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">{location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Book With Balkly?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  "Compare 50+ rental companies instantly",
                  "No hidden fees - price you see is what you pay",
                  "Free cancellation on most bookings",
                  "24/7 customer support in multiple languages",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  "Best price guarantee - we match competitors",
                  "Trusted by thousands of Balkan expats",
                  "Easy booking process in under 2 minutes",
                  "Wide selection of vehicles for every budget",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manage Booking CTA */}
      <section className="py-12 bg-gradient-to-r from-balkly-blue to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Already have a booking?
          </h2>
          <p className="text-white/80 mb-6">
            View, modify, or cancel your reservation easily
          </p>
          <Link
            href="/car-rental/manage-booking"
            className="inline-flex items-center gap-2 bg-white text-balkly-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Car className="h-5 w-5" />
            Manage My Booking
          </Link>
        </div>
      </section>
    </div>
  );
}
