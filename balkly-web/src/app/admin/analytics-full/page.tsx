"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, Eye, Clock, Monitor, Smartphone, Tablet, DollarSign } from "lucide-react";

export default function FullAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({ total: 0, registered: 0, guests: 0 });

  useEffect(() => {
    loadAnalytics();
    loadOnlineUsers();
    
    // Refresh online users every 30 seconds
    const interval = setInterval(loadOnlineUsers, 30000);
    return () => clearInterval(interval);
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

  const loadOnlineUsers = async () => {
    try {
      const response = await fetch("/api/v1/online/count");
      const data = await response.json();
      setOnlineUsers(data);
    } catch (error) {
      console.error("Failed to load online users:", error);
    }
  };

  if (loading || !analytics) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  const formatNumber = (num: number) => num?.toLocaleString() || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-white py-8" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
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
              <p className="text-lg opacity-90">Real-time platform insights</p>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg bg-white text-gray-900 font-medium"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Online Now - Real-time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Online Now</p>
                  <p className="text-4xl font-bold mt-2">{onlineUsers.total}</p>
                  <p className="text-sm opacity-75 mt-1">Active users</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-balkly-blue to-iris-purple text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Registered</p>
                  <p className="text-4xl font-bold mt-2">{onlineUsers.registered}</p>
                  <p className="text-sm opacity-75 mt-1">Members online</p>
                </div>
                <Users className="h-12 w-12 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-glow to-cyan-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Guests</p>
                  <p className="text-4xl font-bold mt-2">{onlineUsers.guests}</p>
                  <p className="text-sm opacity-75 mt-1">Browsing</p>
                </div>
                <Eye className="h-12 w-12 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-l-4 border-balkly-blue">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.traffic.total_visits)}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Page views</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-teal-glow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{analytics.users.total}</p>
              <p className="text-xs text-gray-500 mt-2">
                +{analytics.users.new_today} registered today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-iris-purple">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Time on Site</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(analytics.traffic.avg_time_on_site / 60)}m
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">Per session</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Bounce Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{analytics.traffic.bounce_rate}%</p>
              <p className="text-xs text-gray-500 mt-2">Single page visits</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Cards - Large & Prominent */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Listings Revenue</h3>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-green-700">
                €{formatNumber(analytics.revenue.listing_fees || 0)}
              </p>
              <p className="text-sm text-green-600 mt-2">From promoted listings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Forum Revenue</h3>
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-blue-700">
                €{formatNumber(analytics.revenue.sticky_fees || 0)}
              </p>
              <p className="text-sm text-blue-600 mt-2">From sticky posts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Events Revenue</h3>
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-purple-700">
                €{formatNumber(analytics.revenue.ticket_fees || 0)}
              </p>
              <p className="text-sm text-purple-600 mt-2">From event tickets</p>
            </CardContent>
          </Card>
        </div>

        {/* Device Breakdown - Modern Cards */}
        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Monitor className="h-5 w-5 text-balkly-blue" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analytics.devices && analytics.devices.length > 0 ? (
                analytics.devices.map((device: any) => {
                  const total = analytics.traffic.total_visits || 1;
                  const percentage = ((device.count / total) * 100).toFixed(1);
                  
                  return (
                    <div key={device.device_type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          {device.device_type === 'desktop' && <Monitor className="h-5 w-5 text-balkly-blue" />}
                          {device.device_type === 'mobile' && <Smartphone className="h-5 w-5 text-teal-glow" />}
                          {device.device_type === 'tablet' && <Tablet className="h-5 w-5 text-iris-purple" />}
                          <span className="font-medium text-gray-900 capitalize">{device.device_type}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">{device.count} visits</span>
                          <span className="font-bold text-gray-900 w-12 text-right">{percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            device.device_type === 'desktop' ? 'bg-gradient-to-r from-balkly-blue to-blue-600' :
                            device.device_type === 'mobile' ? 'bg-gradient-to-r from-teal-glow to-cyan-600' :
                            'bg-gradient-to-r from-iris-purple to-purple-600'
                          }`}
                          style={{width: `${percentage}%`}}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">No device data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel - Modern Design */}
        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.funnel && Object.entries(analytics.funnel).map(([stage, count]: [string, any], index) => {
                const maxCount = analytics.funnel.visits || 1;
                const percentage = ((count / maxCount) * 100).toFixed(1);
                const colors = [
                  'from-balkly-blue to-blue-600',
                  'from-teal-glow to-cyan-600',
                  'from-iris-purple to-purple-600',
                  'from-green-500 to-emerald-600',
                  'from-yellow-500 to-orange-600',
                ];
                
                return (
                  <div key={stage} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900 capitalize">{stage.replace('_', ' ')}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">{formatNumber(count)}</span>
                        <span className="font-bold text-gray-900 w-16 text-right">{percentage}%</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all duration-700 flex items-center justify-end pr-3`}
                          style={{width: `${percentage}%`}}
                        >
                          {parseFloat(percentage) > 10 && (
                            <span className="text-xs font-bold text-white">{count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        {analytics.top_pages && analytics.top_pages.length > 0 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Most Visited Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.top_pages.slice(0, 10).map((page: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-balkly-blue/10 flex items-center justify-center text-sm font-bold text-balkly-blue">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {page.page_title || page.page_url}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 ml-4">{page.visits}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
