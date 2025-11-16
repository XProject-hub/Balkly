"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, TrendingUp, MessageCircle, DollarSign } from "lucide-react";

export default function SellerInsightsPage() {
  const [insights, setInsights] = useState({
    totalViews: 0,
    totalMessages: 0,
    activeListings: 0,
    totalRevenue: 0,
    viewsByListing: [],
    messagesByListing: [],
  });

  useEffect(() => {
    // TODO: Load seller-specific insights from API
    // For now showing structure
  }, []);

  return (
    <div className="min-h-screen bg-mist-50 dark:bg-gray-900">
      <div className="text-white py-8" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Seller Insights</h1>
          <p className="text-lg opacity-90">Track your listing performance</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700 flex items-center justify-between">
                Total Views
                <Eye className="h-4 w-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{insights.totalViews}</p>
              <p className="text-xs text-gray-500 mt-1">Across all listings</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700 flex items-center justify-between">
                Messages Received
                <MessageCircle className="h-4 w-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{insights.totalMessages}</p>
              <p className="text-xs text-gray-500 mt-1">Total inquiries</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700 flex items-center justify-between">
                Active Listings
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{insights.activeListings}</p>
              <p className="text-xs text-gray-500 mt-1">Currently published</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700 flex items-center justify-between">
                Revenue
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-balkly-blue">€{insights.totalRevenue}</p>
              <p className="text-xs text-gray-500 mt-1">From sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Tips */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Performance Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Boost Your Listings</h3>
              <p className="text-sm text-gray-700">
                Featured listings get 10x more views. Consider upgrading your top listings for better visibility.
              </p>
            </div>

            <div className="p-4 bg-teal-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Quick Responses</h3>
              <p className="text-sm text-gray-700">
                Sellers who respond within 1 hour get 3x more completed sales. Check your messages regularly!
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Quality Photos</h3>
              <p className="text-sm text-gray-700">
                Listings with 5+ high-quality photos receive 5x more inquiries. Add multiple angles and details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

