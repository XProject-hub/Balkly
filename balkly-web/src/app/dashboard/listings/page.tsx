"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Eye, Pause, Play, TrendingUp, CheckCircle } from "lucide-react";
import { listingsAPI } from "@/lib/api";
import PriceDisplay from "@/components/PriceDisplay";

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  sold: "Sold",
  pending_review: "Pending Review",
  expired: "Expired",
  draft: "Draft",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  paused: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  sold: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending_review: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/v1/listings/my-listings?per_page=100", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setListings(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(id);
    try {
      await listingsAPI.delete(id.toString());
      setListings(listings.filter((l) => l.id !== id));
      setDeleteConfirm(null);
    } catch {
      alert("Failed to delete. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatus = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      await listingsAPI.update(id.toString(), { status: newStatus });
      setListings(listings.map((l) => l.id === id ? { ...l, status: newStatus } : l));
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "paused", label: "Paused" },
    { key: "sold", label: "Sold" },
    { key: "pending_review", label: "Pending" },
    { key: "expired", label: "Expired" },
  ];

  const filtered = filter === "all" ? listings : listings.filter((l) => l.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              My Account
            </Button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Ads</h1>
              <p className="opacity-80 mt-1">{listings.length} total ads</p>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/listings/create">
                <Plus className="mr-2 h-5 w-5" />
                Post New Ad
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => {
            const count = f.key === "all" ? listings.length : listings.filter((l) => l.status === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {f.label} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5 h-32" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-xl font-semibold mb-2">No ads here</p>
              <p className="text-muted-foreground mb-6">
                {filter === "all" ? "You haven't posted any ads yet." : `No ${STATUS_LABEL[filter] || filter} ads.`}
              </p>
              {filter === "all" && (
                <Button asChild>
                  <Link href="/listings/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Post Your First Ad
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Image */}
                    <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-muted">
                      {listing.media?.[0] ? (
                        <img
                          src={listing.media[0].url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-base truncate">{listing.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[listing.status] || "bg-muted text-muted-foreground"}`}>
                              {STATUS_LABEL[listing.status] || listing.status}
                            </span>
                          </div>
                          {listing.price > 0 ? (
                            <PriceDisplay
                              amount={listing.price}
                              currency={listing.currency || "EUR"}
                              className="text-primary font-bold"
                            />
                          ) : (
                            <span className="text-primary font-bold">Contact for price</span>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            <Eye className="h-3 w-3 inline mr-1" />
                            {listing.views_count || 0} views · {listing.city || "No location"} · {new Date(listing.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/listings/${listing.id}`}>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Link>
                        </Button>

                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/listings/${listing.id}/edit`}>
                            ✏️ Edit
                          </Link>
                        </Button>

                        {listing.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoading === listing.id}
                            onClick={() => handleStatus(listing.id, "paused")}
                            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                          >
                            <Pause className="h-3.5 w-3.5 mr-1" />
                            Pause
                          </Button>
                        )}

                        {listing.status === "paused" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoading === listing.id}
                            onClick={() => handleStatus(listing.id, "active")}
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            <Play className="h-3.5 w-3.5 mr-1" />
                            Activate
                          </Button>
                        )}

                        {(listing.status === "active" || listing.status === "paused") && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoading === listing.id}
                            onClick={() => handleStatus(listing.id, "sold")}
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Mark Sold
                          </Button>
                        )}

                        {listing.status === "sold" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoading === listing.id}
                            onClick={() => handleStatus(listing.id, "active")}
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            <Play className="h-3.5 w-3.5 mr-1" />
                            Reactivate
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="text-purple-600 border-purple-300 hover:bg-purple-50"
                        >
                          <Link href={`/listings/create?boost=${listing.id}`}>
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                            Boost
                          </Link>
                        </Button>

                        {deleteConfirm === listing.id ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={actionLoading === listing.id}
                              onClick={() => handleDelete(listing.id)}
                            >
                              {actionLoading === listing.id ? "Deleting..." : "Confirm Delete"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(listing.id)}
                            className="text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
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
