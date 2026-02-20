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
  Euro,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    activeListings: 0,
    totalViews: 0,
    messages: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Load user from localStorage - safe parse
    const userData = localStorage.getItem("user");
    if (userData && userData !== 'undefined' && userData !== 'null') {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
      }
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
      <div className="bg-primary text-primary-foreground py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            {t.dashboard.welcomeBack} {user?.name || t.common.user}!
          </h1>
          <p className="text-sm sm:text-base lg:text-lg opacity-90 mt-1">
            {t.dashboard.manageAccount}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Quick Actions - Scrollable on mobile */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 sm:hidden">{t.dashboard.quickActions}</h2>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-7">
            <Button size="default" asChild className="flex-shrink-0 h-auto py-3 sm:py-4 px-3 sm:px-4">
              <Link href="/listings/create" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{t.dashboard.postAd}</span>
              </Link>
            </Button>
            <Button size="default" variant="outline" asChild className="flex-shrink-0 h-auto py-3 sm:py-4 px-3 sm:px-4">
              <Link href="/dashboard/listings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{t.dashboard.myListings}</span>
              </Link>
            </Button>
            <Button size="default" variant="outline" asChild className="flex-shrink-0 h-auto py-3 sm:py-4 px-3 sm:px-4">
              <Link href="/dashboard/messages" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{t.dashboard.myMessages}</span>
              </Link>
            </Button>
            <Button size="default" variant="outline" asChild className="flex-shrink-0 h-auto py-3 sm:py-4 px-3 sm:px-4">
              <Link href="/dashboard/orders" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <Euro className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{t.dashboard.orders}</span>
              </Link>
            </Button>
            <Button size="default" variant="outline" asChild className="flex-shrink-0 h-auto py-3 sm:py-4 px-3 sm:px-4">
              <Link href="/dashboard/favorites" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{t.dashboard.favorites}</span>
              </Link>
            </Button>
            <Button size="default" variant="outline" asChild className="flex-shrink-0 h-auto py-3 sm:py-4 px-3 sm:px-4">
              <Link href="/dashboard/offers" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <Euro className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{t.dashboard.myOffers}</span>
              </Link>
            </Button>
            <Button size="default" variant="outline" asChild className="flex-shrink-0 h-auto py-3 sm:py-4 px-3 sm:px-4">
              <Link href="/dashboard/insights" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{t.dashboard.insights}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 lg:p-6 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t.dashboard.activeAds}</CardTitle>
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.activeListings}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{t.dashboard.yourPostedAds}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 lg:p-6 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t.dashboard.totalViews}</CardTitle>
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{t.dashboard.totalPageViews}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 lg:p-6 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t.dashboard.myMessages}</CardTitle>
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.messages}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stats.messages > 0 ? `${stats.messages} ${t.dashboard.messagesTotal}` : t.dashboard.noMessagesShort}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 lg:p-6 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t.dashboard.revenue}</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">€{stats.revenue}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{t.dashboard.fromSales}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">{t.dashboard.recentAds}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t.dashboard.yourLatestAds}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {stats.activeListings === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-sm text-muted-foreground mb-4">{t.dashboard.noAdsYet}</p>
                  <Button asChild size="sm">
                    <Link href="/listings/create">{t.dashboard.postFirstAd}</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Button variant="outline" asChild size="sm">
                    <Link href="/dashboard/listings">{t.dashboard.viewAllAds}</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">{t.dashboard.recentMessages}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t.dashboard.latestInquiries}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {stats.messages === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-sm text-muted-foreground">{t.dashboard.noMessages}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Button variant="outline" asChild size="sm">
                    <Link href="/dashboard/messages">{t.dashboard.viewAllMessages}</Link>
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

