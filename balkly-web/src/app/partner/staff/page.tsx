"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Loader2, X, Users } from "lucide-react";
import { toast } from "@/lib/toast";

export default function PartnerStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" });

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/partner/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStaff(data.staff || []);
      }
    } catch {} finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", email: "", password: "", role: "staff" });
    setShowModal(true);
  };

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ name: s.user?.name || "", email: s.user?.email || "", password: "", role: s.role });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/v1/partner/staff/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: form.name, role: form.role }),
        });
        if (res.ok) { toast.success("Staff updated"); setShowModal(false); loadStaff(); }
        else { const d = await res.json(); toast.error(d.message || "Failed"); }
      } else {
        if (!form.name || !form.email || !form.password) {
          toast.error("All fields required"); setSaving(false); return;
        }
        const res = await fetch("/api/v1/partner/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (res.ok) { toast.success("Staff created"); setShowModal(false); loadStaff(); }
        else { const d = await res.json(); toast.error(d.message || d.errors?.email?.[0] || "Failed"); }
      }
    } catch { toast.error("Network error"); } finally { setSaving(false); }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm("Deactivate this staff member?")) return;
    try {
      await fetch(`/api/v1/partner/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Staff deactivated");
      loadStaff();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage staff accounts for voucher scanning</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Staff</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : staff.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No staff members</h3>
            <p className="text-muted-foreground mb-4">Add staff to let them scan and redeem vouchers.</p>
            <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Staff</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {staff.map((s) => (
            <Card key={s.id} className={!s.is_active ? "opacity-50" : ""}>
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {s.user?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold">{s.user?.name}</p>
                    <p className="text-sm text-muted-foreground">{s.user?.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    s.role === "owner" ? "bg-amber-100 text-amber-800" :
                    s.role === "manager" ? "bg-purple-100 text-purple-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {s.role}
                  </span>
                  {!s.is_active && <span className="text-xs text-destructive font-semibold">INACTIVE</span>}
                </div>
                <div className="flex gap-2">
                  {s.role !== "owner" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => openEdit(s)}><Edit className="h-4 w-4" /></Button>
                      {s.is_active && (
                        <Button variant="outline" size="sm" onClick={() => handleDeactivate(s.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6 border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingId ? "Edit Staff" : "Add Staff"}</h2>
              <button onClick={() => setShowModal(false)}><X className="h-6 w-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>
              {!editingId && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input type="email" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password *</label>
                    <input type="password" value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg bg-background" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background">
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
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
