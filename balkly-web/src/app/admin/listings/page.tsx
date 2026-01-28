"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2, Eye, CheckCircle, XCircle, RefreshCw, Search, Package, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  category?: { name: string };
  user?: { id: number; name: string };
  created_at: string;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadListings();
  }, [filter]);

  const loadListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("per_page", "50");
      if (filter !== "all") params.append("status", filter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/v1/listings?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load listings");
      }

      const data = await response.json();
      setListings(data.data || []);
    } catch (err) {
      setError("Failed to load listings");
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete listing: "${title}"?\n\nThis cannot be undone!`)) {
      return;
    }

    setProcessingId(id);
    try {
      const response = await fetch(`/api/v1/admin/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      toast.success("Listing deleted successfully");
      setListings(listings.filter((l) => l.id !== id));
    } catch (err) {
      toast.error("Failed to delete listing");
    } finally {
      setProcessingId(null);
    }
  };

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      const response = await fetch("/api/v1/admin/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ type: "listing", id }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve listing");
      }

      toast.success("Listing approved");
      loadListings();
    } catch (err) {
      toast.error("Failed to approve listing");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Rejection reason (optional):");

    setProcessingId(id);
    try {
      const response = await fetch("/api/v1/admin/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ type: "listing", id, reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject listing");
      }

      toast.success("Listing rejected");
      loadListings();
    } catch (err) {
      toast.error("Failed to reject listing");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
            Active
          </span>
        );
      case "pending":
      case "pending_review":
        return (
          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs font-medium">
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">
            Rejected
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 rounded text-xs font-medium">
            Draft
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Listings Management</h1>
          <p className="text-lg opacity-90">Manage all platform listings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search listings..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "active" ? "default" : "outline"}
                  onClick={() => setFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filter === "pending_review" ? "default" : "outline"}
                  onClick={() => setFilter("pending_review")}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === "rejected" ? "default" : "outline"}
                  onClick={() => setFilter("rejected")}
                >
                  Rejected
                </Button>
              </div>
              <Button onClick={loadListings} variant="outline">
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Listings List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Listings ({listings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading listings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadListings} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No listings found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{listing.title}</h3>
                          {getStatusBadge(listing.status)}
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          ID: {listing.id} | Category: {listing.category?.name || "N/A"} |
                          User: {listing.user?.name || "Unknown"} | Price: €
                          {listing.price?.toLocaleString("de-DE")}
                        </p>

                        <p className="text-sm line-clamp-2">{listing.description}</p>
                      </div>

                      <div className="flex gap-2 ml-4 flex-wrap justify-end">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/listings/${listing.id}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>

                        {(listing.status === "pending" || listing.status === "pending_review") && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(listing.id)}
                              disabled={processingId === listing.id}
                            >
                              {processingId === listing.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600"
                              onClick={() => handleReject(listing.id)}
                              disabled={processingId === listing.id}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(listing.id, listing.title)}
                          disabled={processingId === listing.id}
                        >
                          {processingId === listing.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
