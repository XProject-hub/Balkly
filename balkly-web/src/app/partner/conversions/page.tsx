"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, X, TrendingUp, ArrowLeft, Calendar } from "lucide-react";
import { toast } from "@/lib/toast";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("bs-BA", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export default function PartnerConversionsPage() {
  const [conversions, setConversions] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [filters, setFilters]   = useState({ type: "", status: "", from: "", to: "" });
  const [meta, setMeta]         = useState<any>(null);
  const [page, setPage]         = useState(1);
  const [form, setForm]         = useState({
    type: "digital", amount: "", description: "", notes: "",
  });

  useEffect(() => { loadConversions(1); }, []);

  const loadConversions = async (p = page) => {
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (filters.type)   params.set("type", filters.type);
      if (filters.status) params.set("status", filters.status);
      if (filters.from)   params.set("from", filters.from);
      if (filters.to)     params.set("to", filters.to);

      const res = await fetch(`/api/v1/partner/conversions?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const d = await res.json();
        setConversions(d.data || []);
        setMeta(d.meta || d);
        setPage(p);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleAddConversion = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error("Unesi ispravan iznos");
      return;
    }
    setSaving(true);
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch("/api/v1/partner/conversions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          type:        form.type,
          amount:      parseFloat(form.amount),
          description: form.description || undefined,
          notes:       form.notes || undefined,
        }),
      });
      if (res.ok) {
        toast.success("Konverzija dodana");
        setShowModal(false);
        setForm({ type: "digital", amount: "", description: "", notes: "" });
        loadConversions(1);
      } else {
        const d = await res.json();
        toast.error(d.message || "Greška");
      }
    } catch { toast.error("Mrežna greška"); } finally { setSaving(false); }
  };

  const statusColor = (s: string) => {
    if (s === "confirmed") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (s === "paid")      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  };

  const statusLabel = (s: string) => {
    if (s === "confirmed") return "Potvrđeno";
    if (s === "paid")      return "Plaćeno";
    return "Na čekanju";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/partner">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-500" /> Konverzije
          </h1>
          <p className="text-muted-foreground text-sm">Sve rezervacije i kupovine putem balkly</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Dodaj konverziju
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Tip</label>
              <select value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 border rounded-lg bg-background text-sm">
                <option value="">Sve</option>
                <option value="physical">Fizički</option>
                <option value="digital">Digitalni</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Status</label>
              <select value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border rounded-lg bg-background text-sm">
                <option value="">Sve</option>
                <option value="pending">Na čekanju</option>
                <option value="confirmed">Potvrđeno</option>
                <option value="paid">Plaćeno</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Od</label>
              <input type="date" value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                className="px-3 py-2 border rounded-lg bg-background text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Do</label>
              <input type="date" value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="px-3 py-2 border rounded-lg bg-background text-sm" />
            </div>
            <Button size="sm" onClick={() => loadConversions(1)}>Filtriraj</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : conversions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nema konverzija</h3>
            <p className="text-muted-foreground text-sm">
              Konverzije se bilježe kad korisnici rezervišu ili kupe nešto putem balkly.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              {meta?.total ?? conversions.length} konverzija ukupno
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Tip</th>
                    <th className="text-left py-3 px-4">Opis</th>
                    <th className="text-right py-3 px-4">Iznos</th>
                    <th className="text-right py-3 px-4">Komisija</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Datum i sat
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map((c: any) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          c.type === "physical"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}>
                          {c.type === "physical" ? "Fizički" : "Digitalni"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{c.description || "—"}</p>
                        {c.user?.name && (
                          <p className="text-xs text-muted-foreground">👤 {c.user.name}</p>
                        )}
                        {c.notes && (
                          <p className="text-xs text-muted-foreground italic">{c.notes}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        €{Number(c.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">
                        €{Number(c.commission_amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(c.status)}`}>
                          {statusLabel(c.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs whitespace-nowrap">
                        {fmt(c.created_at)}
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
            onClick={() => loadConversions(page - 1)}>Prethodna</Button>
          <span className="flex items-center text-sm text-muted-foreground px-2">
            {page} / {meta.last_page}
          </span>
          <Button variant="outline" size="sm" disabled={page >= meta.last_page}
            onClick={() => loadConversions(page + 1)}>Sljedeća</Button>
        </div>
      )}

      {/* Add Conversion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6 border shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Dodaj konverziju</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Upiši kada je klijent rezervisao ili kupio nešto putem balkly.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tip *</label>
                <select value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background">
                  <option value="digital">Digitalni (kliknuo link)</option>
                  <option value="physical">Fizički (došao lično)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Iznos računa (EUR) *</label>
                <input type="number" value={form.amount} step="0.01" min="0"
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="npr. 75.00"
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Šta je rezervisao / kupio</label>
                <input type="text" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="npr. Yoga čas – 1 sat, Reformer Pilates..."
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Napomena (opcionalno)</label>
                <textarea value={form.notes} rows={2}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Dodatne napomene..."
                  className="w-full px-4 py-2 border rounded-lg bg-background resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>Odustani</Button>
                <Button onClick={handleAddConversion} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Snimi konverziju
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
