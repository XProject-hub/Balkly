"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Home, Calendar, MessageCircle, Search, TrendingUp, Star, MapPin, Eye, Package, Briefcase, Building2, DollarSign, BookOpen, User } from "lucide-react";
import { listingsAPI, eventsAPI, forumAPI, jobsAPI } from "@/lib/api";
import AdBanner from "@/components/AdBanner";
import PriceDisplay from "@/components/PriceDisplay";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [latestJobs, setLatestJobs] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [latestBlogPosts, setLatestBlogPosts] = useState<any[]>([]);
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

      // Load latest jobs from Adzuna
      try {
        const jobsRes = await jobsAPI.getFeatured(4);
        setLatestJobs(jobsRes.data.jobs || []);
      } catch (e) {
        console.log("Jobs not available yet");
      }

      // Load trending forum topics
      const forumRes = await forumAPI.getTopics({ per_page: 5 });
      setTrendingTopics(forumRes.data.data || []);

      // Load latest blog posts
      try {
        const blogRes = await fetch('/api/v1/blog?per_page=3');
        const blogData = await blogRes.json();
        setLatestBlogPosts(blogData.data || []);
      } catch (e) {
        console.log("Blog not available yet");
      }
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
              <span className="text-[10px] sm:text-xs font-bold">{t.home.badge}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 animate-fade-in">
              {t.home.welcomeTo} <span className="bg-gradient-to-r from-balkly-blue to-teal-glow bg-clip-text text-transparent">Balkly</span>
            </h1>
            
            {/* Balkans Community Heading */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-teal-glow">
              {t.home.unitedBalkans}
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-white/90 font-medium">
              {t.home.oneCommunity}
            </p>
            
            {/* Description */}
            <p className="text-sm sm:text-base mb-6 sm:mb-8 text-white/80 max-w-2xl mx-auto px-2">
              {t.home.heroDesc}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 hover:scale-105 transition-transform text-white font-bold" 
                style={{background: 'linear-gradient(90deg, #1E63FF, #7C3AED)', boxShadow: '0 8px 24px rgba(30,99,255,.4)'}}
                asChild
              >
                <Link href="/listings">{t.home.viewAds}</Link>
              </Button>
              {!isLoggedIn ? (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform border-white font-bold" 
                  asChild
                >
                  <Link href="/auth/register">{t.home.getStartedFree}</Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform border-white font-bold" 
                  asChild
                >
                  <Link href="/dashboard">{t.nav.myAccount}</Link>
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
                    placeholder={t.home.searchPlaceholder}
                    className="w-full h-11 pl-10 sm:pl-12 pr-4 rounded-lg sm:rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                    autoComplete="off"
                  />
                </div>
                <Button size="lg" type="submit" className="h-11 w-full sm:w-auto px-6 sm:px-8">
                  {t.home.searchBtn}
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
              {t.home.exploreCategories}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              {t.home.findWhatLooking}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            {[
              { href: "/auto",        icon: <Car className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,         title: t.home.catAuto,        desc: t.home.catAutoDesc },
              { href: "/real-estate", icon: <Home className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,        title: t.home.catRealEstate,  desc: t.home.catRealEstateDesc },
              { href: "/electronics", icon: <Package className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,     title: t.home.catElectronics, desc: t.home.catElectronicsDesc },
              { href: "/fashion",     icon: <Package className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,     title: t.home.catFashion,     desc: t.home.catFashionDesc },
              { href: "/beauty",      icon: <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,    title: t.home.catBeauty,      desc: t.home.catBeautyDesc },
              { href: "/sports",      icon: <Dumbbell className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,    title: t.home.catSports,      desc: t.home.catSportsDesc },
              { href: "/home-garden", icon: <Sofa className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,        title: t.home.catHomeGarden,  desc: t.home.catHomeGardenDesc },
              { href: "/services",    icon: <Wrench className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,      title: t.home.catServices,    desc: t.home.catServicesDesc },
              { href: "/baby-kids",   icon: <Baby className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,        title: t.home.catBabyKids,    desc: t.home.catBabyKidsDesc },
              { href: "/health",      icon: <HeartPulse className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,  title: t.home.catHealth,      desc: t.home.catHealthDesc },
              { href: "/jobs",        icon: <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />,   title: t.home.catJobs,        desc: t.home.catJobsDesc },
              { href: "/forum",       icon: <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-balkly-blue" />, title: t.home.catForum,     desc: t.home.catForumDesc },
            ].map(({ href, icon, title, desc }) => (
              <Link key={href} href={href}>
                <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary group h-full">
                  <CardHeader className="text-center p-3 sm:p-4">
                    <div className="mx-auto mb-2 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-balkly-blue/20 to-teal-glow/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-balkly-blue/30 group-hover:to-teal-glow/20 transition-all">
                      {icon}
                    </div>
                    <CardTitle className="text-sm sm:text-base">{title}</CardTitle>
                    <CardDescription className="text-[10px] sm:text-xs hidden sm:block">{desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{t.home.featuredListings}</h2>
              <p className="text-sm sm:text-base text-muted-foreground">{t.home.featuredDesc}</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/listings">{t.home.viewAll}</Link>
            </Button>
          </div>
          
          {featuredListings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-3 opacity-20" />
              <p>{t.home.noFeaturedListings}</p>
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
                        <span className="text-2xl font-bold text-primary">{t.listingDetail.contact}</span>
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{t.home.upcomingEvents}</h2>
              <p className="text-sm sm:text-base text-muted-foreground">{t.nav.events}</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/events">{t.home.viewAll}</Link>
            </Button>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 opacity-20" />
              <p className="text-sm sm:text-base">{t.home.noEvents}</p>
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

      {/* Latest Jobs Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{t.home.latestJobs}</h2>
              <p className="text-sm sm:text-base text-muted-foreground">{t.home.catJobsDesc}</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/jobs">{t.home.viewAll}</Link>
            </Button>
          </div>
          
          {latestJobs.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 opacity-20" />
              <p className="text-sm sm:text-base">Loading jobs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {latestJobs.slice(0, 4).map((job, index) => (
                <a 
                  key={job.id} 
                  href={job.redirect_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="hover:shadow-2xl transition-all group h-full overflow-hidden">
                    {/* Header with Logo or Gradient */}
                    <div className={`h-28 relative flex items-center justify-center ${
                      !job.employer_logo ? (
                        index % 4 === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                        index % 4 === 1 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        index % 4 === 2 ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                        'bg-gradient-to-br from-orange-500 to-red-500'
                      ) : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {job.employer_logo ? (
                        <img 
                          src={job.employer_logo} 
                          alt={job.company}
                          className="h-16 w-auto max-w-[80%] object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Briefcase className={`h-12 w-12 ${job.employer_logo ? 'hidden' : ''} text-white/30`} />
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow">
                        NEW
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base">
                        {job.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      <div className="flex items-center text-sm font-medium text-foreground">
                        <Building2 className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                        <span className="truncate">{job.company}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{job.city || 'Dubai'}</span>
                      </div>
                      {(job.salary_min || job.salary_max) && (
                        <div className="flex items-center text-sm font-bold text-green-600 dark:text-green-400">
                          <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                          {job.salary_min && job.salary_max 
                            ? `${(job.salary_currency || 'AED')} ${Math.round(job.salary_min).toLocaleString()} - ${Math.round(job.salary_max).toLocaleString()}`
                            : job.salary_min 
                              ? `From ${Math.round(job.salary_min).toLocaleString()}`
                              : `Up to ${Math.round(job.salary_max).toLocaleString()}`
                          }
                        </div>
                      )}
                      {job.category && (
                        <span className="inline-block text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                          {job.category === 'FULLTIME' ? 'Full Time' : 
                           job.category === 'PARTTIME' ? 'Part Time' :
                           job.category === 'CONTRACTOR' ? 'Contract' :
                           job.category === 'INTERN' ? 'Internship' : job.category}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Car Rental Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-br from-balkly-blue via-purple-600 to-balkly-blue text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-4">
                <Car className="h-4 w-4" />
                <span>{t.nav.carRental}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {t.carRentalPage.title}
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-xl">
                {t.carRentalPage.compareFrom}. {t.carRentalPage.allInclusiveDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-white text-balkly-blue hover:bg-gray-100 font-bold px-8"
                  asChild
                >
                  <Link href="/car-rental">
                    <Car className="h-5 w-5 mr-2" />
                    {t.carRentalPage.searchCars}
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/50 text-white hover:bg-white/10 font-semibold"
                  asChild
                >
                  <Link href="/car-rental/manage-booking">
                    {t.carRentalPage.manageBtn}
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Car types preview */}
            <div className="flex-1 grid grid-cols-2 gap-4 max-w-md">
              <Link href="/car-rental" className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop" 
                    alt="Economy car"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <div className="font-semibold">{t.carRentalPage.economy}</div>
                  <div className="text-sm text-white/70">{t.carRentalPage.from} €15{t.carRentalPage.perDay}</div>
                </div>
              </Link>
              <Link href="/car-rental" className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=300&h=200&fit=crop" 
                    alt="SUV"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <div className="font-semibold">{t.carRentalPage.suv}</div>
                  <div className="text-sm text-white/70">{t.carRentalPage.from} €35{t.carRentalPage.perDay}</div>
                </div>
              </Link>
              <Link href="/car-rental" className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1590362891991-f776e747a588?w=300&h=200&fit=crop" 
                    alt="Compact car"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <div className="font-semibold">{t.carRentalPage.compact}</div>
                  <div className="text-sm text-white/70">{t.carRentalPage.from} €22{t.carRentalPage.perDay}</div>
                </div>
              </Link>
              <Link href="/car-rental" className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop" 
                    alt="Luxury car"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <div className="font-semibold">{t.carRentalPage.luxury}</div>
                  <div className="text-sm text-white/70">{t.carRentalPage.from} €75{t.carRentalPage.perDay}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner - Middle of page */}
      <AdBanner position="homepage_middle" className="py-8 bg-white dark:bg-gray-900" />

      {/* Trending Forum Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{t.home.trendingTopics}</h2>
              <p className="text-sm sm:text-base text-muted-foreground">{t.home.catForumDesc}</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/forum">{t.nav.forum}</Link>
            </Button>
          </div>
          
          {trendingTopics.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 opacity-20" />
              <p className="text-sm sm:text-base">{t.home.noTopics}</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {trendingTopics.slice(0, 5).map((topic) => (
              <Link key={topic.id} href={isLoggedIn ? `/forum/topics/${topic.id}` : "/auth/login"}>
                <Card className="hover:shadow-lg transition-all hover:border-primary">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
                          {topic.title}
                        </h3>
                        {isLoggedIn ? (
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                            {topic.content}
                          </p>
                        ) : (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-4 bg-gradient-to-r from-muted to-transparent rounded blur-sm select-none pointer-events-none" aria-hidden="true" />
                            <span className="text-xs text-primary font-medium whitespace-nowrap flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {t.forum.loginToAccess}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="truncate max-w-[100px] sm:max-w-none">{t.home.postedBy} {topic.user?.name}</span>
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

      {/* Latest Blog Posts Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{t.home.latestBlog}</h2>
              <p className="text-sm sm:text-base text-muted-foreground">{t.nav.blog}</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/blog">{t.home.viewAll}</Link>
            </Button>
          </div>
          
          {latestBlogPosts.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 opacity-20" />
              <p className="text-sm sm:text-base">{t.home.noTopics}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBlogPosts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-2xl transition-all group h-full overflow-hidden">
                    {post.featured_image ? (
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <CardHeader>
                      {post.category && (
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium uppercase mb-2 w-fit">
                          {post.category}
                        </span>
                      )}
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base">
                        {post.title}
                      </CardTitle>
                      {post.excerpt && (
                        <CardDescription className="line-clamp-2 text-sm">
                          {post.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {post.author?.name || 'Admin'}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString()}
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

      {/* Features Section */}
      <section className="py-10 sm:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            {t.home.whyBalkly}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.home.trustedCommunity}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t.home.trustedDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.home.securePayments}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t.home.secureDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.home.localSupport}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t.home.localDesc}
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
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-white">{t.home.getStarted}</CardTitle>
              <CardDescription className="text-white/90 text-sm sm:text-base lg:text-lg">
                {t.home.joinCommunity}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                {!isLoggedIn ? (
                  <Button size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-bold" asChild>
                    <Link href="/auth/register">{t.auth.createAccount}</Link>
                  </Button>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-bold" asChild>
                    <Link href="/dashboard">{t.nav.myAccount}</Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/50 hover:bg-white/20 font-bold" asChild>
                  <Link href="/listings/create">{t.home.postFreeAd}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

