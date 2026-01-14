"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit, Trash2, Eye, MousePointerClick, Info } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Banner position configurations with exact dimensions
const BANNER_POSITIONS = {
  homepage_top: {
    label: "Homepage - Top (After Categories)",
    description: "Horizontal banner below categories section",
    width: "1200px (max)",
    height: "128px (max)",
    recommended: "1200 x 120 px",
    format: "Horizontal",
  },
  homepage_middle: {
    label: "Homepage - Middle (Between Events & Forum)",
    description: "Horizontal banner between Events and Trending sections",
    width: "1280px (max)",
    height: "160px (max)",
    recommended: "1280 x 150 px",
    format: "Horizontal",
  },
  homepage_sidebar: {
    label: "Homepage - Sidebar",
    description: "Vertical banner on the right side",
    width: "280px (fixed)",
    height: "400px (max)",
    recommended: "280 x 350 px",
    format: "Vertical",
  },
  listings_top: {
    label: "Listings Page - Top",
    description: "Banner at the top of listings page",
    width: "1200px (max)",
    height: "112px (max)",
    recommended: "1200 x 100 px",
    format: "Horizontal",
  },
  listings_sidebar: {
    label: "Listings Page - Sidebar",
    description: "Sidebar banner on listings page",
    width: "300px (fixed)",
    height: "350px (max)",
    recommended: "300 x 300 px",
    format: "Vertical/Square",
  },
  events_top: {
    label: "Events Page - Top",
    description: "Banner at the top of events page",
    width: "1200px (max)",
    height: "112px (max)",
    recommended: "1200 x 100 px",
    format: "Horizontal",
  },
  forum_top: {
    label: "Forum Page - Top",
    description: "Banner at the top of forum page",
    width: "1200px (max)",
    height: "112px (max)",
    recommended: "1200 x 100 px",
    format: "Horizontal",
  },
  listing_detail: {
    label: "Listing Detail Page",
    description: "Banner on individual listing pages",
    width: "400px (max)",
    height: "192px (max)",
    recommended: "400 x 180 px",
    format: "Horizontal/Square",
  },
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "homepage_top",
    type: "image",
    image_url: "",
    html_content: "",
    link_url: "",
    is_active: true,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/banners`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error("Failed to load banners:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBanner
        ? `${API_URL}/admin/banners/${editingBanner.id}`
        : `${API_URL}/admin/banners`;
      
      const response = await fetch(url, {
        method: editingBanner ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingBanner(null);
        setFormData({
          name: "",
          position: "homepage_top",
          type: "image",
          image_url: "",
          html_content: "",
          link_url: "",
          is_active: true,
        });
        loadBanners();
      }
    } catch (error) {
      console.error("Failed to save banner:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this banner?")) return;

    try {
      await fetch(`${API_URL}/admin/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      loadBanners();
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  };

  const selectedPosition = BANNER_POSITIONS[formData.position as keyof typeof BANNER_POSITIONS];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Ad Banner Management</h1>
              <p className="text-lg opacity-90">Manage advertising banners across the platform</p>
            </div>
            <Button variant="secondary" onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? "Cancel" : "New Banner"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Banner Positions Reference */}
        <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
              <Info className="mr-2 h-5 w-5" />
              Banner Positions & Dimensions Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(BANNER_POSITIONS).map(([key, pos]) => (
                <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                  <h4 className="font-bold text-sm mb-1">{pos.label}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{pos.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Format:</span>
                      <span className="font-medium">{pos.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Width:</span>
                      <span className="font-medium">{pos.width}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Height:</span>
                      <span className="font-medium">{pos.height}</span>
                    </div>
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Recommended:</span>
                      <span className="font-bold">{pos.recommended}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Banner Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingBanner ? "Edit Banner" : "Create New Banner"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Banner Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      placeholder="e.g., Summer Sale Banner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    >
                      {Object.entries(BANNER_POSITIONS).map(([key, pos]) => (
                        <option key={key} value={key}>{pos.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Position Info */}
                {selectedPosition && (
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">
                      📐 Recommended Dimensions for {selectedPosition.label}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Format:</span>
                        <p className="font-bold">{selectedPosition.format}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Width:</span>
                        <p className="font-bold">{selectedPosition.width}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Height:</span>
                        <p className="font-bold">{selectedPosition.height}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Recommended:</span>
                        <p className="font-bold text-green-600 dark:text-green-400">{selectedPosition.recommended}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <span className="block text-sm font-medium mb-2">Banner Type</span>
                  <div className="flex gap-4">
                    <label htmlFor="banner-type-image" className="flex items-center cursor-pointer">
                      <input
                        id="banner-type-image"
                        type="radio"
                        value="image"
                        checked={formData.type === "image"}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mr-2"
                      />
                      <span>Image</span>
                    </label>
                    <label htmlFor="banner-type-html" className="flex items-center cursor-pointer">
                      <input
                        id="banner-type-html"
                        type="radio"
                        value="html"
                        checked={formData.type === "html"}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mr-2"
                      />
                      <span>HTML/Embed</span>
                    </label>
                  </div>
                </div>

                {formData.type === "image" && (
                  <div>
                    <label htmlFor="banner-image-url" className="block text-sm font-medium mb-2">Image URL</label>
                    <input
                      id="banner-image-url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      placeholder="https://example.com/banner.jpg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: JPG, PNG, GIF, WebP. Images will be automatically scaled to fit.
                    </p>
                  </div>
                )}

                {formData.type === "html" && (
                  <div>
                    <label htmlFor="banner-html-content" className="block text-sm font-medium mb-2">HTML Content</label>
                    <textarea
                      id="banner-html-content"
                      value={formData.html_content}
                      onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg h-32 font-mono text-sm dark:bg-gray-800 dark:border-gray-700"
                      placeholder="<div>Your HTML code or embed code here</div>"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can paste Google Ads code, affiliate banners, or custom HTML here.
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="banner-link-url" className="block text-sm font-medium mb-2">Click URL (optional)</label>
                  <input
                    id="banner-link-url"
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    placeholder="https://advertiser-website.com/landing-page"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Where users go when they click the banner. Leave empty for non-clickable banners.
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    id="banner-is-active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="banner-is-active" className="text-sm font-medium cursor-pointer">Active (banner will be displayed)</label>
                </div>

                <Button type="submit" className="w-full">
                  {editingBanner ? "Update Banner" : "Create Banner"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Banners List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Active Banners ({banners.length})</h2>
          
          {banners.map((banner) => {
            const posInfo = BANNER_POSITIONS[banner.position as keyof typeof BANNER_POSITIONS];
            return (
              <Card key={banner.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-lg">{banner.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                          {posInfo?.label || banner.position}
                        </span>
                        {banner.is_active ? (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                            INACTIVE
                          </span>
                        )}
                      </div>
                      
                      {posInfo && (
                        <p className="text-xs text-muted-foreground mb-2">
                          📐 {posInfo.recommended} • {posInfo.format}
                        </p>
                      )}
                      
                      {banner.type === 'image' && banner.image_url && (
                        <div className="my-3">
                          <img
                            src={banner.image_url}
                            alt={banner.name}
                            className="max-h-32 rounded border"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-6 text-sm text-muted-foreground mt-3">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {(banner.impressions || 0).toLocaleString()} impressions
                        </span>
                        <span className="flex items-center">
                          <MousePointerClick className="h-4 w-4 mr-1" />
                          {(banner.clicks || 0).toLocaleString()} clicks
                        </span>
                        {banner.impressions > 0 && banner.clicks > 0 && (
                          <span className="font-medium text-green-600">
                            CTR: {((banner.clicks / banner.impressions) * 100).toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingBanner(banner);
                          setFormData({
                            name: banner.name,
                            position: banner.position,
                            type: banner.type,
                            image_url: banner.image_url || "",
                            html_content: banner.html_content || "",
                            link_url: banner.link_url || "",
                            is_active: banner.is_active,
                          });
                          setShowForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {banners.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No banners created yet</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Banner
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
