"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Plus, Search, Edit, Trash2, Users, MousePointerClick,
  Euro, X, Loader2, ExternalLink, AlertCircle, BarChart2, Upload, ImageIcon,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface Partner {
  id: number;
  user_id: number;
  company_name: string;
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
  default_voucher_duration_days?: number;
  tracking_code: string;
  is_active: boolean;
  user?: { id: number; name: string; email: string };
  vouchers_count?: number;
  clicks_count?: number;
  conversions_count?: number;
  total_commission?: number;
}

const COMMISSION_LABELS: Record<string, string> = {
  percent_of_bill:           "% od računa (fizički)",
  fixed_per_client:          "Fiksno EUR/klijent",
  digital_referral_percent:  "Digitalni referral %",
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

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
    default_voucher_duration_days: 0,
    default_voucher_duration_hours: 2,
    is_active: true,
  });

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => { loadPartners(); }, []);

  const loadPartners = async (q = search) => {
    setLoading(true);
    setLoadError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      const res = await fetch(`/api/v1/admin/partners?${params}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setPartners(data.data || []);
    } catch (e: any) {
      setLoadError(e.message || "Failed to load partners");
      toast.error("Failed to load partners: " + (e.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (q: string) => {
    setUserSearch(q);
    if (q.length < 2) { setUserResults([]); return; }
    try {
      const res = await fetch(`/api/v1/admin/users?search=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setUserResults((data.data || []).slice(0, 8));
      }
    } catch {}
  };

  const openCreateModal = () => {
    setEditingPartner(null);
    setSelectedUser(null);
    setForm({
      user_id: 0, company_name: "", company_description: "", website_url: "",
      address: "", city: "", country: "", phone: "", contact_email: "",
      commission_type: "percent_of_bill", commission_rate: 10,
      default_voucher_duration_days: 0, default_voucher_duration_hours: 2, is_active: true,
    });
    setUserSearch("");
    setUserResults([]);
    setShowModal(true);
  };

  const openEditModal = (p: Partner) => {
    setEditingPartner(p);
    setSelectedUser(p.user || null);
    setForm({
      user_id: p.user_id,
      company_name: p.company_name,
      company_description: p.company_description || "",
      website_url: p.website_url || "",
      address: p.address || "",
      city: p.city || "",
      country: p.country || "",
      phone: p.phone || "",
      contact_email: p.contact_email || "",
      commission_type: p.commission_type,
      commission_rate: p.commission_rate,
      default_voucher_duration_days: p.default_voucher_duration_days || 0,
      default_voucher_duration_hours: p.default_voucher_duration_hours || 0,
      is_active: p.is_active,
    });
    setUserSearch(p.user ? `${p.user.name} (${p.user.email})` : "");
    setShowModal(true);
  };

  const uploadLogoForPartner = async (partnerId: number) => {
    if (!logoFile) return;
    setLogoUploading(true);
    try {
      const fd = new FormData();
      fd.append("logo", logoFile);
      const res = await fetch(`/api/v1/admin/partners/${partnerId}/logo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: fd,
      });
      if (!res.ok) toast.error("Logo nije uploadovan");
    } catch { toast.error("Greska pri uploadu loga"); }
    finally { setLogoUploading(false); }
  };

  const handleSave = async () => {
    if (!editingPartner && !form.user_id) {
      toast.error("Odaberi korisnika");
      return;
    }
    if (!form.company_name.trim()) {
      toast.error("Naziv kompanije je obavezan");
      return;
    }

    setSaving(true);
    try {
      const url = editingPartner
        ? `/api/v1/admin/partners/${editingPartner.id}`
        : "/api/v1/admin/partners";

      const res = await fetch(url, {
        method: editingPartner ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingPartner ? "Partner ažuriran" : "Partner dodan");
        setShowModal(false);
        loadPartners("");
      } else {
        toast.error(data.message || `Greška: ${res.status}`);
      }
    } catch (e: any) {
      toast.error("Mrežna greška: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm("Deaktiviraj ovog partnera?")) return;
    try {
      const res = await fetch(`/api/v1/admin/partners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      });
      if (res.ok) {
        toast.success("Partner deaktiviran");
        loadPartners();
      } else {
        const d = await res.json();
        toast.error(d.message || "Greška");
      }
    } catch {
      toast.error("Mrežna greška");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-3">
              <ArrowLeft className="mr-2 h-4 w-4" /> Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Partner Management</h1>
          <p className="opacity-90 mt-1">Upravljaj partnerima, komisionima i praćenjem</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Actions bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pretraži partnere..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadPartners(search)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
              />
            </div>
            <Button variant="outline" onClick={() => loadPartners(search)}>Traži</Button>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" /> Dodaj Partnera
          </Button>
        </div>

        {/* Error */}
        {loadError && (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/10 mb-6">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">Greška pri učitavanju</p>
              <p className="text-sm text-destructive/80">{loadError}</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => loadPartners()}>
              Pokušaj ponovo
            </Button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : partners.length === 0 && !loadError ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="h-14 w-14 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="text-lg font-semibold mb-2">Nema partnera</h3>
              <p className="text-muted-foreground mb-6">
                Dodaj prvog poslovnog partnera da počneš pratiti komisione.
              </p>
              <Button onClick={openCreateModal}>
                <Plus className="mr-2 h-4 w-4" /> Dodaj Partnera
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {partners.map((p) => (
              <Card key={p.id} className={!p.is_active ? "opacity-60 border-dashed" : ""}>
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {p.company_name[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{p.company_name}</h3>
                          {!p.is_active && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">
                              NEAKTIVAN
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {p.user?.name} — {p.user?.email}
                        </p>
                        <p className="text-xs text-primary font-medium mt-0.5">
                          {COMMISSION_LABELS[p.commission_type] || p.commission_type}:{" "}
                          <strong>
                            {p.commission_rate}
                            {p.commission_type === "fixed_per_client" ? " EUR" : "%"}
                          </strong>
                          {p.city && ` • ${p.city}`}
                        </p>
                      </div>
                    </div>

                    {/* Right: stats + actions */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex gap-5 text-sm">
                        <div className="text-center">
                          <MousePointerClick className="h-4 w-4 mx-auto mb-0.5 text-muted-foreground" />
                          <span className="font-bold">{p.clicks_count ?? 0}</span>
                          <p className="text-xs text-muted-foreground">Klikovi</p>
                        </div>
                        <div className="text-center">
                          <Users className="h-4 w-4 mx-auto mb-0.5 text-muted-foreground" />
                          <span className="font-bold">{p.vouchers_count ?? 0}</span>
                          <p className="text-xs text-muted-foreground">Voucheri</p>
                        </div>
                        <div className="text-center">
                          <Euro className="h-4 w-4 mx-auto mb-0.5 text-green-600" />
                          <span className="font-bold text-green-600">
                            €{Number(p.total_commission ?? 0).toFixed(2)}
                          </span>
                          <p className="text-xs text-muted-foreground">Komisija</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/admin/partners/${p.id}`}>
                          <Button variant="outline" size="sm" title="Detalji">
                            <BarChart2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(p)} title="Uredi">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {p.is_active && (
                          <Button variant="outline" size="sm" onClick={() => handleDeactivate(p.id)} title="Deaktiviraj">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-background rounded-xl max-w-2xl w-full p-6 border my-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingPartner ? "Uredi Partnera" : "Dodaj Novog Partnera"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Logo partnera</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted/30 shrink-0 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => logoInputRef.current?.click()}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground/50 mb-1" />
                        <p className="text-[10px] text-muted-foreground">Klikni</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setLogoFile(f);
                          setLogoPreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} className="gap-2 mb-1">
                      <Upload className="h-3.5 w-3.5" /> Odaberi logo
                    </Button>
                    {logoFile && <p className="text-xs text-green-600 mt-1">âœ“ {logoFile.name}</p>}
                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP, SVG â€“ max 5MB</p>
                  </div>
                </div>
              </div>

              {/* User search (only on create) */}
              {!editingPartner && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Odaberi korisnika *
                  </label>
                  <input
                    type="text"
                    placeholder="Pretraži po imenu ili emailu..."
                    value={userSearch}
                    onChange={(e) => searchUsers(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                  {userResults.length > 0 && (
                    <div className="border rounded-lg mt-1 max-h-40 overflow-y-auto bg-background shadow-lg">
                      {userResults.map((u: any) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setForm({ ...form, user_id: u.id, contact_email: u.email });
                            setSelectedUser(u);
                            setUserSearch(`${u.name} (${u.email})`);
                            setUserResults([]);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-muted transition text-sm"
                        >
                          {u.name} — {u.email}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedUser && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Odabran: {selectedUser.name} ({selectedUser.email})
                    </p>
                  )}
                </div>
              )}

              {editingPartner && (
                <div className="p-3 rounded-lg bg-muted text-sm">
                  <span className="font-medium">Korisnik:</span>{" "}
                  {editingPartner.user?.name} ({editingPartner.user?.email})
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Naziv kompanije *</label>
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
                  <label className="block text-sm font-medium mb-1">Kontakt Email</label>
                  <input type="email" value={form.contact_email}
                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <input type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Grad</label>
                  <input type="text" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adresa</label>
                  <input type="text" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Opis</label>
                <textarea value={form.company_description}
                  onChange={(e) => setForm({ ...form, company_description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>

              {/* Commission */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Komisija & trajanje vouchera</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium mb-1">Tip komisije</label>
                    <select value={form.commission_type}
                      onChange={(e) => setForm({ ...form, commission_type: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm">
                      <option value="percent_of_bill">% od računa</option>
                      <option value="fixed_per_client">Fiksno EUR</option>
                      <option value="digital_referral_percent">Digitalni %</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Iznos {form.commission_type === "fixed_per_client" ? "(EUR)" : "(%)"}
                    </label>
                    <input type="number" value={form.commission_rate} step="0.01" min="0"
                      onChange={(e) => setForm({ ...form, commission_rate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Trajanje (dani)</label>
                    <input type="number" value={form.default_voucher_duration_days} min="0" max="365"
                      onChange={(e) => setForm({ ...form, default_voucher_duration_days: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">+ Sati</label>
                    <input type="number" value={form.default_voucher_duration_hours} min="0" max="23"
                      onChange={(e) => setForm({ ...form, default_voucher_duration_hours: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Voucher vrijedi: {form.default_voucher_duration_days}d {form.default_voucher_duration_hours}h
                  {form.default_voucher_duration_days === 0 && form.default_voucher_duration_hours === 0 && " → automatski 2h"}
                </p>
              </div>

              {editingPartner && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-5 h-5 rounded" />
                  <span className="font-medium">Aktivan partner</span>
                </label>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>Odustani</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingPartner ? "Spremi izmjene" : "Dodaj partnera"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
