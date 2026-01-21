"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Ticket, Plus, Filter, X, SlidersHorizontal } from "lucide-react";
import { eventsAPI } from "@/lib/api";
import AdBanner from "@/components/AdBanner";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    city: "",
    category: "",
  });

  useEffect(() => {
    loadEvents();
  }, [filters, currentPage]);

  // Prevent body scroll when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileFilters]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: currentPage,
        per_page: 20,
      };
      console.log("Loading events with params:", params);
      const response = await eventsAPI.getAll(params);
      console.log("Events API response:", response);
      console.log("Events data:", response.data);
      console.log("Events array:", response.data.data);
      console.log("Total events:", response.data.total);
      
      const eventsArray = response.data.data || [];
      console.log("Setting events array length:", eventsArray.length);
      
      setEvents(eventsArray);
      setTotalEvents(response.data.total || 0);
    } catch (error) {
      console.error("Failed to load events:", error);
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter component for both mobile and desktop
  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Event Type</label>
        <select
          value={filters.type}
          onChange={(e) => {
            setFilters({ ...filters, type: e.target.value });
            setCurrentPage(1);
          }}
          className={`w-full px-3 ${isMobile ? 'py-2.5 text-base' : 'py-2'} border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
        >
          <option value="">All Types</option>
          <option value="own">Balkly Tickets</option>
          <option value="affiliate">Platinumlist Events</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={filters.category}
          onChange={(e) => {
            setFilters({ ...filters, category: e.target.value });
            setCurrentPage(1);
          }}
          className={`w-full px-3 ${isMobile ? 'py-2.5 text-base' : 'py-2'} border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
        >
          <option value="">All Categories</option>
          <option value="Concerts">Concerts</option>
          <option value="Nightlife">Nightlife</option>
          <option value="Sports">Sports Events</option>
          <option value="Comedy">Comedy Shows</option>
          <option value="Festival">Festivals</option>
          <option value="Brunches">Brunches</option>
          <option value="Water Parks">Water Parks</option>
          <option value="Theme Parks">Theme Parks</option>
          <option value="Shows">Shows & Theater</option>
          <option value="Arabic">Arabic Events</option>
          <option value="Desi">Desi Events</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">City</label>
        <select
          value={filters.city}
          onChange={(e) => {
            setFilters({ ...filters, city: e.target.value });
            setCurrentPage(1);
          }}
          className={`w-full px-3 ${isMobile ? 'py-2.5 text-base' : 'py-2'} border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
        >
          <option value="">All Cities</option>
          <option value="Dubai">Dubai</option>
          <option value="Abu Dhabi">Abu Dhabi</option>
          <option value="Sharjah">Sharjah</option>
          <option value="Ajman">Ajman</option>
          <option value="Ras Al Khaimah">Ras Al Khaimah</option>
          <option value="Al Ain">Al Ain</option>
        </select>
      </div>

      <Button
        onClick={() => {
          setFilters({ type: "", city: "", category: "" });
          setCurrentPage(1);
        }}
        variant="outline"
        className="w-full"
      >
        Clear Filters
      </Button>

      {isMobile && (
        <Button onClick={() => setShowMobileFilters(false)} className="w-full">
          Show {events.length} Results
        </Button>
      )}

      {!isMobile && (
        <div className="pt-4 border-t dark:border-gray-700">
          <p className="text-sm text-muted-foreground">
            Showing {events.length} of {totalEvents} events
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 dark:from-primary/90 dark:to-primary/70 text-primary-foreground py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2">Upcoming Events</h1>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl opacity-90">
                Discover concerts, sports, festivals, and more
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button size="default" variant="secondary" asChild className="flex-1 sm:flex-initial">
                <Link href="/events-calendar">
                  <Calendar className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">Calendar</span>
                </Link>
              </Button>
              <Button size="default" variant="secondary" asChild className="flex-1 sm:flex-initial">
                <Link href="/events/create">
                  <Plus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">Create</span> Event
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Banner - Events Top */}
      <AdBanner position="events_top" className="container mx-auto px-4 py-3 sm:py-4" />

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => setShowMobileFilters(true)}
          >
            <span className="flex items-center">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </span>
            {(filters.type || filters.city || filters.category) && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
            <div 
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-background overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
                <h2 className="font-bold text-lg">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4">
                <FilterContent isMobile={true} />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-3 sm:p-4">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="py-8 sm:py-12 text-center">
                  <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    No events found matching your criteria
                  </p>
                  <Button asChild>
                    <Link href="/events/create">Create the First Event</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {events.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                        {event.image_url ? (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-primary/20" />
                          </div>
                        )}
                        {event.type === "own" ? (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold">
                            <Ticket className="inline h-3 w-3 mr-1" />
                            <span className="hidden xs:inline">TICKETS</span>
                          </div>
                        ) : event.type === "affiliate" ? (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                            PLATINUMLIST
                          </div>
                        ) : null}
                      </div>
                      <CardHeader className="p-3 sm:p-4 lg:p-6">
                        <CardTitle className="line-clamp-1 text-sm sm:text-base lg:text-lg">{event.title}</CardTitle>
                        {event.type === "affiliate" && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            Powered by Platinumlist
                          </p>
                        )}
                        <CardDescription className="space-y-1 text-xs sm:text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(event.start_at).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                            {new Date(event.start_at).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {event.venue && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">{event.venue}, {event.city}</span>
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalEvents > 20 && (
              <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden xs:inline">Previous</span>
                  <span className="xs:hidden">‹</span>
                </Button>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: Math.min(3, Math.ceil(totalEvents / 20)) }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-8 sm:w-10 text-xs sm:text-sm"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage >= Math.ceil(totalEvents / 20)}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden xs:inline">Next</span>
                  <span className="xs:hidden">›</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

