"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Moon,
  Search,
  Loader2,
  Users,
  Calendar,
  Mail,
  User,
  RefreshCw,
  Download,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface ViewEntry {
  id: number;
  user_id: number;
  ip_address: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export default function AdminRamadanPage() {
  const [views, setViews] = useState<ViewEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const loadViews = useCallback(async (page = 1, q = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        per_page: "25",
        page: String(page),
      });
      if (q) params.set("search", q);

      const res = await fetch(`/api/v1/admin/ramadan/views?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setViews(data.views?.data || []);
      setTotal(data.total || 0);
      setCurrentPage(data.views?.current_page || 1);
      setLastPage(data.views?.last_page || 1);
    } catch {
      toast.error("Greška pri učitavanju podataka");
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => {
    loadViews(1, "");
  }, []);

  const handleSearch = () => {
    setSearch(searchInput);
    loadViews(1, searchInput);
  };

  const handleExportCSV = () => {
    const headers = ["Datum i Vrijeme", "Ime", "Email", "IP Adresa"];
    const rows = views.map((v) => [
      formatDate(v.created_at),
      v.user?.name ?? "–",
      v.user?.email ?? "–",
      v.ip_address ?? "–",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ramazan-pregledi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Nazad
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#8b1c2d]/20 rounded-xl border border-[#8b1c2d]/30">
                <Moon className="h-6 w-6 text-[#e05c72]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Ramazan Kampanja</h1>
                <p className="text-muted-foreground text-sm">
                  Korisnici koji su pregledali promo kod
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={views.length === 0}
          >
            <Download className="h-4 w-4" />
            Izvezi CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Ukupno korisnika vidjelo kod
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Svaki korisnik zabilježen samo jednom
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Aktivan kod
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono tracking-widest text-[#e05c72]">
                Balkly26
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Važi tokom Ramazana 2026
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search + Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Lista pregleda
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Pretraži po imenu ili emailu..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-9 pr-4 py-2 text-sm border rounded-lg bg-background w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button size="sm" onClick={handleSearch} variant="secondary">
                  Traži
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    loadViews(1, "");
                  }}
                  title="Osvježi"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : views.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground space-y-2">
                <Moon className="h-10 w-10 mx-auto opacity-30" />
                <p className="text-sm">
                  {search ? "Nema rezultata za ovu pretragu." : "Još niko nije pregledao kod."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left px-6 py-3 text-muted-foreground font-medium">#</th>
                        <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" /> Ime
                          </span>
                        </th>
                        <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" /> Email
                          </span>
                        </th>
                        <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> Datum i Vrijeme
                          </span>
                        </th>
                        <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">
                          IP Adresa
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {views.map((view, idx) => (
                        <tr
                          key={view.id}
                          className="border-b hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-6 py-3 text-muted-foreground text-xs">
                            {(currentPage - 1) * 25 + idx + 1}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {view.user?.name ?? (
                              <span className="text-muted-foreground italic">Obrisan korisnik</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {view.user?.email ?? "–"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              {formatDate(view.created_at)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs font-mono hidden lg:table-cell">
                            {view.ip_address ?? "–"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y">
                  {views.map((view, idx) => (
                    <div key={view.id} className="px-4 py-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {view.user?.name ?? (
                            <span className="text-muted-foreground italic">Obrisan korisnik</span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">#{(currentPage - 1) * 25 + idx + 1}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {view.user?.email ?? "–"}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(view.created_at)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {lastPage > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Stranica {currentPage} od {lastPage}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadViews(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prethodna
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadViews(currentPage + 1)}
                        disabled={currentPage === lastPage}
                      >
                        Sljedeća
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
