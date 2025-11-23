"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { listingsAPI, categoriesAPI } from "@/lib/api";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState<any>(null);
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
      const response = await listingsAPI.getOne(listingId);
      const data = response.data.listing;
      
      setListing(data);
      setFormData({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        currency: data.currency || "AED",
        city: data.city || "",
        country: data.country || "AE",
        attributes: {},
      });

      // Load category attributes
      if (data.category_id) {
        const attrResponse = await categoriesAPI.getAttributes(data.category_id);
        setCategoryAttributes(attrResponse.data.attributes || []);
        
        // Pre-fill attributes
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

  const handleSave = async () => {
    setSaving(true);
    try {
      // Parse price properly: 15.000,00 → 15000.00
      let priceValue = 0;
      if (formData.price) {
        const cleanedPrice = formData.price.toString().replace(/\./g, '').replace(',', '.');
        priceValue = parseFloat(cleanedPrice) || 0;
      }
      
      console.log("Raw price:", formData.price);
      console.log("Parsed price:", priceValue);
      
      await listingsAPI.update(listingId, {
        title: formData.title,
        description: formData.description,
        price: priceValue,
        currency: formData.currency,
        city: formData.city || '',
        country: formData.country || 'AE',
        attributes: formData.attributes,
      });

      alert("Listing updated successfully!");
      router.push(`/listings/${listingId}`);
    } catch (error: any) {
      console.error("Failed to update listing:", error);
      console.error("Error response:", error.response?.data);
      alert("Failed to update listing: " + (error.response?.data?.message || error.message));
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
            <CardTitle className="text-3xl">Edit Listing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg h-32 dark:bg-gray-800 dark:border-gray-700"
                maxLength={2000}
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
                    const value = e.target.value;
                    const filtered = value.replace(/[^\d,.]/g, '');
                    setFormData({ ...formData, price: filtered });
                  }}
                  onBlur={(e) => {
                    // Format on blur
                    let value = e.target.value;
                    if (!value) return;
                    
                    value = value.replace(/\./g, '').replace(',', '.');
                    const num = parseFloat(value);
                    
                    if (!isNaN(num)) {
                      const formatted = num.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                      setFormData({ ...formData, price: formatted });
                    }
                  }}
                  onFocus={(e) => {
                    // Unformat on focus
                    let value = e.target.value;
                    if (!value) return;
                    
                    value = value.replace(/\./g, '').replace(',', '.');
                    const num = parseFloat(value);
                    
                    if (!isNaN(num)) {
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
                              attributes: {
                                ...formData.attributes,
                                [attr.id]: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        >
                          <option value="">Select...</option>
                          {attr.options_json?.map((option: string) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={attr.type === "number" ? "number" : "text"}
                          value={formData.attributes[attr.id] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attributes: {
                                ...formData.attributes,
                                [attr.id]: e.target.value,
                              },
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
                disabled={saving}
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

