"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, Euro, Package } from "lucide-react";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/v1/admin/analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background py-8">Loading...</div>;
  }

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
          <h1 className="text-4xl font-bold mb-2">Platform Analytics</h1>
          <p className="text-lg opacity-90">Insights and metrics</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Conversion Funnel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.funnel && Object.entries(analytics.funnel).map(([stage, count]: [string, any]) => (
                <div key={stage} className="flex items-center gap-4">
                  <div className="w-32 text-right font-medium capitalize">
                    {stage}:
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-primary h-full flex items-center px-4 text-primary-foreground font-bold text-sm"
                      style={{
                        width: `${(count / analytics.funnel.visitors) * 100}%`,
                      }}
                    >
                      {count.toLocaleString()}
                    </div>
                  </div>
                  <div className="w-20 text-sm text-muted-foreground">
                    {((count / analytics.funnel.visitors) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Listing Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                €{analytics?.revenue?.listing_fees?.toLocaleString() || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ticket Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                €{analytics?.revenue?.ticket_fees?.toLocaleString() || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Forum Sticky Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                €{analytics?.revenue?.sticky_fees?.toLocaleString() || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Listings by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Listings by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.listings_by_category?.map((item: any) => (
                <div key={item.category_id} className="flex justify-between items-center">
                  <span className="font-medium">{item.category?.name || 'Unknown'}</span>
                  <span className="text-2xl font-bold text-primary">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

