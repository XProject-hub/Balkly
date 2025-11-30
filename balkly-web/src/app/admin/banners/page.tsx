"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit, Trash2, Eye, MousePointerClick } from "lucide-react";

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
      const response = await fetch("/api/v1/admin/banners", {
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
        ? `/api/v1/admin/banners/${editingBanner.id}`
        : "/api/v1/admin/banners";
      
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
      await fetch(`/api/v1/admin/banners/${id}`, {
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
              <p className="text-lg opacity-90">Manage advertising banners</p>
            </div>
            <Button variant="secondary" onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? "Cancel" : "New Banner"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g., Homepage Hero Banner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="homepage_top">Homepage - Top</option>
                      <option value="homepage_sidebar">Homepage - Sidebar</option>
                      <option value="listings_top">Listings - Top</option>
                      <option value="listings_sidebar">Listings - Sidebar</option>
                      <option value="events_top">Events - Top</option>
                      <option value="forum_top">Forum - Top</option>
                    </select>
                  </div>
                </div>

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
                      <span>HTML</span>
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
                      placeholder="<div>Your HTML code here</div>"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Link URL (optional)</label>
                  <input
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://example.com/promotion"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Active</label>
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
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{banner.name}</h3>
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        {banner.position.replace('_', ' ')}
                      </span>
                      {banner.is_active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    
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
                        {banner.impressions.toLocaleString()} impressions
                      </span>
                      <span className="flex items-center">
                        <MousePointerClick className="h-4 w-4 mr-1" />
                        {banner.clicks.toLocaleString()} clicks
                      </span>
                      {banner.clicks > 0 && (
                        <span>
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
          ))}

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

