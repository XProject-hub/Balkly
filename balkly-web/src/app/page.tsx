"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Home, Calendar, MessageCircle, Search, TrendingUp, Star, MapPin, Eye, Package } from "lucide-react";
import { listingsAPI, eventsAPI, forumAPI } from "@/lib/api";
import AdBanner from "@/components/AdBanner";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    try {
      // Load featured listings
      const listingsRes = await listingsAPI.getAll({ per_page: 6, sort_by: 'views_count' });
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
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-[600px] overflow-hidden bg-gradient-hero">
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-glow-overlay z-0" />
        
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
          {/* Fallback gradient - add video element here when you have video file */}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Balkly</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Your modern marketplace for listings, events, and community discussions.
              <br />
              Buy, sell, and connect with confidence.
            </p>
            <div className="flex gap-4 justify-center flex-wrap mb-12">
              <Button size="lg" className="text-lg px-8 py-6 btn-primary hover:scale-105 transition-transform" asChild>
                <Link href="/listings">Browse Listings</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm hover:bg-teal-glow/20 hover:scale-105 transition-transform border-white/30" asChild>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for cars, homes, events, or anything..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-transparent"
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
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/listings?category=auto">
              <Card className="hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Car className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Auto</CardTitle>
                  <CardDescription>
                    Cars, motorcycles, and vehicles
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/listings?category=real-estate">
              <Card className="hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Home className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Real Estate</CardTitle>
                  <CardDescription>
                    Houses, apartments, and properties
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/events">
              <Card className="hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Calendar className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Events</CardTitle>
                  <CardDescription>
                    Concerts, sports, and entertainment
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/forum">
              <Card className="hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <MessageCircle className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Forum</CardTitle>
                  <CardDescription>
                    Community discussions and topics
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-20">
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
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      FEATURED
                    </div>
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
                      <span className="text-2xl font-bold text-primary">
                        €{listing.price?.toLocaleString() || "Contact"}
                      </span>
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
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-muted/30">
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
                        {new Date(event.start_at).toLocaleDateString()}
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
        </div>
      </section>

      {/* Trending Forum Section */}
      <section className="py-20">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Join thousands of users buying, selling, and connecting on Balkly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register">Create Account</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent" asChild>
                  <Link href="/listings/create">Post a Listing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Balkly. All rights reserved.</p>
            <div className="flex gap-4 justify-center mt-4">
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

