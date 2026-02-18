"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Loader2, X, Tag } from "lucide-react";
import { toast } from "@/lib/toast";

const BENEFIT_LABELS: Record<string, string> = {
  free_item: "Free Item",
  percent_off: "% Off",
  fixed_off: "Fixed Discount (EUR)",
};

export default function PartnerOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", benefit_type: "percent_off",
    benefit_value: 10, min_purchase: "", terms: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => { loadOffers(); }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/partner/offers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers || []);
      }
    } catch {} finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", description: "", benefit_type: "percent_off", benefit_value: 10, min_purchase: "", terms: "" });
    setShowModal(true);
  };

  const openEdit = (o: any) => {
    setEditingId(o.id);
    setForm({
      title: o.title, description: o.description || "",
      benefit_type: o.benefit_type, benefit_value: o.benefit_value,
      min_purchase: o.min_purchase || "", terms: o.terms || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/v1/partner/offers/${editingId}` : "/api/v1/partner/offers";
      const method = editingId ? "PATCH" : "POST";
      const body: any = { ...form, benefit_value: parseFloat(String(form.benefit_value)) || 0 };
      if (body.min_purchase) body.min_purchase = parseFloat(body.min_purchase);
      else delete body.min_purchase;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editingId ? "Offer updated" : "Offer created");
        setShowModal(false);
        loadOffers();
      } else {
        const d = await res.json(); toast.error(d.message || "Failed");
      }
    } catch { toast.error("Network error"); } finally { setSaving(false); }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm("Deactivate this offer?")) return;
    try {
      await fetch(`/api/v1/partner/offers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Offer deactivated");
      loadOffers();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Offers</h1>
          <p className="text-muted-foreground">Manage discounts and offers for Balkly users</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Create Offer</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : offers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No offers yet</h3>
            <p className="text-muted-foreground mb-4">Create an offer so Balkly users can get vouchers.</p>
            <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Create Offer</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((o) => (
            <Card key={o.id} className={!o.is_active ? "opacity-50" : ""}>
              <CardContent className="py-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{o.title}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(o)}><Edit className="h-4 w-4" /></Button>
                    {o.is_active && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeactivate(o.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{o.description || "No description"}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {BENEFIT_LABELS[o.benefit_type]}: {o.benefit_value}
                    {o.benefit_type === "percent_off" ? "%" : o.benefit_type === "fixed_off" ? " EUR" : ""}
                  </span>
                  {o.vouchers_count > 0 && (
                    <span className="text-xs text-muted-foreground">{o.vouchers_count} vouchers</span>
                  )}
                </div>
                {o.min_purchase && (
                  <p className="text-xs text-muted-foreground mt-2">Min purchase: €{o.min_purchase}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-lg w-full p-6 border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingId ? "Edit Offer" : "Create Offer"}</h2>
              <button onClick={() => setShowModal(false)}><X className="h-6 w-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={form.title} placeholder="e.g. 10% Off Your Bill"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Benefit Type</label>
                  <select value={form.benefit_type}
                    onChange={(e) => setForm({ ...form, benefit_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background">
                    <option value="percent_off">Percentage Off</option>
                    <option value="fixed_off">Fixed Discount (EUR)</option>
                    <option value="free_item">Free Item</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value</label>
                  <input type="number" value={form.benefit_value} step="0.01" min="0"
                    onChange={(e) => setForm({ ...form, benefit_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Purchase (EUR, optional)</label>
                <input type="number" value={form.min_purchase} step="0.01" min="0"
                  onChange={(e) => setForm({ ...form, min_purchase: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Terms & Conditions</label>
                <textarea value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                  placeholder="e.g. Valid for dine-in only..."
                  className="w-full px-4 py-2 border rounded-lg bg-background h-16" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Save" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
