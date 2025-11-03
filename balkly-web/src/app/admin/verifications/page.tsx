"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, X, Eye } from "lucide-react";

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/verification/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      setVerifications(data.verifications || []);
    } catch (error) {
      console.error("Failed to load verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      await fetch(`/api/v1/admin/verification/${userId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      alert("Seller verified!");
      loadVerifications();
    } catch (error) {
      alert("Failed to verify seller");
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
          <h1 className="text-4xl font-bold mb-2">Seller Verifications</h1>
          <p className="text-lg opacity-90">Review seller verification requests</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {loading ? (
          <p>Loading...</p>
        ) : verifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No pending verifications</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {verifications.map((verification) => (
              <Card key={verification.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{verification.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{verification.email}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                      PENDING
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Document Type:</p>
                      <p className="font-medium capitalize">{verification.document_type}</p>
                    </div>
                    
                    {verification.document_url && (
                      <div>
                        <a
                          href={verification.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center"
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
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Approve Verification
                      </Button>
                      <Button variant="destructive" className="flex-1">
                        <X className="mr-2 h-4 w-4" />
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

