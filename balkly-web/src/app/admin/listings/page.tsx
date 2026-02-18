"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Package,
  Loader2,
  Star,
  Zap,
  Sparkles,
  X,
  Crown,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  is_promoted: boolean;
  is_featured: boolean;
  is_boosted: boolean;
  promotion_type: string;
  promotion_expires_at: string | null;
  featured_until: string | null;
  category?: { name: string };
  user?: { id: number; name: string };
  created_at: string;
}

interface PromoteModalState {
  open: boolean;
  listingId: number | null;
  listingTitle: string;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [promoteModal, setPromoteModal] = useState<PromoteModalState>({
    open: false,
    listingId: null,
    listingTitle: "",
  });
  const [promoForm, setPromoForm] = useState({
    promotion_type: "featured",
    duration_days: 30,
  });
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    loadListings();
  }, [filter]);

  const loadListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("per_page", "50");
      if (filter !== "all" && filter !== "promoted") params.append("status", filter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/v1/listings?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load listings");

      const data = await response.json();
      let items: Listing[] = data.data || [];

      if (filter === "promoted") {
        items = items.filter((l) => l.is_promoted);
      }

      setListings(items);
    } catch {
      setError("Failed to load listings");
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete listing: "${title}"?\n\nThis cannot be undone!`)) return;

    setProcessingId(id);
    try {
      const response = await fetch(`/api/v1/admin/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete listing");

      toast.success("Listing deleted successfully");
      setListings(listings.filter((l) => l.id !== id));
    } catch {
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

      if (!response.ok) throw new Error("Failed to approve listing");

      toast.success("Listing approved");
      loadListings();
    } catch {
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

      if (!response.ok) throw new Error("Failed to reject listing");

      toast.success("Listing rejected");
      loadListings();
    } catch {
      toast.error("Failed to reject listing");
    } finally {
      setProcessingId(null);
    }
  };

  const handleApplyPromotion = async () => {
    if (!promoteModal.listingId) return;
    setPromoLoading(true);
    try {
      const response = await fetch(
        `/api/v1/admin/listings/${promoteModal.listingId}/promote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(promoForm),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to apply promotion");
      }

      toast.success("Promotion applied successfully");
      setPromoteModal({ open: false, listingId: null, listingTitle: "" });
      loadListings();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to apply promotion";
      toast.error(message);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromotion = async (id: number) => {
    if (!confirm("Remove promotion from this listing?")) return;

    setProcessingId(id);
    try {
      const response = await fetch(`/api/v1/admin/listings/${id}/remove-promotion`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to remove promotion");

      toast.success("Promotion removed");
      loadListings();
    } catch {
      toast.error("Failed to remove promotion");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
      pending_review: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      draft: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400",
    };
    const cls = styles[status] || "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    const label = status === "pending_review" ? "Pending" : status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>;
  };

  const getPromoBadge = (listing: Listing) => {
    if (!listing.is_promoted) return null;

    const isExpired = listing.promotion_expires_at && new Date(listing.promotion_expires_at) < new Date();
    if (isExpired) return null;

    if (listing.is_boosted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
          <Zap className="h-3 w-3" /> Boosted
        </span>
      );
    }
    if (listing.is_featured) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-medium">
          <Star className="h-3 w-3" /> Featured
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
        <Sparkles className="h-3 w-3" /> Promoted
      </span>
    );
  };

  const formatExpiry = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    if (d < now) return "Expired";
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays}d left`;
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
          <p className="text-lg opacity-90">Manage all platform listings and promotions</p>
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
                  onKeyDown={(e) => e.key === "Enter" && loadListings()}
                  placeholder="Search listings..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "all", label: "All" },
                  { key: "active", label: "Active" },
                  { key: "pending_review", label: "Pending" },
                  { key: "rejected", label: "Rejected" },
                  { key: "promoted", label: "Promoted" },
                ].map((f) => (
                  <Button
                    key={f.key}
                    variant={filter === f.key ? "default" : "outline"}
                    onClick={() => setFilter(f.key)}
                    size="sm"
                  >
                    {f.key === "promoted" && <Crown className="h-3.5 w-3.5 mr-1" />}
                    {f.label}
                  </Button>
                ))}
              </div>
              <Button onClick={loadListings} variant="outline" size="sm">
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
                    className={`p-4 border rounded-lg hover:bg-accent/50 transition-colors ${
                      listing.is_promoted ? "border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-900/10" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold">{listing.title}</h3>
                          {getStatusBadge(listing.status)}
                          {getPromoBadge(listing)}
                          {listing.is_promoted && listing.promotion_expires_at && (
                            <span className="text-xs text-muted-foreground">
                              ({formatExpiry(listing.promotion_expires_at)})
                            </span>
                          )}
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
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>

                        {/* Promote / Remove Promotion */}
                        {listing.is_promoted ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-amber-600 border-amber-300"
                            onClick={() => handleRemovePromotion(listing.id)}
                            disabled={processingId === listing.id}
                          >
                            {processingId === listing.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Remove Promo
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => {
                              setPromoteModal({
                                open: true,
                                listingId: listing.id,
                                listingTitle: listing.title,
                              });
                              setPromoForm({ promotion_type: "featured", duration_days: 30 });
                            }}
                            disabled={processingId === listing.id}
                          >
                            <Crown className="h-4 w-4 mr-1" />
                            Promote
                          </Button>
                        )}

                        {(listing.status === "pending" || listing.status === "pending_review") && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(listing.id)}
                              disabled={processingId === listing.id}
                            >
                              {processingId === listing.id ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
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
                              <XCircle className="h-4 w-4 mr-1" />
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
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
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

      {/* Promote Modal */}
      {promoteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Apply Promotion</h2>
              <button
                onClick={() => setPromoteModal({ open: false, listingId: null, listingTitle: "" })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Listing: <strong>{promoteModal.listingTitle}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Promotion Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "standard", label: "Standard", icon: Sparkles, color: "blue" },
                    { value: "featured", label: "Featured", icon: Star, color: "amber" },
                    { value: "boosted", label: "Boosted", icon: Zap, color: "purple" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setPromoForm({ ...promoForm, promotion_type: type.value })}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                        promoForm.promotion_type === type.value
                          ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                          : "border-muted hover:border-muted-foreground/30"
                      }`}
                    >
                      <type.icon
                        className={`h-5 w-5 ${
                          promoForm.promotion_type === type.value
                            ? `text-${type.color}-600`
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (days)</label>
                <div className="flex gap-2 flex-wrap">
                  {[3, 5, 7, 10, 15, 30, 60, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setPromoForm({ ...promoForm, duration_days: d })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        promoForm.duration_days === d
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted hover:border-muted-foreground/30"
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={promoForm.duration_days}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, duration_days: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                    placeholder="Custom days..."
                  />
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p>
                  <strong>Type:</strong>{" "}
                  {promoForm.promotion_type.charAt(0).toUpperCase() + promoForm.promotion_type.slice(1)}
                </p>
                <p>
                  <strong>Duration:</strong> {promoForm.duration_days} days
                </p>
                <p>
                  <strong>Expires:</strong>{" "}
                  {new Date(Date.now() + promoForm.duration_days * 86400000).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setPromoteModal({ open: false, listingId: null, listingTitle: "" })}
                  variant="outline"
                  className="flex-1"
                  disabled={promoLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyPromotion}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={promoLoading}
                >
                  {promoLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Crown className="h-4 w-4 mr-2" />
                  )}
                  Apply Promotion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
