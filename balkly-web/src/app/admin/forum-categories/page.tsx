"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit, Trash2, MessageCircle, GripVertical, Save } from "lucide-react";
import { toast } from "@/lib/toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Category Item Component
function SortableCategoryItem({ category, onEdit, onDelete, onRename, editingName, setEditingName }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white border rounded-lg ${isDragging ? 'shadow-2xl' : ''}`}>
      <div className="p-4 flex items-center gap-4">
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-move text-gray-400 hover:text-gray-600">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Category Icon */}
        <div className="w-12 h-12 rounded-full bg-teal-glow/10 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="h-6 w-6 text-teal-glow" />
        </div>

        {/* Category Info - Editable */}
        <div className="flex-1">
          {editingName === category.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={category.name}
                onChange={(e) => onRename(category.id, e.target.value)}
                className="w-full px-3 py-1 border border-balkly-blue rounded-lg font-bold text-gray-900"
                autoFocus
              />
              <input
                type="text"
                value={category.description || ''}
                onChange={(e) => onRename(category.id, category.name, e.target.value)}
                className="w-full px-3 py-1 border rounded-lg text-sm text-gray-600"
                placeholder="Description..."
              />
            </div>
          ) : (
            <>
              <h3 className="font-bold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </>
          )}
          
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
            {!category.parent_id ? (
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                Main Category
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                Subcategory {category.parent_name && `of ${category.parent_name}`}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {editingName === category.id ? (
            <Button
              size="sm"
              variant="default"
              onClick={() => setEditingName(null)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingName(category.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminForumCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingName, setEditingName] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    parent_id: null as number | null,
    is_active: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
          slug: formData.slug || formData.name.toLowerCase().replaceAll(' ', '-'),
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "", slug: "", parent_id: null, is_active: true });
        loadCategories();
        toast.success("Category saved!");
      } else {
        toast.error("Failed to save category");
      }
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category? All topics will be moved to General.")) return;

    try {
      const response = await fetch(`/api/v1/admin/forum/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to delete");
      
      toast.success("Category deleted");
      loadCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);

      // Update order on backend
      try {
        await Promise.all(
          newCategories.map((cat, index) =>
            fetch(`/api/v1/admin/forum/categories/${cat.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
              },
              body: JSON.stringify({ order: index }),
            })
          )
        );
      } catch (error) {
        console.error('Failed to update order:', error);
        loadCategories(); // Reload on error
      }
    }
  };

  const handleRename = async (id: number, newName: string, newDesc?: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === id) {
        return {
          ...cat,
          name: newName,
          description: newDesc !== undefined ? newDesc : cat.description
        };
      }
      return cat;
    });
    setCategories(updatedCategories);

    // Save to backend when user clicks save (not on every keystroke)
  };

  const saveRename = async (id: number) => {
    const category = categories.find(cat => cat.id === id);
    if (!category) return;

    try {
      const response = await fetch(`/api/v1/admin/forum/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
        }),
      });
      
      if (!response.ok) throw new Error("Failed to update");
      
      setEditingName(null);
      toast.success('Category updated!');
    } catch (error) {
      toast.error('Failed to update category');
      loadCategories();
    }
  };

  return (
    <div className="min-h-screen bg-mist-50">
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
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? Number.parseInt(e.target.value, 10) : null })}
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

        {/* Drag & Drop Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-balkly-blue rounded-lg">
          <p className="text-sm text-blue-900 font-medium">💡 Tip: Drag categories to reorder them. Click Edit icon to rename inline!</p>
        </div>

        {/* Categories List - Drag & Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-6">
            {categories.filter(cat => !cat.parent_id).map((category) => (
              <div key={category.id}>
                {/* Main Category - Draggable */}
                <SortableContext
                  items={[category.id]}
                  strategy={verticalListSortingStrategy}
                >
                  <SortableCategoryItem
                    category={category}
                    onEdit={setEditingCategory}
                    onDelete={handleDelete}
                    onRename={handleRename}
                    editingName={editingName}
                    setEditingName={(id: number | null) => {
                      if (id === null && editingName) {
                        saveRename(editingName);
                      }
                      setEditingName(id);
                    }}
                  />
                </SortableContext>

                {/* Subcategories - Also Draggable */}
                {categories.filter(sub => sub.parent_id === category.id).length > 0 && (
                  <div className="ml-12 mt-2 space-y-2">
                    <SortableContext
                      items={categories.filter(sub => sub.parent_id === category.id).map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {categories.filter(sub => sub.parent_id === category.id).map((subcat) => (
                        <div key={subcat.id} className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          <SortableCategoryItem
                            category={{ ...subcat, parent_name: category.name }}
                            onEdit={setEditingCategory}
                            onDelete={handleDelete}
                            onRename={handleRename}
                            editingName={editingName}
                            setEditingName={(id: number | null) => {
                              if (id === null && editingName) {
                                saveRename(editingName);
                              }
                              setEditingName(id);
                            }}
                          />
                        </div>
                      ))}
                    </SortableContext>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}

