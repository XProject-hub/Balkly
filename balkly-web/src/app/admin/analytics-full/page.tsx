// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, TrendingUp, TrendingDown, Users, Eye, Clock, Monitor, Smartphone, Tablet, 
  DollarSign, ShoppingCart, MessageSquare, Star, Calendar, Globe, Chrome, BarChart3,
  Activity, Target, Zap, Award, ArrowUpRight, ArrowDownRight, Package, Ticket, Pin
} from "lucide-react";

// Dynamically import Recharts to avoid SSR issues
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart) as any, { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area) as any, { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart) as any, { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar) as any, { ssr: false });
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart) as any, { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line) as any, { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis) as any, { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis) as any, { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid) as any, { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip) as any, { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend) as any, { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer) as any, { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart) as any, { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie) as any, { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell) as any, { ssr: false });
const RadialBarChart = dynamic(() => import('recharts').then(mod => mod.RadialBarChart) as any, { ssr: false });
const RadialBar = dynamic(() => import('recharts').then(mod => mod.RadialBar) as any, { ssr: false });
const ComposedChart = dynamic(() => import('recharts').then(mod => mod.ComposedChart) as any, { ssr: false });

import { getCurrencySymbol } from "@/lib/currency";

const COLORS = ['#1E63FF', '#06B6D4', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function FullAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({ total: 0, registered: 0, guests: 0 });
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
    loadOnlineUsers();
    setCurrencySymbol(getCurrencySymbol('EUR'));
    
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
      setAnalytics(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || !analytics.traffic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-xl font-semibold mb-2">Failed to load analytics</p>
          <p className="text-gray-400 text-sm mb-4">
            {analytics?.error || analytics?.message || 'Unable to fetch analytics data. Please ensure you are logged in as an admin.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={loadAnalytics} variant="outline" className="border-gray-600">
              Retry
            </Button>
            <Link href="/admin">
              <Button variant="outline" className="border-gray-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => num?.toLocaleString() || '0';
  const formatCurrency = (num: number) => `${currencySymbol}${formatNumber(Math.round(num || 0))}`;
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Get daily data for charts
  const getDailyData = () => {
    if (!analytics?.traffic?.visits_by_day) return [];

    const dataMap = new Map();

    analytics.traffic.visits_by_day.forEach((day: any) => {
      dataMap.set(day.date, {
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: day.date,
        visitors: day.unique_visitors || 0,
        pageViews: day.visits || 0,
        users: 0,
        listings: 0,
        orders: 0,
        revenue: 0,
      });
    });

    analytics.traffic.users_by_day?.forEach((day: any) => {
      if (dataMap.has(day.date)) {
        dataMap.get(day.date).users = day.count || 0;
      }
    });

    analytics.traffic.listings_by_day?.forEach((day: any) => {
      if (dataMap.has(day.date)) {
        dataMap.get(day.date).listings = day.count || 0;
      }
    });

    analytics.traffic.orders_by_day?.forEach((day: any) => {
      if (dataMap.has(day.date)) {
        dataMap.get(day.date).orders = day.count || 0;
        dataMap.get(day.date).revenue = Math.round(parseFloat(day.revenue) || 0);
      }
    });

    return Array.from(dataMap.values());
  };

  // Get peak hours data
  const getPeakHoursData = () => {
    if (!analytics?.peak_hours) return [];
    return analytics.peak_hours.map((h: any) => ({
      hour: `${h.hour.toString().padStart(2, '0')}:00`,
      visits: h.visits,
    }));
  };

  // Get day of week data
  const getDayOfWeekData = () => {
    if (!analytics?.day_of_week) return [];
    return analytics.day_of_week.map((d: any) => ({
      day: DAYS[d.day - 1] || d.day,
      visits: d.visits,
    }));
  };

  // Revenue breakdown for pie chart
  const getRevenueBreakdown = () => {
    const data = [];
    if (analytics?.revenue?.listing_fees > 0) {
      data.push({ name: 'Listing Fees', value: analytics.revenue.listing_fees, color: '#10B981' });
    }
    if (analytics?.revenue?.ticket_fees > 0) {
      data.push({ name: 'Event Tickets', value: analytics.revenue.ticket_fees, color: '#7C3AED' });
    }
    if (analytics?.revenue?.sticky_fees > 0) {
      data.push({ name: 'Sticky Posts', value: analytics.revenue.sticky_fees, color: '#1E63FF' });
    }
    if (analytics?.revenue?.other_fees > 0) {
      data.push({ name: 'Other', value: analytics.revenue.other_fees, color: '#F59E0B' });
    }
    return data;
  };

  // Funnel data
  const getFunnelData = () => {
    if (!analytics?.funnel) return [];
    const f = analytics.funnel;
    return [
      { name: 'Visits', value: f.visits, fill: '#1E63FF', percentage: 100 },
      { name: 'Unique Visitors', value: f.unique_visitors, fill: '#06B6D4', percentage: f.visits > 0 ? Math.round((f.unique_visitors / f.visits) * 100) : 0 },
      { name: 'Registrations', value: f.registrations, fill: '#7C3AED', percentage: f.unique_visitors > 0 ? Math.round((f.registrations / f.unique_visitors) * 100) : 0 },
      { name: 'Listings Created', value: f.listings_created, fill: '#10B981', percentage: f.registrations > 0 ? Math.round((f.listings_created / f.registrations) * 100) : 0 },
      { name: 'Orders', value: f.orders, fill: '#F59E0B', percentage: f.listings_created > 0 ? Math.round((f.orders / f.listings_created) * 100) : 0 },
      { name: 'Paid Orders', value: f.paid_orders, fill: '#EF4444', percentage: f.orders > 0 ? Math.round((f.paid_orders / f.orders) * 100) : 0 },
    ];
  };

  const GrowthIndicator = ({ value }: { value: number }) => {
    if (value === 0) return <span className="text-gray-400 text-sm">0%</span>;
    const isPositive = value > 0;
    return (
      <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        {Math.abs(value)}%
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'traffic', label: 'Traffic', icon: Activity },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'engagement', label: 'Engagement', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-400" />
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-white/60">Real-time platform insights and metrics</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">{onlineUsers.total} online</span>
              </div>

              {/* Period selector */}
              <select
                value={period}
                onChange={(e) => setPeriod(Number.parseInt(e.target.value, 10))}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7" className="bg-slate-800">Last 7 days</option>
                <option value="30" className="bg-slate-800">Last 30 days</option>
                <option value="90" className="bg-slate-800">Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Eye className="h-5 w-5 text-blue-400" />
                    <GrowthIndicator value={0} />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.traffic.total_visits)}</p>
                  <p className="text-xs text-white/60">Page Views</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-cyan-400" />
                    <GrowthIndicator value={analytics.users.growth_rate} />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.traffic.unique_visitors)}</p>
                  <p className="text-xs text-white/60">Unique Visitors</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    <GrowthIndicator value={analytics.users.growth_rate} />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.users.total)}</p>
                  <p className="text-xs text-white/60">Total Users</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="h-5 w-5 text-green-400" />
                    <GrowthIndicator value={analytics.listings.growth_rate} />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.listings.active)}</p>
                  <p className="text-xs text-white/60">Active Listings</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingCart className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.orders?.paid_in_period || 0)}</p>
                  <p className="text-xs text-white/60">Paid Orders</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                    <GrowthIndicator value={analytics.revenue.growth_rate} />
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(analytics.revenue.in_period)}</p>
                  <p className="text-xs text-white/60">Revenue ({period}d)</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Performance Overview
                </CardTitle>
                <CardDescription className="text-white/60">Daily metrics for the last {period} days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={getDailyData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradientVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E63FF" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#1E63FF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                      <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}
                        labelStyle={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}
                        itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="visitors" 
                        stroke="#1E63FF" 
                        strokeWidth={2}
                        fill="url(#gradientVisitors)" 
                        name="Visitors"
                      />
                      <Bar yAxisId="left" dataKey="users" fill="#06B6D4" name="New Users" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="listings" fill="#7C3AED" name="New Listings" radius={[4, 4, 0, 0]} />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', r: 4 }}
                        name={`Revenue (${currencySymbol})`}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getFunnelData().map((item, index) => (
                      <div key={item.name} className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">{item.name}</span>
                          <span className="text-sm font-bold text-white">{formatNumber(item.value)}</span>
                        </div>
                        <div className="h-8 bg-white/5 rounded-lg overflow-hidden relative">
                          <div 
                            className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                            style={{ 
                              width: `${Math.max((item.value / (getFunnelData()[0]?.value || 1)) * 100, 5)}%`,
                              backgroundColor: item.fill 
                            }}
                          >
                            {index > 0 && (
                              <span className="text-xs font-medium text-white/90">
                                {item.percentage}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Breakdown */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getRevenueBreakdown().length > 0 ? (
                    <div className="flex items-center gap-6">
                      <div className="w-1/2 h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getRevenueBreakdown()}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {getRevenueBreakdown().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => formatCurrency(value)}
                              contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-1/2 space-y-3">
                        {getRevenueBreakdown().map((item) => (
                          <div key={item.name} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <div className="flex-1">
                              <p className="text-sm text-white/80">{item.name}</p>
                              <p className="text-lg font-bold text-white">{formatCurrency(item.value)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-white/40">
                      <p>No revenue data yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <MessageSquare className="h-8 w-8 text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.activity?.messages_in_period || 0)}</p>
                  <p className="text-xs text-white/60">Messages ({period}d)</p>
                  <p className="text-xs text-white/40 mt-1">Total: {formatNumber(analytics.activity?.total_messages || 0)}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Star className="h-8 w-8 text-amber-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.activity?.reviews_in_period || 0)}</p>
                  <p className="text-xs text-white/60">Reviews ({period}d)</p>
                  <p className="text-xs text-white/40 mt-1">Total: {formatNumber(analytics.activity?.total_reviews || 0)}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <MessageSquare className="h-8 w-8 text-purple-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.activity?.forum_posts_in_period || 0)}</p>
                  <p className="text-xs text-white/60">Forum Posts ({period}d)</p>
                  <p className="text-xs text-white/40 mt-1">Total: {formatNumber(analytics.activity?.forum_posts || 0)}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Calendar className="h-8 w-8 text-green-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.activity?.events_active || 0)}</p>
                  <p className="text-xs text-white/60">Active Events</p>
                  <p className="text-xs text-white/40 mt-1">Total: {formatNumber(analytics.activity?.events_total || 0)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Traffic Tab */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            {/* Traffic Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4 text-center">
                  <Eye className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.traffic.total_visits)}</p>
                  <p className="text-xs text-white/60">Page Views</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4 text-center">
                  <Users className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.traffic.unique_visitors)}</p>
                  <p className="text-xs text-white/60">Unique Visitors</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4 text-center">
                  <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{formatTime(analytics.traffic.avg_time_on_site)}</p>
                  <p className="text-xs text-white/60">Avg. Session</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4 text-center">
                  <Activity className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{analytics.traffic.page_views_per_session || 0}</p>
                  <p className="text-xs text-white/60">Pages/Session</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4 text-center">
                  <TrendingDown className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{analytics.traffic.bounce_rate}%</p>
                  <p className="text-xs text-white/60">Bounce Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Traffic Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getDailyData()}>
                      <defs>
                        <linearGradient id="gradientPageViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E63FF" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#1E63FF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gradientUniqueVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px'
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="pageViews" stroke="#1E63FF" fill="url(#gradientPageViews)" name="Page Views" />
                      <Area type="monotone" dataKey="visitors" stroke="#06B6D4" fill="url(#gradientUniqueVisitors)" name="Unique Visitors" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Device Breakdown */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Devices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.devices?.map((device: any) => {
                      const total = analytics.traffic.total_visits || 1;
                      const percentage = ((device.count / total) * 100).toFixed(1);
                      const Icon = device.device_type === 'desktop' ? Monitor : 
                                   device.device_type === 'mobile' ? Smartphone : Tablet;
                      const color = device.device_type === 'desktop' ? '#1E63FF' : 
                                    device.device_type === 'mobile' ? '#06B6D4' : '#7C3AED';
                      
                      return (
                        <div key={device.device_type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" style={{ color }} />
                              <span className="text-sm text-white/80 capitalize">{device.device_type}</span>
                            </div>
                            <span className="text-sm font-bold text-white">{percentage}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Browser Breakdown */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Chrome className="h-5 w-5" />
                    Browsers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.browsers?.map((browser: any, index: number) => {
                      const total = analytics.traffic.total_visits || 1;
                      const percentage = ((browser.count / total) * 100).toFixed(1);
                      
                      return (
                        <div key={browser.browser} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-sm text-white/80">{browser.browser}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40">{formatNumber(browser.count)}</span>
                            <span className="text-sm font-bold text-white w-12 text-right">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Referrers */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Top Referrers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.referrers?.length > 0 ? analytics.referrers.slice(0, 6).map((ref: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-white/80 truncate max-w-[180px]">{ref.source}</span>
                        <span className="text-sm font-bold text-white">{formatNumber(ref.count)}</span>
                      </div>
                    )) : (
                      <p className="text-white/40 text-sm text-center py-4">No referrer data yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Peak Hours & Day of Week */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Traffic by Hour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getPeakHoursData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="visits" fill="#1E63FF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Traffic by Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getDayOfWeekData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="visits" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Pages */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Most Visited Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.top_pages?.map((page: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{page.page_title || 'Untitled'}</p>
                        <p className="text-xs text-white/40 truncate">{page.page_url}</p>
                      </div>
                      <span className="text-sm font-bold text-white">{formatNumber(page.visits)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* Revenue Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <p className="text-sm text-white/60 mb-1">Today</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(analytics.revenue.today)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <p className="text-sm text-white/60 mb-1">This Week</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(analytics.revenue.this_week)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <p className="text-sm text-white/60 mb-1">This Month</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(analytics.revenue.this_month)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <p className="text-sm text-white/60 mb-1">All Time</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(analytics.revenue.total_all_time)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={getDailyData()}>
                      <defs>
                        <linearGradient id="gradientRevenueArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                      <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
                      <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px'
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === 'Revenue') return [formatCurrency(value), name];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        fill="url(#gradientRevenueArea)" 
                        name="Revenue"
                      />
                      <Bar yAxisId="right" dataKey="orders" fill="#7C3AED" name="Orders" radius={[4, 4, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Package className="h-5 w-5 text-green-400" />
                    </div>
                    <span className="text-sm text-white/60">Listing Fees</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(analytics.revenue.listing_fees)}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Ticket className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="text-sm text-white/60">Event Tickets</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(analytics.revenue.ticket_fees)}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Pin className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="text-sm text-white/60">Sticky Posts</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(analytics.revenue.sticky_fees)}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <ShoppingCart className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="text-sm text-white/60">Avg. Order Value</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(analytics.revenue.avg_order_value)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Orders Stats */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Order Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold text-white">{formatNumber(analytics.orders?.total || 0)}</p>
                    <p className="text-xs text-white/60">Total Orders</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold text-green-400">{formatNumber(analytics.orders?.paid || 0)}</p>
                    <p className="text-xs text-white/60">Paid Orders</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold text-amber-400">{formatNumber(analytics.orders?.pending || 0)}</p>
                    <p className="text-xs text-white/60">Pending</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold text-white">{formatNumber(analytics.orders?.in_period || 0)}</p>
                    <p className="text-xs text-white/60">Orders ({period}d)</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold text-blue-400">{analytics.orders?.conversion_rate || 0}%</p>
                    <p className="text-xs text-white/60">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Users className="h-8 w-8 text-blue-400 mb-2" />
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.users.total)}</p>
                  <p className="text-xs text-white/60">Total Users</p>
                  <div className="mt-2">
                    <GrowthIndicator value={analytics.users.growth_rate} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Zap className="h-8 w-8 text-green-400 mb-2" />
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.users.new_today)}</p>
                  <p className="text-xs text-white/60">New Today</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Award className="h-8 w-8 text-purple-400 mb-2" />
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.users.verified)}</p>
                  <p className="text-xs text-white/60">Verified Users</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Package className="h-8 w-8 text-amber-400 mb-2" />
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.users.active_sellers)}</p>
                  <p className="text-xs text-white/60">Active Sellers</p>
                </CardContent>
              </Card>
            </div>

            {/* User Registration Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">User Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getDailyData()}>
                      <defs>
                        <linearGradient id="gradientUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px'
                        }}
                      />
                      <Area type="monotone" dataKey="users" stroke="#7C3AED" fill="url(#gradientUsers)" name="New Users" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4 text-center">
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.users.new_this_week)}</p>
                  <p className="text-xs text-white/60">New This Week</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4 text-center">
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.users.new_this_month)}</p>
                  <p className="text-xs text-white/60">New This Month</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4 text-center">
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.users.new_in_period)}</p>
                  <p className="text-xs text-white/60">New ({period}d)</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4 text-center">
                  <p className="text-3xl font-bold text-white">{formatNumber(analytics.users.with_2fa)}</p>
                  <p className="text-xs text-white/60">With 2FA</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && (
          <div className="space-y-6">
            {/* Listings Stats */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-400" />
                  Listings Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <p className="text-3xl font-bold text-white">{formatNumber(analytics.listings.total)}</p>
                    <p className="text-xs text-white/60">Total</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-500/10">
                    <p className="text-3xl font-bold text-green-400">{formatNumber(analytics.listings.active)}</p>
                    <p className="text-xs text-white/60">Active</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-500/10">
                    <p className="text-3xl font-bold text-amber-400">{formatNumber(analytics.listings.pending)}</p>
                    <p className="text-xs text-white/60">Pending</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-500/10">
                    <p className="text-3xl font-bold text-blue-400">{formatNumber(analytics.listings.sold)}</p>
                    <p className="text-xs text-white/60">Sold</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-500/10">
                    <p className="text-3xl font-bold text-purple-400">{formatNumber(analytics.listings.new_in_period)}</p>
                    <p className="text-xs text-white/60">New ({period}d)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listings by Category */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Listings by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={analytics.listings.by_category?.map((cat: any) => ({
                        name: cat.category?.name || 'Unknown',
                        count: cat.count,
                      })).slice(0, 10)}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                      <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={120} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {analytics.listings.by_category?.slice(0, 10).map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Activity Trends */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Daily Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getDailyData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} name="New Users" />
                      <Line type="monotone" dataKey="listings" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="New Listings" />
                      <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} name="Orders" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Platform Activity Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <MessageSquare className="h-8 w-8 text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.activity?.total_messages || 0)}</p>
                  <p className="text-xs text-white/60">Total Messages</p>
                  <p className="text-xs text-green-400 mt-1">+{formatNumber(analytics.activity?.messages_in_period || 0)} in {period}d</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Star className="h-8 w-8 text-amber-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.activity?.total_reviews || 0)}</p>
                  <p className="text-xs text-white/60">Total Reviews</p>
                  <p className="text-xs text-green-400 mt-1">+{formatNumber(analytics.activity?.reviews_in_period || 0)} in {period}d</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <MessageSquare className="h-8 w-8 text-purple-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.activity?.forum_topics || 0)}</p>
                  <p className="text-xs text-white/60">Forum Topics</p>
                  <p className="text-xs text-green-400 mt-1">+{formatNumber(analytics.activity?.forum_topics_in_period || 0)} in {period}d</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Calendar className="h-8 w-8 text-green-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.activity?.events_total || 0)}</p>
                  <p className="text-xs text-white/60">Total Events</p>
                  <p className="text-xs text-blue-400 mt-1">{formatNumber(analytics.activity?.events_active || 0)} active</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Online Users - Floating Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="bg-slate-900/95 border-white/20 backdrop-blur-sm shadow-2xl">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white font-bold">{onlineUsers.total}</span>
                  <span className="text-white/60 text-sm">online</span>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-blue-400">{onlineUsers.registered} users</span>
                  <span className="text-white/40">{onlineUsers.guests} guests</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
