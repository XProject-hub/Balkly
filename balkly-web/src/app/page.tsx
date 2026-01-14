"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Home, Calendar, MessageCircle, Search, TrendingUp, Star, MapPin, Eye, Package } from "lucide-react";
import { listingsAPI, eventsAPI, forumAPI } from "@/lib/api";
import AdBanner from "@/components/AdBanner";
import PriceDisplay from "@/components/PriceDisplay";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    try {
      // Load ONLY promoted/featured listings (paid plans)
      const listingsRes = await listingsAPI.getAll({ 
        per_page: 6, 
        is_promoted: 1,  // Only promoted listings (Standard, Featured, Boost)
        sort_by: 'created_at', 
        sort_order: 'desc' 
      });
      setFeaturedListings(listingsRes.data.data || []);

      // Load upcoming events
      const eventsRes = await eventsAPI.getAll({ per_page: 4 });
      setUpcomingEvents(eventsRes.data.data || []);

      // Load trending forum topics
      const forumRes = await forumAPI.getTopics({ per_page: 5 });
      setTrendingTopics(forumRes.data.data || []);
    } catch (error) {
      console.error("Failed to load content:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Video Background */}
      <section className="relative h-[700px] overflow-hidden bg-gradient-hero dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
        {/* Glow Overlay */}
        <div className="absolute inset-0 z-0 opacity-100 dark:opacity-50" style={{background: 'radial-gradient(1200px 500px at 20% -10%, rgba(30,99,255,0.25), transparent 60%)'}} />
        
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
          {/* Fallback gradient - add video element here when you have video file */}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-5xl mx-auto text-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
              <span className="text-xs font-bold">UAE</span>
              <span className="text-white/60">•</span>
              <span className="text-xs font-bold">Balkly Community</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-3 animate-fade-in">
              Welcome to <span className="bg-gradient-to-r from-balkly-blue to-teal-glow bg-clip-text text-transparent">Balkly</span>
            </h1>
            
            {/* Balkans Community Heading */}
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-teal-glow">
              United Balkans in the Emirates
            </h2>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl mb-6 text-white/90 font-medium">
              One community. One platform. No borders.
            </p>
            
            {/* Description */}
            <p className="text-base mb-8 text-white/80 max-w-2xl mx-auto">
              Buy, sell, and connect with the Balkans community across the UAE.
              Your local community in Dubai, Abu Dhabi, and beyond.
            </p>
            <div className="flex gap-4 justify-center flex-wrap mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 hover:scale-105 transition-transform text-white font-bold" 
                style={{background: 'linear-gradient(90deg, #1E63FF, #7C3AED)', boxShadow: '0 8px 24px rgba(30,99,255,.4)'}}
                asChild
              >
                <Link href="/listings">Browse Listings</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform border-white font-bold" 
                asChild
              >
                <Link href="/auth/register">Get Started Free</Link>
              </Button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="hero-search"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for cars, homes, events, or anything..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    style={{ color: '#1a202c' }}
                    autoComplete="off"
                  />
                </div>
                <Button size="lg" type="submit" className="px-8">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Ad Banner - Homepage Top */}
      <AdBanner position="homepage_top" className="container mx-auto px-4 py-4" />

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link href="/auto">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-4">
                  <div className="mx-auto mb-2 w-16 h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Car className="h-8 w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-base">Auto</CardTitle>
                  <CardDescription className="text-xs">
                    Cars & vehicles
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/real-estate">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-4">
                  <div className="mx-auto mb-2 w-16 h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Home className="h-8 w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-base">Real Estate</CardTitle>
                  <CardDescription className="text-xs">
                    Houses & apartments
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/electronics">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-4">
                  <div className="mx-auto mb-2 w-16 h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Package className="h-8 w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-base">Electronics</CardTitle>
                  <CardDescription className="text-xs">
                    Phones & gadgets
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/fashion">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-4">
                  <div className="mx-auto mb-2 w-16 h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Package className="h-8 w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-base">Fashion</CardTitle>
                  <CardDescription className="text-xs">
                    Clothing & shoes
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/jobs">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-4">
                  <div className="mx-auto mb-2 w-16 h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Package className="h-8 w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-base">Jobs</CardTitle>
                  <CardDescription className="text-xs">
                    Work opportunities
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/forum">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-4">
                  <div className="mx-auto mb-2 w-16 h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <MessageCircle className="h-8 w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-base">Forum</CardTitle>
                  <CardDescription className="text-xs">
                    Community discussions
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">Handpicked items from trusted sellers</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/listings">View All</Link>
            </Button>
          </div>
          
          {featuredListings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-3 opacity-20" />
              <p>No featured listings yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.slice(0, 6).map((listing) => (
                <Link key={listing.id} href={`/listings/${listing.id}`}>
                <Card className="hover:shadow-2xl transition-all group overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                    {listing.media?.[0] ? (
                      <img
                        src={listing.media[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                    {/* Badge based on plan type */}
                    {listing.is_featured && !listing.is_boosted && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star className="h-3 w-3 fill-current" />
                        FEATURED
                      </div>
                    )}
                    {listing.is_promoted && !listing.is_featured && !listing.is_boosted && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star className="h-3 w-3 fill-current" />
                        STANDARD
                      </div>
                    )}
                    {listing.is_boosted && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                        <TrendingUp className="h-3 w-3" />
                        BOOSTED
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                      {listing.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {listing.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      {listing.price ? (
                        <PriceDisplay
                          amount={listing.price}
                          currency={listing.currency || 'EUR'}
                          className="text-2xl font-bold text-primary"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary">Contact</span>
                      )}
                      <span className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.city}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground">Don't miss out on exciting events</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-16 w-16 mx-auto mb-3 opacity-20" />
              <p>No events scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.slice(0, 4).map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:shadow-2xl transition-all group overflow-hidden h-full">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="h-16 w-16 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-xs space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {(() => {
                          const now = new Date();
                          const start = new Date(event.start_at);
                          const end = event.end_at ? new Date(event.end_at) : null;
                          
                          // If event hasn't started yet
                          if (start > now) {
                            return `Starts: ${start.toLocaleDateString()}`;
                          }
                          // If event is ongoing
                          if (end && end >= now) {
                            return `Valid until: ${end.toLocaleDateString()}`;
                          }
                          // Fallback
                          return start.toLocaleDateString();
                        })()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.city}
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Forum Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">Trending Discussions</h2>
              <p className="text-muted-foreground">Join the conversation</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/forum">Visit Forum</Link>
            </Button>
          </div>
          
          {trendingTopics.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-16 w-16 mx-auto mb-3 opacity-20" />
              <p>No discussions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trendingTopics.slice(0, 5).map((topic) => (
              <Link key={topic.id} href={`/forum/topics/${topic.id}`}>
                <Card className="hover:shadow-lg transition-all hover:border-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {topic.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {topic.user?.name}</span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {topic.views_count || 0}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {topic.replies_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Balkly?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Features</h3>
              <p className="text-muted-foreground">
                Automatic listing enhancement, multi-language support, and content verification
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
              <p className="text-muted-foreground">
                Connect instantly with buyers and sellers through our messaging system
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Ticketing</h3>
              <p className="text-muted-foreground">
                Buy tickets with QR codes for seamless event check-in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center text-white border-0" style={{background: 'linear-gradient(90deg, #1E63FF, #7C3AED)'}}>
            <CardHeader>
              <CardTitle className="text-3xl text-white">Ready to Get Started?</CardTitle>
              <CardDescription className="text-white/90 text-lg">
                Join thousands of users buying, selling, and connecting on Balkly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                {!isLoggedIn ? (
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold" asChild>
                    <Link href="/auth/register">Create Account</Link>
                  </Button>
                ) : (
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/50 hover:bg-white/20 font-bold" asChild>
                  <Link href="/listings/create">Post a Listing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

