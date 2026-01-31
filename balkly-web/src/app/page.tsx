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
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:h-[700px] overflow-hidden bg-gradient-hero dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
        {/* Glow Overlay */}
        <div className="absolute inset-0 z-0 opacity-100 dark:opacity-50" style={{background: 'radial-gradient(1200px 500px at 20% -10%, rgba(30,99,255,0.25), transparent 60%)'}} />
        
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center py-12 sm:py-16 lg:py-0">
          <div className="max-w-5xl mx-auto text-center text-white w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-bold">UAE</span>
              <span className="text-white/60">•</span>
              <span className="text-[10px] sm:text-xs font-bold">Balkly Community</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 animate-fade-in">
              Welcome to <span className="bg-gradient-to-r from-balkly-blue to-teal-glow bg-clip-text text-transparent">Balkly</span>
            </h1>
            
            {/* Balkans Community Heading */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-teal-glow">
              United Balkans in the Emirates
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-white/90 font-medium">
              One community. One platform. No borders.
            </p>
            
            {/* Description */}
            <p className="text-sm sm:text-base mb-6 sm:mb-8 text-white/80 max-w-2xl mx-auto px-2">
              Buy, sell, and connect with the Balkans community across the UAE.
              Your local community in Dubai, Abu Dhabi, and beyond.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 hover:scale-105 transition-transform text-white font-bold" 
                style={{background: 'linear-gradient(90deg, #1E63FF, #7C3AED)', boxShadow: '0 8px 24px rgba(30,99,255,.4)'}}
                asChild
              >
                <Link href="/listings">Browse Listings</Link>
              </Button>
              {!isLoggedIn ? (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform border-white font-bold" 
                  asChild
                >
                  <Link href="/auth/register">Get Started Free</Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform border-white font-bold" 
                  asChild
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-2 sm:px-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white rounded-xl sm:rounded-2xl p-2 shadow-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                  <input
                    type="text"
                    id="hero-search"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for cars, homes, events..."
                    className="w-full h-11 pl-10 sm:pl-12 pr-4 rounded-lg sm:rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                    autoComplete="off"
                  />
                </div>
                <Button size="lg" type="submit" className="h-11 w-full sm:w-auto px-6 sm:px-8">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Scroll Indicator - hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
              Explore Categories
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <Link href="/auto">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-3 sm:p-4">
                  <div className="mx-auto mb-2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Car className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-sm sm:text-base">Auto</CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs hidden sm:block">
                    Cars & vehicles
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/real-estate">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-3 sm:p-4">
                  <div className="mx-auto mb-2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Home className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-sm sm:text-base">Real Estate</CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs hidden sm:block">
                    Houses & apartments
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/electronics">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-3 sm:p-4">
                  <div className="mx-auto mb-2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Package className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-sm sm:text-base">Electronics</CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs hidden sm:block">
                    Phones & gadgets
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/fashion">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-3 sm:p-4">
                  <div className="mx-auto mb-2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Package className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-sm sm:text-base">Fashion</CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs hidden sm:block">
                    Clothing & shoes
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/jobs">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-3 sm:p-4">
                  <div className="mx-auto mb-2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <Package className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-sm sm:text-base">Jobs</CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs hidden sm:block">
                    Work opportunities
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/forum">
              <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                <CardHeader className="text-center p-3 sm:p-4">
                  <div className="mx-auto mb-2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                    <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-balkly-blue" />
                  </div>
                  <CardTitle className="text-sm sm:text-base">Forum</CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs hidden sm:block">
                    Community discussions
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Banner - After Categories */}
      <AdBanner position="homepage_top" className="py-6 bg-gray-50 dark:bg-gray-800" />

      {/* Featured Listings Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Featured Listings</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Handpicked items from trusted sellers</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
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
      <section className="py-10 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Upcoming Events</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Don't miss out on exciting events</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 opacity-20" />
              <p className="text-sm sm:text-base">No events scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

      {/* Ad Banner - Middle of page */}
      <AdBanner position="homepage_middle" className="py-8 bg-white dark:bg-gray-900" />

      {/* Trending Forum Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Trending Discussions</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Join the conversation</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/forum">Visit Forum</Link>
            </Button>
          </div>
          
          {trendingTopics.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 opacity-20" />
              <p className="text-sm sm:text-base">No discussions yet</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {trendingTopics.slice(0, 5).map((topic) => (
              <Link key={topic.id} href={`/forum/topics/${topic.id}`}>
                <Card className="hover:shadow-lg transition-all hover:border-primary">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
                          {topic.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                          {topic.content}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="truncate max-w-[100px] sm:max-w-none">by {topic.user?.name}</span>
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
      <section className="py-10 sm:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Why Choose Balkly?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Smart Features</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Automatic listing enhancement, multi-language support, and content verification
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Real-time Chat</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Connect instantly with buyers and sellers through our messaging system
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Event Ticketing</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Buy tickets with QR codes for seamless event check-in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center text-white border-0" style={{background: 'linear-gradient(90deg, #1E63FF, #7C3AED)'}}>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-white">Ready to Get Started?</CardTitle>
              <CardDescription className="text-white/90 text-sm sm:text-base lg:text-lg">
                Join thousands of users buying, selling, and connecting on Balkly
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                {!isLoggedIn ? (
                  <Button size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-bold" asChild>
                    <Link href="/auth/register">Create Account</Link>
                  </Button>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-bold" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/50 hover:bg-white/20 font-bold" asChild>
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

