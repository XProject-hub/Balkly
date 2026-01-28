"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Eye, Flag, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

interface ModerationItem {
  id: number;
  type: string;
  title: string;
  user: {
    id: number;
    name: string;
  };
  status: string;
  created_at: string;
  media?: Array<{ url: string }>;
}

export default function ModerationQueuePage() {
  const [queue, setQueue] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/admin/moderation", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load moderation queue");
      }

      const data = await response.json();
      setQueue(data.data || []);
    } catch (err) {
      setError("Failed to load moderation queue");
      toast.error("Failed to load moderation queue");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, type: string) => {
    setProcessingId(id);
    try {
      const response = await fetch("/api/v1/admin/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ type, id }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve item");
      }

      toast.success("Item approved successfully");
      setQueue(queue.filter((item) => item.id !== id));
    } catch (err) {
      toast.error("Failed to approve item");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number, type: string) => {
    const reason = prompt("Rejection reason (optional):");
    
    setProcessingId(id);
    try {
      const response = await fetch("/api/v1/admin/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ type, id, reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject item");
      }

      toast.success("Item rejected");
      setQueue(queue.filter((item) => item.id !== id));
    } catch (err) {
      toast.error("Failed to reject item");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const getItemType = (item: ModerationItem) => {
    if (item.type) return item.type;
    return "listing";
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
          <h1 className="text-4xl font-bold mb-2">Moderation Queue</h1>
          <p className="text-lg opacity-90">Review and approve content</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <Button onClick={loadQueue} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading moderation queue...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadQueue} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : queue.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
              <p className="text-muted-foreground">
                No items pending moderation at the moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {queue.length} item{queue.length !== 1 ? "s" : ""} pending review
            </p>
            {queue.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium uppercase">
                          {getItemType(item).replace("_", " ")}
                        </span>
                        {item.status === "pending_review" && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium dark:bg-yellow-900/30 dark:text-yellow-400">
                            <Flag className="inline h-3 w-3 mr-1" />
                            NEEDS REVIEW
                          </span>
                        )}
                      </div>
                      <CardTitle>{item.title || "Untitled"}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        By {item.user?.name || "Unknown"} • {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Preview Image */}
                  {item.media && item.media.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={item.media[0].url}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(`/listings/${item.id}`, "_blank")}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Content
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(item.id, getItemType(item))}
                      disabled={processingId === item.id}
                    >
                      {processingId === item.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(item.id, getItemType(item))}
                      disabled={processingId === item.id}
                    >
                      {processingId === item.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Reject
                    </Button>
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
