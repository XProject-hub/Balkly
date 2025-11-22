"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit, Trash2, Eye, Pause, Play, TrendingUp } from "lucide-react";
import { listingsAPI } from "@/lib/api";
import PriceDisplay from "@/components/PriceDisplay";

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadListings();
  }, [filter]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user");
      const user = userData && userData !== 'undefined' ? JSON.parse(userData) : {};
      
      console.log("Loading listings for user ID:", user.id);
      
      // WORKAROUND: Fetch ALL listings and filter client-side
      const response = await fetch("/api/v1/listings", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log("Listings response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("All listings data:", data);
        
        // Filter to show only current user's listings
        const allListings = data.data || [];
        const myListings = allListings.filter((listing: any) => listing.user_id === user.id);
        
        console.log("Total listings:", allListings.length);
        console.log("My listings:", myListings.length);
        console.log("My listings data:", myListings);
        
        setListings(myListings);
      } else {
        console.error("Failed to load listings, status:", response.status);
      }
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await listingsAPI.delete(id.toString());
      setListings(listings.filter((l) => l.id !== id));
      alert("Listing deleted successfully!");
    } catch (error) {
      alert("Failed to delete listing");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    
    try {
      await listingsAPI.update(id.toString(), { status: newStatus });
      loadListings();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const filteredListings = listings.filter((listing) => {
    if (filter === "all") return true;
    return listing.status === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Listings</h1>
              <p className="text-lg opacity-90">Manage your posted items</p>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/listings/create">
                <Plus className="mr-2 h-5 w-5" />
                New Listing
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All ({listings.length})
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
          >
            Active ({listings.filter((l) => l.status === "active").length})
          </Button>
          <Button
            variant={filter === "pending_review" ? "default" : "outline"}
            onClick={() => setFilter("pending_review")}
          >
            Pending ({listings.filter((l) => l.status === "pending_review").length})
          </Button>
          <Button
            variant={filter === "paused" ? "default" : "outline"}
            onClick={() => setFilter("paused")}
          >
            Paused ({listings.filter((l) => l.status === "paused").length})
          </Button>
          <Button
            variant={filter === "expired" ? "default" : "outline"}
            onClick={() => setFilter("expired")}
          >
            Expired ({listings.filter((l) => l.status === "expired").length})
          </Button>
        </div>

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
        ) : filteredListings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {filter === "all"
                  ? "You haven't created any listings yet"
                  : `No ${filter} listings`}
              </p>
              <Button asChild>
                <Link href="/listings/create">Create Your First Listing</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden">
                        {listing.media?.[0] ? (
                          <img
                            src={listing.media[0].url}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">📦</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {listing.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            {listing.price ? (
                              <PriceDisplay
                                amount={listing.price}
                                currency={listing.currency || 'EUR'}
                                className="font-bold text-primary text-xl"
                              />
                            ) : (
                              <span className="font-bold text-primary text-xl">Contact</span>
                            )}
                            <span className="flex items-center text-muted-foreground">
                              <Eye className="h-4 w-4 mr-1" />
                              {listing.views_count} views
                            </span>
                            <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium capitalize">
                              {listing.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/listings/${listing.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/listings/${listing.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        {listing.status === "active" || listing.status === "paused" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(listing.id, listing.status)}
                          >
                            {listing.status === "active" ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={listing.status === "active"}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Boost
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>

                      {/* Stats Bar */}
                      {listing.status === "active" && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Views</p>
                              <p className="font-bold">{listing.views_count || 0}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Messages</p>
                              <p className="font-bold">0</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Expires</p>
                              <p className="font-bold">
                                {listing.expires_at
                                  ? new Date(listing.expires_at).toLocaleDateString()
                                  : "Never"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

