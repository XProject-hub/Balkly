"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, Upload, X, ImagePlus } from "lucide-react";
import { listingsAPI, categoriesAPI } from "@/lib/api";
import CurrencyConvert from "@/components/CurrencyConvert";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
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

  useEffect(() => {
    loadListing();
  }, [listingId]);

  const loadListing = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await listingsAPI.getOne(listingId);
      const data = response.data.listing;

      // Check ownership
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.id !== data.user_id && user.role !== "admin") {
          router.push(`/listings/${listingId}`);
          return;
        }
      }

      setListing(data);
      setExistingMedia(data.media || []);
      setFormData({
        title: data.title || "",
        description: data.description || "",
        price: data.price ? Number(data.price).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
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
      console.error("Failed to load listing:", error);
      alert("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const combined = [...newImages, ...files].slice(0, 10 - existingMedia.length);
    setNewImages(combined);

    const previews = combined.map(f => URL.createObjectURL(f));
    setNewImagePreviews(previews);
    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    const updated = newImages.filter((_, i) => i !== index);
    setNewImages(updated);
    setNewImagePreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const deleteExistingMedia = async (mediaId: number) => {
    setDeletingMediaId(mediaId);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/v1/listings/${listingId}/media/${mediaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed");
      setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
    } catch {
      alert("Failed to delete image. Try again.");
    } finally {
      setDeletingMediaId(null);
    }
  };

  const uploadNewImages = async () => {
    if (newImages.length === 0) return;
    setUploadingImages(true);
    try {
      const token = localStorage.getItem("auth_token");
      const imageFormData = new FormData();
      newImages.forEach(file => imageFormData.append("images[]", file));

      const res = await fetch(`/api/v1/listings/${listingId}/media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: imageFormData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setExistingMedia(prev => [...prev, ...(data.media || [])]);
      setNewImages([]);
      setNewImagePreviews([]);
    } catch (err: any) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let priceValue = 0;
      if (formData.price) {
        const cleanedPrice = formData.price.toString().replaceAll(".", "").replace(",", ".");
        priceValue = parseFloat(cleanedPrice) || 0;
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

      if (newImages.length > 0) {
        await uploadNewImages();
      }

      router.push(`/listings/${listingId}`);
    } catch (error: any) {
      console.error("Failed to update listing:", error);
      alert("Failed to update: " + (error.response?.data?.message || error.message));
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

  const totalImages = existingMedia.length + newImages.length;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push(`/listings/${listingId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listing
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Listing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Images */}
            <div>
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <ImagePlus className="h-4 w-4" />
                Photos ({totalImages}/10)
              </h3>

              {/* Existing images */}
              {existingMedia.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {existingMedia.map((media: any) => (
                    <div key={media.id} className="relative group aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={media.url}
                        alt="Listing image"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => deleteExistingMedia(media.id)}
                        disabled={deletingMediaId === media.id}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        {deletingMediaId === media.id ? "..." : <X className="h-3 w-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New image previews */}
              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square bg-muted rounded-lg overflow-hidden border-2 border-dashed border-blue-400">
                      <img
                        src={preview}
                        alt="New image"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 text-xs bg-blue-500 text-white px-1 rounded">New</span>
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {totalImages < 10 && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/heic,image/heif"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-dashed"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {totalImages === 0 ? "Add Photos" : `Add More (${totalImages}/10)`}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 10 photos · JPG, PNG, WebP, HEIC · Max 100MB each
                  </p>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <RichTextEditor
                value={formData.description}
                onChange={(html) => setFormData({ ...formData, description: html })}
                placeholder="Describe what you are selling, condition, details..."
                maxLength={5000}
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price *</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(/[^\d,.]/g, "");
                    setFormData({ ...formData, price: filtered });
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    if (!value) return;
                    value = value.replace(/\./g, "").replace(",", ".");
                    const num = parseFloat(value);
                    if (!Number.isNaN(num)) {
                      setFormData({ ...formData, price: num.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) });
                    }
                  }}
                  onFocus={(e) => {
                    let value = e.target.value;
                    if (!value) return;
                    value = value.replace(/\./g, "").replace(",", ".");
                    const num = parseFloat(value);
                    if (!Number.isNaN(num)) {
                      setFormData({ ...formData, price: num.toString() });
                    }
                  }}
                  placeholder="15000"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
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

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="AE">United Arab Emirates</option>
                  <option value="BA">Bosnia and Herzegovina</option>
                  <option value="HR">Croatia</option>
                  <option value="RS">Serbia</option>
                </select>
              </div>
            </div>

            {/* Attributes */}
            {categoryAttributes.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-4">Item Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {categoryAttributes.map((attr: any) => (
                    <div key={attr.id}>
                      <label className="block text-sm font-medium mb-2">
                        {attr.name} {attr.is_required && "*"}
                      </label>
                      {attr.type === "select" ? (
                        <select
                          value={formData.attributes[attr.id] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attributes: { ...formData.attributes, [attr.id]: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        >
                          <option value="">Select...</option>
                          {attr.options_json?.map((option: string) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={attr.type === "number" ? "number" : "text"}
                          value={formData.attributes[attr.id] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attributes: { ...formData.attributes, [attr.id]: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                disabled={saving || uploadingImages}
                className="flex-1"
                size="lg"
              >
                <Save className="mr-2 h-5 w-5" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/listings/${listingId}`)}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
