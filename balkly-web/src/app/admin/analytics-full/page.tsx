"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Eye, Clock, TrendingUp, Monitor, Smartphone, Tablet } from "lucide-react";

export default function FullAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/analytics?period=${period}`, {
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

  if (loading || !analytics) {
    return <div className="min-h-screen bg-background p-8">Loading...</div>;
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Advanced Analytics</h1>
              <p className="text-lg opacity-90">Complete platform insights</p>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg bg-white text-foreground"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Traffic Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700">Total Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{analytics.traffic.total_visits.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Page views</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700">Unique Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{analytics.traffic.unique_visitors.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Individual users</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700">Avg Time on Site</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(analytics.traffic.avg_time_on_site / 60)}m
              </p>
              <p className="text-xs text-gray-500 mt-1">Per session</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700">Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{analytics.users.total}</p>
              <p className="text-xs text-gray-500 mt-1">
                +{analytics.users.new_today} today
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Guests: {analytics.traffic.unique_visitors - analytics.users.total}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700">Revenue (Listings)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-balkly-blue">
                €{analytics.revenue.listing_fees?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">From listing fees</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700">Revenue (Forum)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-balkly-blue">
                €{analytics.revenue.sticky_fees?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">From sticky posts</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700">Revenue (Events)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-balkly-blue">
                €{analytics.revenue.ticket_fees?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">From event tickets</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.devices.map((device: any) => (
                  <div key={device.device_type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {device.device_type === 'desktop' && <Monitor className="h-5 w-5" />}
                      {device.device_type === 'mobile' && <Smartphone className="h-5 w-5" />}
                      {device.device_type === 'tablet' && <Tablet className="h-5 w-5" />}
                      <span className="capitalize">{device.device_type}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-48 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(device.count / analytics.traffic.total_visits) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-bold w-12 text-right">{device.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.top_pages.map((page: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{page.page_title || page.page_url}</span>
                    <span className="font-bold ml-4">{page.visits}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.funnel).map(([stage, count]: [string, any]) => (
                <div key={stage} className="flex items-center gap-4">
                  <div className="w-32 text-right font-medium capitalize">
                    {stage.replace('_', ' ')}:
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-primary h-full flex items-center px-4 text-primary-foreground font-bold text-sm"
                      style={{
                        width: `${(count / analytics.funnel.visits) * 100}%`,
                      }}
                    >
                      {count.toLocaleString()}
                    </div>
                  </div>
                  <div className="w-20 text-sm text-muted-foreground">
                    {((count / analytics.funnel.visits) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.revenue.by_type.map((day: any) => (
                <div key={day.date} className="flex justify-between text-sm">
                  <span>{new Date(day.date).toLocaleDateString()}</span>
                  <span className="font-bold">€{day.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

