"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, X, BarChart3 } from "lucide-react";
import { toast } from "@/lib/toast";

export default function PartnerConversionsPage() {
  const [conversions, setConversions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ type: "", status: "", from: "", to: "" });
  const [form, setForm] = useState({ type: "digital", amount: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => { loadConversions(); }, []);

  const loadConversions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.set("type", filters.type);
      if (filters.status) params.set("status", filters.status);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);

      const res = await fetch(`/api/v1/partner/conversions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversions(data.data || []);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleAddConversion = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) { toast.error("Enter a valid amount"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/v1/partner/conversions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: form.type, amount: parseFloat(form.amount) }),
      });
      if (res.ok) {
        toast.success("Conversion recorded");
        setShowModal(false);
        setForm({ type: "digital", amount: "" });
        loadConversions();
      } else {
        const d = await res.json(); toast.error(d.message || "Failed");
      }
    } catch { toast.error("Network error"); } finally { setSaving(false); }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "paid": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Conversions</h1>
          <p className="text-muted-foreground">Track physical (voucher) and digital (link) conversions</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Digital Conversion
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3">
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border rounded-lg bg-background text-sm">
              <option value="">All Types</option>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
            </select>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border rounded-lg bg-background text-sm">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="paid">Paid</option>
            </select>
            <input type="date" value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="px-3 py-2 border rounded-lg bg-background text-sm" />
            <input type="date" value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="px-3 py-2 border rounded-lg bg-background text-sm" />
            <Button variant="outline" size="sm" onClick={loadConversions}>Apply</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : conversions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No conversions yet</h3>
            <p className="text-muted-foreground">Conversions will appear here when vouchers are redeemed or you add manual conversions.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Voucher</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-right py-3 px-4">Commission</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map((c: any) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          c.type === "physical" ? "bg-orange-100 text-orange-800" : "bg-indigo-100 text-indigo-800"
                        }`}>{c.type}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">{c.voucher?.code || "-"}</td>
                      <td className="py-3 px-4 text-right">€{Number(c.amount).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">€{Number(c.commission_amount).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6 border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Digital Conversion</h2>
              <button onClick={() => setShowModal(false)}><X className="h-6 w-6" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Record a conversion for a customer who came through your Balkly tracking link.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background">
                  <option value="digital">Digital (from link)</option>
                  <option value="physical">Physical (walk-in)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bill Amount (EUR) *</label>
                <input type="number" value={form.amount} step="0.01" min="0"
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="e.g. 45.00"
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleAddConversion} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Record Conversion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
