"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  MessageCircle,
  Calendar,
  TrendingUp,
  Plus,
  Eye,
  DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    activeListings: 0,
    totalViews: 0,
    messages: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Load user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load real stats from API
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/v1/profile/insights", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          activeListings: data.insights?.total_listings || data.insights?.active_listings || 0,
          totalViews: data.insights?.total_views || 0,
          messages: data.insights?.total_messages || 0,
          revenue: (data.insights?.total_orders || 0) * 10,
        });
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
      // Fallback to 0
      setStats({
        activeListings: 0,
        totalViews: 0,
        messages: 0,
        revenue: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-lg opacity-90 mt-1">
            Manage your listings, messages, and account
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Button size="lg" asChild className="h-auto py-4">
            <Link href="/listings/create">
              <Plus className="mr-2 h-5 w-5" />
              <span>New Listing</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-auto py-4">
            <Link href="/dashboard/listings">
              <Package className="mr-2 h-5 w-5" />
              <span>My Listings</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-auto py-4">
            <Link href="/dashboard/messages">
              <MessageCircle className="mr-2 h-5 w-5" />
              <span>Messages</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-auto py-4">
            <Link href="/dashboard/orders">
              <DollarSign className="mr-2 h-5 w-5" />
              <span>Orders</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-auto py-4">
            <Link href="/dashboard/favorites">
              <Package className="mr-2 h-5 w-5" />
              <span>Favorites</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-auto py-4">
            <Link href="/dashboard/offers">
              <DollarSign className="mr-2 h-5 w-5" />
              <span>My Offers</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-auto py-4">
            <Link href="/dashboard/insights">
              <Package className="mr-2 h-5 w-5" />
              <span>Insights</span>
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">Your posted items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">Total page views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.messages > 0 ? `${stats.messages} total` : "No messages yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.revenue}</div>
              <p className="text-xs text-muted-foreground">From completed sales</p>
            </CardContent>
          </Card>
        </div>

          {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Listings</CardTitle>
              <CardDescription>Your latest posted items</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.activeListings === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No listings yet</p>
                  <Button asChild>
                    <Link href="/listings/create">Create Your First Listing</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/listings">View All Listings</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.messages === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/messages">View All Messages</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

