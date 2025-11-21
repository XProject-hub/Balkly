"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Package, Calendar, MessageCircle } from "lucide-react";
import { searchAPI } from "@/lib/api";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState<any>({
    listings: [],
    events: [],
    forum: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (q: string) => {
    if (!q.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchAPI.search(q);
      setResults(response.data.results || {});
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery)}`);
      performSearch(searchQuery);
    }
  };

  const totalResults =
    (results.listings?.length || 0) +
    (results.events?.length || 0) +
    (results.forum?.length || 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Search Results</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for anything..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 placeholder:text-gray-500"
                />
              </div>
              <Button size="lg" type="submit">
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : totalResults === 0 && query ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No results found</h2>
              <p className="text-muted-foreground">
                Try different keywords or browse our categories
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div>
              <p className="text-muted-foreground mb-6">
                Found {totalResults} results for "<strong>{query}</strong>"
              </p>
            </div>

            {/* Listings Results */}
            {results.listings && results.listings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Package className="mr-2 h-6 w-6" />
                  Listings ({results.listings.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.listings.map((listing: any) => (
                    <Link key={listing.id} href={`/listings/${listing.id}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {listing.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-primary">
                              €{listing.price?.toLocaleString()}
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
            )}

            {/* Events Results */}
            {results.events && results.events.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Calendar className="mr-2 h-6 w-6" />
                  Events ({results.events.length})
                </h2>
                <div className="space-y-3">
                  {results.events.map((event: any) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {event.description}
                              </p>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(event.start_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {event.city}
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
            )}

            {/* Forum Results */}
            {results.forum && results.forum.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <MessageCircle className="mr-2 h-6 w-6" />
                  Forum ({results.forum.length})
                </h2>
                <div className="space-y-3">
                  {results.forum.map((topic: any) => (
                    <Link key={topic.id} href={`/forum/topics/${topic.id}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-bold mb-1">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {topic.content}
                          </p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>by {topic.user?.name}</span>
                            <span>{topic.replies_count} replies</span>
                            <span>{topic.views_count} views</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

