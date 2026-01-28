"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, X, Eye, Loader2, RefreshCw } from "lucide-react";
import { toast } from "@/lib/toast";

interface Verification {
  id: number;
  user_id: number;
  name: string;
  email: string;
  document_type: string;
  document_url: string;
  status: string;
  created_at: string;
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/admin/verification/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to load verifications");
      }
      
      const data = await response.json();
      setVerifications(data.verifications || data.data || []);
    } catch (err) {
      setError("Failed to load verifications");
      toast.error("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    setProcessingId(userId);
    try {
      const response = await fetch(`/api/v1/admin/verification/${userId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to approve verification");
      }
      
      toast.success("Seller verified successfully!");
      setVerifications(verifications.filter((v) => v.user_id !== userId));
    } catch (err) {
      toast.error("Failed to verify seller");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: number) => {
    const reason = prompt("Rejection reason (optional):");
    
    setProcessingId(userId);
    try {
      const response = await fetch(`/api/v1/admin/verification/${userId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to reject verification");
      }
      
      toast.success("Verification rejected");
      setVerifications(verifications.filter((v) => v.user_id !== userId));
    } catch (err) {
      toast.error("Failed to reject verification");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <h1 className="text-4xl font-bold mb-2">Seller Verifications</h1>
          <p className="text-lg opacity-90">Review seller verification requests</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <Button onClick={loadVerifications} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading verifications...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadVerifications} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : verifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No Pending Verifications</h2>
              <p className="text-muted-foreground">
                All verification requests have been processed
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {verifications.length} verification{verifications.length !== 1 ? "s" : ""} pending review
            </p>
            {verifications.map((verification) => (
              <Card key={verification.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{verification.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{verification.email}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold dark:bg-yellow-900/30 dark:text-yellow-400">
                      PENDING
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Document Type</p>
                        <p className="font-medium capitalize">{verification.document_type?.replace("_", " ") || "ID Document"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p className="font-medium">{formatDate(verification.created_at)}</p>
                      </div>
                    </div>

                    {verification.document_url && (
                      <div>
                        <a
                          href={verification.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Document
                        </a>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleApprove(verification.user_id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={processingId === verification.user_id}
                      >
                        {processingId === verification.user_id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="mr-2 h-4 w-4" />
                        )}
                        Approve Verification
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleReject(verification.user_id)}
                        disabled={processingId === verification.user_id}
                      >
                        {processingId === verification.user_id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <X className="mr-2 h-4 w-4" />
                        )}
                        Reject
                      </Button>
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
