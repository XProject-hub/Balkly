"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MousePointerClick, Ticket, Euro, TrendingUp,
  Loader2, ScanLine, Users2, Calendar,
} from "lucide-react";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("bs-BA", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export default function PartnerDashboardPage() {
  const [data, setData]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/v1/partner/dashboard", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        setData(await res.json());
      } else {
        setError("Greška pri učitavanju dashboard-a.");
      }
    } catch {
      setError("Mrežna greška. Pokušaj ponovo.");
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
        <Button onClick={() => { setError(""); setLoading(true); loadDashboard(); }}>Pokušaj ponovo</Button>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-muted-foreground mt-1">{data?.partner?.company_name}</p>
        </div>
        <Link href="/partner/scan">
          <Button size="lg" className="gap-2 shadow-lg">
            <ScanLine className="h-5 w-5" />
            Skeniraj QR kod
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-blue-500" /> Web klikovi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_clicks || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Danas: {stats.clicks_today || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users2 className="h-4 w-4 text-cyan-500" /> QR posjete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_visits || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Danas: {stats.visits_today || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Ticket className="h-4 w-4 text-orange-500" /> Voucheri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.redeemed_vouchers || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Iskorišteno</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" /> Konverzije
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_conversions || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Danas: {stats.conversions_today || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Euro className="h-4 w-4 text-green-600" /> Komisija
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">€{Number(stats.total_commission || 0).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Na čekanju: €{Number(stats.commission_pending || 0).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent QR visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-cyan-500" />
              Nedavne QR posjete
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recent_visits?.length > 0 ? (
              <div className="space-y-2">
                {data.recent_visits.map((v: any) => (
                  <div key={v.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                    <div>
                      <p className="font-medium">{v.user?.name || "Nepoznat korisnik"}</p>
                      <p className="text-xs text-muted-foreground">{v.user?.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono whitespace-nowrap ml-3">
                      {fmt(v.created_at)}
                    </span>
                  </div>
                ))}
                <Link href="/partner/visits" className="block">
                  <Button variant="outline" size="sm" className="w-full mt-2">Sve posjete</Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Nema QR posjeta još</p>
            )}
          </CardContent>
        </Card>

        {/* Recent conversions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Nedavne konverzije
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recent_conversions?.length > 0 ? (
              <div className="space-y-2">
                {data.recent_conversions.map((c: any) => (
                  <div key={c.id} className="py-2 border-b last:border-0 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                          c.type === "physical" ? "bg-orange-100 text-orange-800" : "bg-indigo-100 text-indigo-800"
                        }`}>
                          {c.type === "physical" ? "Fizički" : "Digitalni"}
                        </span>
                        <span className="font-medium">€{Number(c.amount).toFixed(2)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{fmt(c.created_at)}</span>
                    </div>
                    {c.description && (
                      <p className="text-xs text-muted-foreground mt-1 ml-1">{c.description}</p>
                    )}
                    {c.user?.name && (
                      <p className="text-xs text-muted-foreground mt-0.5 ml-1">👤 {c.user.name}</p>
                    )}
                    <p className="text-xs text-green-600 font-semibold mt-0.5">
                      Komisija: €{Number(c.commission_amount).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Link href="/partner/conversions" className="block">
                  <Button variant="outline" size="sm" className="w-full mt-2">Sve konverzije</Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Nema konverzija još</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Clicks chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5 text-blue-500" />
              Klikovi (zadnjih 30 dana)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.clicks_by_day?.length > 0 ? (
              <div className="space-y-2">
                {data.clicks_by_day.slice(-14).map((d: any) => (
                  <div key={d.date} className="flex items-center gap-3 text-sm">
                    <span className="w-24 text-muted-foreground text-xs">{d.date}</span>
                    <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (d.count / Math.max(...data.clicks_by_day.map((x: any) => x.count), 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="font-medium w-8 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Nema podataka o klikovima</p>
            )}
          </CardContent>
        </Card>

        {/* Redemptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-orange-500" />
              Nedavna iskorištenost vouchera
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recent_redemptions?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 text-xs">Kod</th>
                      <th className="text-left py-2 px-2 text-xs">Iznos</th>
                      <th className="text-left py-2 px-2 text-xs">Datum i sat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_redemptions.map((r: any) => (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="py-2 px-2 font-mono text-xs">{r.voucher?.code}</td>
                        <td className="py-2 px-2">€{Number(r.amount || 0).toFixed(2)}</td>
                        <td className="py-2 px-2 text-muted-foreground text-xs font-mono">
                          {fmt(r.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Nema iskorištenih vouchera</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
