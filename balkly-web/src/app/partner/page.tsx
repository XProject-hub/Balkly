"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick, Ticket, DollarSign, TrendingUp, Loader2 } from "lucide-react";

export default function PartnerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/v1/partner/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setData(await res.json());
      } else {
        setError("Failed to load dashboard data.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-destructive font-semibold mb-4">{error}</p>
        <Button onClick={() => { setError(""); setLoading(true); loadDashboard(); }}>Retry</Button>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Partner Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {data?.partner?.company_name} — Tracking code: <code className="bg-muted px-2 py-0.5 rounded text-sm">{data?.partner?.tracking_code}</code>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MousePointerClick className="h-4 w-4" /> Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_clicks || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Today: {stats.clicks_today || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Ticket className="h-4 w-4" /> Vouchers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.redeemed_vouchers || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Active: {stats.active_vouchers || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_conversions || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Today: {stats.conversions_today || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">€{Number(stats.total_commission || 0).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Pending: €{Number(stats.commission_pending || 0).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Clicks (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.clicks_by_day?.length > 0 ? (
              <div className="space-y-2">
                {data.clicks_by_day.slice(-14).map((d: any) => (
                  <div key={d.date} className="flex items-center gap-3 text-sm">
                    <span className="w-24 text-muted-foreground">{d.date}</span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (d.count / Math.max(...data.clicks_by_day.map((x: any) => x.count), 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="font-medium w-10 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No click data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversions (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.conversions_by_day?.length > 0 ? (
              <div className="space-y-2">
                {data.conversions_by_day.slice(-14).map((d: any) => (
                  <div key={d.date} className="flex items-center gap-3 text-sm">
                    <span className="w-24 text-muted-foreground">{d.date}</span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (d.count / Math.max(...data.conversions_by_day.map((x: any) => x.count), 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="font-medium w-20 text-right">
                      {d.count} (€{Number(d.commission || 0).toFixed(2)})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No conversion data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Redemptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Redemptions</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recent_redemptions?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Code</th>
                    <th className="text-left py-2 px-3">Offer</th>
                    <th className="text-left py-2 px-3">Staff</th>
                    <th className="text-right py-2 px-3">Amount</th>
                    <th className="text-left py-2 px-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_redemptions.map((r: any) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2 px-3 font-mono">{r.voucher?.code}</td>
                      <td className="py-2 px-3">{r.voucher?.offer?.title || "-"}</td>
                      <td className="py-2 px-3">{r.staff?.name}</td>
                      <td className="py-2 px-3 text-right">€{Number(r.amount || 0).toFixed(2)}</td>
                      <td className="py-2 px-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No redemptions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
