"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Search, Edit, Trash2, Users, MousePointerClick, DollarSign, X, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

interface Partner {
  id: number;
  user_id: number;
  company_name: string;
  company_logo: string | null;
  company_description: string | null;
  website_url: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  contact_email: string | null;
  commission_type: string;
  commission_rate: number;
  default_voucher_duration_hours: number;
  tracking_code: string;
  is_active: boolean;
  user?: { id: number; name: string; email: string; profile?: { avatar_url?: string } };
  vouchers_count?: number;
  clicks_count?: number;
  conversions_count?: number;
  total_commission?: number;
}

const COMMISSION_LABELS: Record<string, string> = {
  percent_of_bill: "% of bill",
  fixed_per_client: "Fixed EUR/client",
  digital_referral_percent: "Digital referral %",
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);

  const [form, setForm] = useState({
    user_id: 0,
    company_name: "",
    company_description: "",
    website_url: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    contact_email: "",
    commission_type: "percent_of_bill",
    commission_rate: 10,
    default_voucher_duration_hours: 2,
    is_active: true,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/v1/admin/partners?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPartners(data.data || []);
      }
    } catch {
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (q: string) => {
    setUserSearch(q);
    if (q.length < 2) { setUserResults([]); return; }
    try {
      const res = await fetch(`/api/v1/admin/users?search=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserResults((data.data || []).slice(0, 10));
      }
    } catch {}
  };

  const openCreateModal = () => {
    setEditingPartner(null);
    setForm({
      user_id: 0, company_name: "", company_description: "", website_url: "",
      address: "", city: "", country: "", phone: "", contact_email: "",
      commission_type: "percent_of_bill", commission_rate: 10,
      default_voucher_duration_hours: 2, is_active: true,
    });
    setUserSearch("");
    setUserResults([]);
    setShowModal(true);
  };

  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setForm({
      user_id: partner.user_id,
      company_name: partner.company_name,
      company_description: partner.company_description || "",
      website_url: partner.website_url || "",
      address: partner.address || "",
      city: partner.city || "",
      country: partner.country || "",
      phone: partner.phone || "",
      contact_email: partner.contact_email || "",
      commission_type: partner.commission_type,
      commission_rate: partner.commission_rate,
      default_voucher_duration_hours: partner.default_voucher_duration_hours,
      is_active: partner.is_active,
    });
    setUserSearch(partner.user?.name || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingPartner && !form.user_id) {
      toast.error("Please select a user");
      return;
    }
    if (!form.company_name.trim()) {
      toast.error("Company name is required");
      return;
    }

    setSaving(true);
    try {
      const url = editingPartner
        ? `/api/v1/admin/partners/${editingPartner.id}`
        : "/api/v1/admin/partners";
      const method = editingPartner ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(editingPartner ? "Partner updated" : "Partner created");
        setShowModal(false);
        loadPartners();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm("Deactivate this partner?")) return;
    try {
      const res = await fetch(`/api/v1/admin/partners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Partner deactivated");
        loadPartners();
      }
    } catch {
      toast.error("Failed to deactivate");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Partner Management</h1>
          <p className="text-lg opacity-90">Manage business partners, commissions, and tracking</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadPartners()}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" /> Add Partner
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : partners.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No partners yet</h3>
              <p className="text-muted-foreground mb-4">Add your first business partner to start tracking commissions.</p>
              <Button onClick={openCreateModal}><Plus className="mr-2 h-4 w-4" /> Add Partner</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {partners.map((p) => (
              <Card key={p.id} className={!p.is_active ? "opacity-60" : ""}>
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {p.company_name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{p.company_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {p.user?.name} ({p.user?.email})
                        </p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="font-medium text-primary">
                            {COMMISSION_LABELS[p.commission_type]}: {p.commission_rate}
                            {p.commission_type === "fixed_per_client" ? " EUR" : "%"}
                          </span>
                          {!p.is_active && (
                            <span className="text-destructive font-semibold">INACTIVE</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <MousePointerClick className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="font-semibold">{p.clicks_count || 0}</span>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                      </div>
                      <div className="text-center">
                        <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="font-semibold">{p.vouchers_count || 0}</span>
                        <p className="text-xs text-muted-foreground">Vouchers</p>
                      </div>
                      <div className="text-center">
                        <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="font-semibold">€{Number(p.total_commission || 0).toFixed(2)}</span>
                        <p className="text-xs text-muted-foreground">Commission</p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(p)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {p.is_active && (
                          <Button variant="outline" size="sm" onClick={() => handleDeactivate(p.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-background rounded-lg max-w-2xl w-full p-6 border my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingPartner ? "Edit Partner" : "Add New Partner"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {!editingPartner && (
                <div>
                  <label className="block text-sm font-medium mb-1">Select User *</label>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => searchUsers(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                  {userResults.length > 0 && (
                    <div className="border rounded-lg mt-1 max-h-40 overflow-y-auto bg-background">
                      {userResults.map((u: any) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setForm({ ...form, user_id: u.id, contact_email: u.email });
                            setUserSearch(u.name + " (" + u.email + ")");
                            setUserResults([]);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-muted transition text-sm"
                        >
                          {u.name} — {u.email}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name *</label>
                  <input type="text" value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website URL</label>
                  <input type="url" value={form.website_url}
                    onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email</label>
                  <input type="email" value={form.contact_email}
                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input type="text" value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.company_description}
                  onChange={(e) => setForm({ ...form, company_description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background h-20" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input type="text" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">Commission Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Commission Type *</label>
                    <select value={form.commission_type}
                      onChange={(e) => setForm({ ...form, commission_type: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg bg-background">
                      <option value="percent_of_bill">% of bill (physical)</option>
                      <option value="fixed_per_client">Fixed EUR per client</option>
                      <option value="digital_referral_percent">Digital referral %</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rate {form.commission_type === "fixed_per_client" ? "(EUR)" : "(%)"}
                    </label>
                    <input type="number" value={form.commission_rate} step="0.01" min="0"
                      onChange={(e) => setForm({ ...form, commission_rate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border rounded-lg bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Voucher Duration (hours)</label>
                    <input type="number" value={form.default_voucher_duration_hours} min="1" max="720"
                      onChange={(e) => setForm({ ...form, default_voucher_duration_hours: parseInt(e.target.value) || 2 })}
                      className="w-full px-4 py-2 border rounded-lg bg-background" />
                  </div>
                </div>
              </div>

              {editingPartner && (
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <input type="checkbox" checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-5 h-5 rounded" />
                  <span className="font-medium">Active</span>
                </label>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingPartner ? "Save Changes" : "Create Partner"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
