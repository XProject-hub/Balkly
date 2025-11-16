"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Ticket, Plus, Filter } from "lucide-react";
import { eventsAPI } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    city: "",
  });

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getAll(filters);
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 dark:from-primary/90 dark:to-primary/70 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold mb-2">Upcoming Events</h1>
              <p className="text-xl opacity-90">
                Discover concerts, sports, festivals, and more
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/events-calendar">
                  <Calendar className="mr-2 h-5 w-5" />
                  Calendar View
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/events/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Event
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">All Types</option>
                    <option value="own">Balkly Tickets</option>
                    <option value="affiliate">Partner Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    placeholder="e.g., Dubai"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <Button
                  onClick={() => setFilters({ type: "", city: "" })}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No events found matching your criteria
                  </p>
                  <Button asChild>
                    <Link href="/events/create">Create the First Event</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <Calendar className="h-20 w-20 text-primary/20" />
                          </div>
                        )}
                        {event.type === "own" ? (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                            <Ticket className="inline h-3 w-3 mr-1" />
                            TICKETS AVAILABLE
                          </div>
                        ) : event.type === "affiliate" ? (
                          <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                            FEATURED
                          </div>
                        ) : null}
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                        <CardDescription className="space-y-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(event.start_at).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {new Date(event.start_at).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {event.venue && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.venue}, {event.city}
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* GetYourGuide Tours & Experiences Widget */}
        <div className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Explore Tours & Experiences in UAE</CardTitle>
              <CardDescription>
                Discover amazing activities, tours, and experiences from GetYourGuide
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* GetYourGuide Widget */}
              <div 
                data-gyg-widget="auto" 
                data-gyg-partner-id="MG30TZM" 
                data-gyg-cmp="UAE_Post"
                className="min-h-[400px]"
              />
              <p className="text-xs text-center text-muted-foreground mt-4">
                Powered by GetYourGuide - Book tours and experiences with confidence
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

