"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit, Trash2, MessageCircle } from "lucide-react";

export default function AdminForumCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    parent_id: null as number | null,
    is_active: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/v1/forum/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCategory 
        ? `/api/v1/admin/forum/categories/${editingCategory.id}`
        : "/api/v1/admin/forum/categories";
      
      const response = await fetch(url, {
        method: editingCategory ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "", slug: "", parent_id: null, is_active: true });
        loadCategories();
        alert("Category saved!");
      }
    } catch (error) {
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category? All topics will be moved to General.")) return;

    try {
      await fetch(`/api/v1/admin/forum/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      loadCategories();
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-white py-8" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Forum Categories</h1>
              <p className="text-lg opacity-90">Manage discussion categories</p>
            </div>
            <Button variant="secondary" onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? "Cancel" : "New Category"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Category Form */}
        {showForm && (
          <Card className="mb-8 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="e.g., Gaming"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg h-20"
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Parent Category (optional)</label>
                  <select
                    value={formData.parent_id || ""}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">None (Main Category)</option>
                    {categories.filter(cat => !cat.parent_id && (!editingCategory || cat.id !== editingCategory.id)).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select a parent to create a subcategory</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-balkly-blue to-iris-purple text-white">
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Categories List - Hierarchical */}
        <div className="space-y-3">
          {categories.filter(cat => !cat.parent_id).map((category) => (
            <div key={category.id}>
              {/* Parent Category */}
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-glow/10 flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-teal-glow" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {category.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                            Main Category
                          </span>
                        </div>
                      </div>
                    </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCategory(category);
                        setFormData({
                          name: category.name,
                          description: category.description || "",
                          slug: category.slug,
                          parent_id: category.parent_id || null,
                          is_active: category.is_active,
                        });
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Subcategories */}
            {categories.filter(sub => sub.parent_id === category.id).map((subcat) => (
              <Card key={subcat.id} className="bg-gray-50 ml-12 mt-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-iris-purple/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-iris-purple"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{subcat.name}</h3>
                        <p className="text-xs text-gray-500">{subcat.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            subcat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {subcat.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                            Subcategory of {category.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(subcat);
                          setFormData({
                            name: subcat.name,
                            description: subcat.description || "",
                            slug: subcat.slug,
                            parent_id: subcat.parent_id || null,
                            is_active: subcat.is_active,
                          });
                          setShowForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(subcat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

