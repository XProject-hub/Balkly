"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users2, Loader2, Calendar } from "lucide-react";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("bs-BA", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export default function PartnerVisitsPage() {
  const [visits, setVisits]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [meta, setMeta]       = useState<any>(null);
  const [page, setPage]       = useState(1);

  useEffect(() => { loadVisits(1); }, []);

  const loadVisits = async (p = page) => {
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (filters.from) params.set("from", filters.from);
      if (filters.to)   params.set("to", filters.to);

      const res = await fetch(`/api/v1/partner/visits?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const d = await res.json();
        setVisits(d.data || []);
        setMeta(d.meta || d);
        setPage(p);
      }
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/partner">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users2 className="h-6 w-6 text-cyan-500" /> QR Posjete
          </h1>
          <p className="text-muted-foreground text-sm">
            Sve posjete zabilježene QR skeniranjem
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Od datuma</label>
              <input type="date" value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                className="px-3 py-2 border rounded-lg bg-background text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Do datuma</label>
              <input type="date" value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="px-3 py-2 border rounded-lg bg-background text-sm" />
            </div>
            <Button size="sm" onClick={() => loadVisits(1)}>Filtriraj</Button>
            <Button size="sm" variant="ghost"
              onClick={() => { setFilters({ from: "", to: "" }); loadVisits(1); }}>
              Resetuj
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : visits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nema posjeta</h3>
            <p className="text-muted-foreground text-sm">
              QR posjete će se pojaviti ovdje kad balkly korisnici skeniraju vaš QR kod.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              {meta?.total ?? visits.length} posjeta ukupno
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Korisnik</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Datum i sat
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v: any) => (
                    <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{v.user?.name || "—"}</td>
                      <td className="py-3 px-4 text-muted-foreground">{v.user?.email || "—"}</td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {fmt(v.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1}
            onClick={() => loadVisits(page - 1)}>Prethodna</Button>
          <span className="flex items-center text-sm text-muted-foreground px-2">
            Stranica {page} od {meta.last_page}
          </span>
          <Button variant="outline" size="sm" disabled={page >= meta.last_page}
            onClick={() => loadVisits(page + 1)}>Sljedeća</Button>
        </div>
      )}
    </div>
  );
}
