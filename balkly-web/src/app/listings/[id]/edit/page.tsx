"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, Upload, ImageIcon, X } from "lucide-react";
import { listingsAPI, categoriesAPI } from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";
import CurrencyConvert from "@/components/CurrencyConvert";
import { toast } from "@/lib/toast";

const API = "/api/v1";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "AED",
    city: "",
    country: "AE",
    attributes: {} as Record<string, any>,
  });
  const [categoryAttributes, setCategoryAttributes] = useState<any[]>([]);

  // Image management
  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)); } catch {}
    }
    loadListing();
  }, [listingId]);

  const loadListing = async () => {
    try {
      const response = await listingsAPI.getOne(listingId);
      const data = response.data.listing;
      setListing(data);
      setExistingMedia(data.media || []);
      setFormData({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        currency: data.currency || "AED",
        city: data.city || "",
        country: data.country || "AE",
        attributes: {},
      });

      if (data.category_id) {
        const attrResponse = await categoriesAPI.getAttributes(data.category_id);
        setCategoryAttributes(attrResponse.data.attributes || []);
        const attrs: Record<string, any> = {};
        data.listing_attributes?.forEach((la: any) => {
          attrs[la.attribute_id] = la.value;
        });
        setFormData(prev => ({ ...prev, attributes: attrs }));
      }
    } catch (error) {
      toast.error("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!confirm("Obriši ovu sliku?")) return;
    setDeletingId(mediaId);
    try {
      const res = await fetch(`${API}/media/${mediaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
        toast.success("Slika obrisana");
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Greška pri brisanju");
      }
    } catch {
      toast.error("Mrežna greška");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = existingMedia.length + newImages.length + files.length;
    if (total > 10) {
      toast.error("Max 10 slika ukupno");
      return;
    }
    setNewImages(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeNewImage = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setNewPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadNewImages = async () => {
    if (newImages.length === 0) return;
    setUploadingImages(true);
    try {
      const fd = new FormData();
      newImages.forEach(f => fd.append("images[]", f));
      const res = await fetch(`${API}/listings/${listingId}/media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setExistingMedia(prev => [...prev, ...(data.media || [])]);
        setNewImages([]);
        setNewPreviews([]);
        toast.success("Slike uploadovane");
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.message || "Greška pri uploadu slika");
      }
    } catch {
      toast.error("Mrežna greška pri uploadu");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let priceValue = 0;
      if (formData.price) {
        const cleaned = formData.price.toString().replaceAll(".", "").replace(",", ".");
        priceValue = parseFloat(cleaned) || 0;
      }

      await listingsAPI.update(listingId, {
        title: formData.title,
        description: formData.description,
        price: priceValue,
        currency: formData.currency,
        city: formData.city || "",
        country: formData.country || "AE",
        attributes: formData.attributes,
      });

      if (newImages.length > 0) await uploadNewImages();

      toast.success("Oglas ažuriran!");
      router.push(`/listings/${listingId}`);
    } catch (error: any) {
      toast.error("Greška: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push(`/listings/${listingId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Nazad na oglas
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Uredi oglas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* ── IMAGES ── */}
            <div>
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Fotografije
              </h3>

              {/* Existing images */}
              {existingMedia.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {existingMedia.map((m, idx) => (
                    <div key={m.id} className="relative group aspect-square">
                      <img
                        src={m.url}
                        alt={`Slika ${idx + 1}`}
                        className="w-full h-full object-contain rounded-lg border bg-muted/30"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                          COVER
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(m.id)}
                        disabled={deletingId === m.id}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        {deletingId === m.id ? (
                          <span className="animate-spin text-[10px]">⟳</span>
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New images to upload */}
              {newPreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {newPreviews.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-dashed border-primary/50 opacity-70" />
                      <span className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={existingMedia.length + newImages.length >= 10}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Dodaj slike
                </Button>
                <span className="text-xs text-muted-foreground">
                  {existingMedia.length + newImages.length}/10 slika
                </span>
              </div>
            </div>

            {/* ── TITLE ── */}
            <div>
              <label className="block text-sm font-medium mb-2">Naslov *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                maxLength={100}
              />
            </div>

            {/* ── DESCRIPTION (rich text) ── */}
            <div>
              <label className="block text-sm font-medium mb-2">Opis *</label>
              <RichTextEditor
                value={formData.description}
                onChange={(html) => setFormData({ ...formData, description: html })}
                placeholder="Opisi oglas — stanje, detalji, kontakt..."
                maxLength={5000}
              />
            </div>

            {/* ── PRICE ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cijena *</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^\d,.]/g, "") })}
                  onBlur={(e) => {
                    const v = e.target.value.replace(/\./g, "").replace(",", ".");
                    const n = parseFloat(v);
                    if (!isNaN(n)) setFormData({ ...formData, price: n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) });
                  }}
                  onFocus={(e) => {
                    const v = e.target.value.replace(/\./g, "").replace(",", ".");
                    const n = parseFloat(v);
                    if (!isNaN(n)) setFormData({ ...formData, price: n.toString() });
                  }}
                  placeholder="0"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Valuta</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="AED">AED د.إ</option>
                  <option value="EUR">EUR €</option>
                </select>
              </div>
            </div>
            <CurrencyConvert price={formData.price} currency={formData.currency} />

            {/* ── LOCATION ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Grad *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Država</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="AE">United Arab Emirates</option>
                  <option value="BA">Bosnia and Herzegovina</option>
                  <option value="HR">Croatia</option>
                  <option value="RS">Serbia</option>
                  <option value="DE">Germany</option>
                  <option value="AT">Austria</option>
                </select>
              </div>
            </div>

            {/* ── ATTRIBUTES ── */}
            {categoryAttributes.length > 0 && (
              <div>
                <h3 className="font-bold text-base mb-4">Detalji artikla</h3>
                <div className="grid grid-cols-2 gap-4">
                  {categoryAttributes.map((attr: any) => (
                    <div key={attr.id}>
                      <label className="block text-sm font-medium mb-2">
                        {attr.name} {attr.is_required && "*"}
                      </label>
                      {attr.type === "select" ? (
                        <select
                          value={formData.attributes[attr.id] || ""}
                          onChange={(e) => setFormData({ ...formData, attributes: { ...formData.attributes, [attr.id]: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        >
                          <option value="">Odaberi...</option>
                          {attr.options_json?.map((o: string) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={attr.type === "number" ? "number" : "text"}
                          value={formData.attributes[attr.id] || ""}
                          onChange={(e) => setFormData({ ...formData, attributes: { ...formData.attributes, [attr.id]: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ACTIONS ── */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1" size="lg">
                <Save className="mr-2 h-5 w-5" />
                {saving ? "Snimam..." : "Spremi izmjene"}
              </Button>
              <Button variant="outline" onClick={() => router.push(`/listings/${listingId}`)} size="lg">
                Odustani
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
