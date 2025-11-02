"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Calendar,
  MessageCircle,
  Settings,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeListings: 0,
    revenue: 0,
    pendingModeration: 0,
    newUsersToday: 0,
    ordersToday: 0,
  });

  useEffect(() => {
    // Load stats (mock data)
    setStats({
      totalUsers: 1247,
      activeListings: 523,
      revenue: 12450,
      pendingModeration: 8,
      newUsersToday: 23,
      ordersToday: 45,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg opacity-90">Platform overview and management</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersToday} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.ordersToday} orders today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Moderation</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingModeration}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/moderation">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Moderation Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Review flagged content and approve listings
                </p>
                {stats.pendingModeration > 0 && (
                  <div className="mt-2 inline-block px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded-full font-bold">
                    {stats.pendingModeration} pending
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage users, roles, and permissions
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/listings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Listings Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View and manage all platform listings
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Orders & Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Review transactions and process refunds
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View platform metrics and insights
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Platform Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configure pricing, categories, and features
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "John Doe", email: "john@example.com", time: "2 min ago" },
                  { name: "Jane Smith", email: "jane@example.com", time: "15 min ago" },
                  { name: "Bob Wilson", email: "bob@example.com", time: "1 hour ago" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{user.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: "Listing Plan", amount: 14.99, status: "Paid" },
                  { type: "Event Tickets", amount: 120.0, status: "Paid" },
                  { type: "Forum Sticky", amount: 9.99, status: "Paid" },
                ].map((order, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.type}</p>
                      <p className="text-sm text-muted-foreground">€{order.amount}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

