"use client";

import { useState } from "react";
import { Car, Shield, Clock, CreditCard, MapPin, Check, Calendar, Users, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CarRentalPage() {
  const [pickupLocation, setPickupLocation] = useState("Dubai Airport (DXB)");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [sameLocation, setSameLocation] = useState(true);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [driverAge, setDriverAge] = useState("25");

  // Set default dates (tomorrow and 4 days from now)
  useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 5);
    
    setPickupDate(tomorrow.toISOString().split('T')[0]);
    setDropoffDate(returnDate.toISOString().split('T')[0]);
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build VIP Cars search URL with affiliate parameters
    const baseUrl = "https://www.vipcars.com/search";
    const params = new URLSearchParams({
      affiliate_id: "vip_3285",
      aff_tid: "balkly_rental",
      pickup_country: "ae",
      pickup_city: pickupLocation.includes("Dubai") ? "dubai" : "abu-dhabi",
      dropoff_country: "ae",
      dropoff_city: sameLocation ? (pickupLocation.includes("Dubai") ? "dubai" : "abu-dhabi") : (dropoffLocation.includes("Dubai") ? "dubai" : "abu-dhabi"),
      pickupdate: pickupDate,
      dropoffdate: dropoffDate,
      pickuptime: pickupTime,
      dropofftime: dropoffTime,
      driver_age: driverAge,
      currency: "EUR",
    });

    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  const features = [
    {
      icon: CreditCard,
      title: "All Inclusive Pricing",
      description: "CDW, Theft Waiver, airport surcharge & taxes included",
    },
    {
      icon: Shield,
      title: "No Hidden Charges",
      description: "Once you paid, you paid. No last minute surprises",
    },
    {
      icon: Clock,
      title: "24/7 Customer Support",
      description: "Excellent support on phone, chat & email",
    },
    {
      icon: Check,
      title: "Free Cancellation",
      description: "Cancel for free, 48 hours before pick up",
    },
  ];

  const carTypes = [
    { 
      name: "Economy", 
      price: "From €15/day", 
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
      example: "Toyota Yaris or similar"
    },
    { 
      name: "Compact", 
      price: "From €22/day", 
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=250&fit=crop",
      example: "VW Golf or similar"
    },
    { 
      name: "SUV", 
      price: "From €35/day", 
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop",
      example: "Nissan X-Trail or similar"
    },
    { 
      name: "Luxury", 
      price: "From €75/day", 
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
      example: "BMW 5 Series or similar"
    },
  ];

  const popularLocations = [
    "Dubai International Airport (DXB)",
    "Abu Dhabi Airport (AUH)",
    "Dubai Mall",
    "JBR - Jumeirah Beach",
    "Downtown Dubai",
    "Dubai Marina",
  ];

  const locations = [
    "Dubai Airport (DXB)",
    "Dubai - Downtown",
    "Dubai Mall",
    "Dubai Marina",
    "JBR Beach",
    "Abu Dhabi Airport (AUH)",
    "Abu Dhabi - City",
    "Sharjah Airport",
  ];

  const times = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
    "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Booking Form */}
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
              <span>Compare prices from 600+ suppliers</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Rent a Car in UAE
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Best prices guaranteed. Free cancellation on most bookings.
            </p>
          </div>

          {/* Booking Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-border">
              {/* Pick-up Location */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pick-up Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <select 
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground"
                    >
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={!sameLocation}
                        onChange={(e) => setSameLocation(!e.target.checked)}
                        className="rounded"
                      />
                      Different drop-off location
                    </label>
                  </label>
                  {!sameLocation && (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <select 
                        value={dropoffLocation || pickupLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground"
                      >
                        {locations.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates and Times */}
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pick-up Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Pick-up Time</label>
                  <select 
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg bg-background text-foreground"
                  >
                    {times.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Drop-off Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Drop-off Time</label>
                  <select 
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg bg-background text-foreground"
                  >
                    {times.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Driver Age and Search */}
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Driver's Age</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <select 
                      value={driverAge}
                      onChange={(e) => setDriverAge(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground"
                    >
                      {Array.from({length: 82}, (_, i) => i + 18).map(age => (
                        <option key={age} value={age}>{age} years</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full md:w-auto px-12 py-6 text-lg font-bold"
                  style={{background: 'linear-gradient(135deg, #1E63FF 0%, #7C3AED 100%)'}}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Cars
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                You'll be redirected to our partner VIP Cars to view available vehicles and complete your booking
              </p>
            </form>
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
                className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group"
              >
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg mb-1">{car.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{car.example}</p>
                  <p className="text-primary font-bold text-lg">{car.price}</p>
                </div>
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

      {/* Trusted Partners */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-border">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Rent from 600+ Trusted Car Rental Companies Worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-70">
            {["Hertz", "Avis", "Sixt", "Budget", "Europcar", "Enterprise", "Dollar", "Thrifty"].map((brand) => (
              <div key={brand} className="text-lg md:text-xl font-bold text-muted-foreground">
                {brand}
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
              <p className="text-muted-foreground">Best prices guaranteed from leading suppliers worldwide</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  "All Inclusive Pricing - CDW, Theft Waiver & taxes included",
                  "No hidden charges - price you see is what you pay",
                  "Free cancellation up to 48 hours before pickup",
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
                  "Lowest price guarantee - best rates on the web",
                  "Leading suppliers: Hertz, Avis, Sixt, Enterprise & more",
                  "Easy booking in under 2 minutes",
                  "Compare 600+ car rental companies instantly",
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
