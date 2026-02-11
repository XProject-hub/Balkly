"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, FileText, BookOpen, Trash2, Edit, Eye, Loader2, Tag, Save } from "lucide-react";
import { toast } from "@/lib/toast";

interface ContentItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  status: string;
  created_at: string;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"blog" | "kb" | "categories">("blog");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [blogPosts, setBlogPosts] = useState<ContentItem[]>([]);
  const [kbArticles, setKbArticles] = useState<ContentItem[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [editingPost, setEditingPost] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",  // Empty - user must select
    video_url: "",
    featured_image: "",
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Load blog posts
      const blogRes = await fetch("/api/v1/blog");
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setBlogPosts(blogData.data || blogData.posts || []);
      }

      // Load blog categories
      const catRes = await fetch("/api/v1/blog/categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        setBlogCategories(catData.categories || catData || []);
        // Don't auto-set category - let user choose
      }

      // Load KB articles
      const kbRes = await fetch("/api/v1/kb/categories");
      if (kbRes.ok) {
        const kbData = await kbRes.json();
        // Flatten articles from categories
        const articles: ContentItem[] = [];
        (kbData.categories || kbData || []).forEach((cat: any) => {
          if (cat.articles) {
            articles.push(...cat.articles);
          }
        });
        setKbArticles(articles);
      }
    } catch (err) {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = activeTab === "blog" ? "/api/v1/admin/blog" : "/api/v1/admin/kb/articles";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          status: "published",
          is_published: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create content");
      }

      toast.success(`${activeTab === "blog" ? "Blog post" : "KB article"} created!`);
      setShowForm(false);
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "news",
        video_url: "",
        featured_image: "",
      });
      loadContent();
    } catch (err) {
      toast.error("Failed to create content");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, type: "blog" | "kb") => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      const url = type === "blog" ? `/api/v1/admin/blog/${id}` : `/api/v1/admin/kb/articles/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("Content deleted");
      loadContent();
    } catch (err) {
      toast.error("Failed to delete content");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/v1/admin/blog/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error("Failed to create category");

      toast.success("Category created!");
      setNewCategory({ name: "", description: "" });
      loadContent();
    } catch (err) {
      toast.error("Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/v1/admin/blog/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          name: editingCategory.name,
          description: editingCategory.description,
        }),
      });

      if (!response.ok) throw new Error("Failed to update category");

      toast.success("Category updated!");
      setEditingCategory(null);
      loadContent();
    } catch (err) {
      toast.error("Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const handleEditPost = (post: ContentItem) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: "",  // Will be loaded
      excerpt: post.excerpt || "",
      category: post.category || "",
      video_url: "",
      featured_image: "",
    });
    setShowForm(true);
    // Fetch full post content
    fetchPostContent(post.id);
  };

  const fetchPostContent = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/blog/${blogPosts.find(p => p.id === id)?.slug}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          content: data.post.content || "",
          featured_image: data.post.featured_image || "",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch post content");
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/v1/admin/blog/${editingPost.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          featured_image: formData.featured_image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      toast.success("Blog post updated!");
      setShowForm(false);
      setEditingPost(null);
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        video_url: "",
        featured_image: "",
      });
      loadContent();
    } catch (err) {
      toast.error("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure? Posts in this category will be uncategorized.")) return;

    try {
      const response = await fetch(`/api/v1/admin/blog/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete category");

      toast.success("Category deleted");
      loadContent();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const currentContent = activeTab === "blog" ? blogPosts : kbArticles;

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
          <h1 className="text-4xl font-bold mb-2">Content Management</h1>
          <p className="text-lg opacity-90">Manage blog posts and knowledge base articles</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={activeTab === "blog" ? "default" : "outline"}
            onClick={() => setActiveTab("blog")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Blog Posts ({blogPosts.length})
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
          >
            <Tag className="mr-2 h-4 w-4" />
            Blog Categories ({blogCategories.length})
          </Button>
          <Button
            variant={activeTab === "kb" ? "default" : "outline"}
            onClick={() => setActiveTab("kb")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Knowledge Base ({kbArticles.length})
          </Button>
        </div>

        {/* Create Button - only for blog and kb */}
        {activeTab !== "categories" && (
          <Button onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingPost(null);
              setFormData({ title: "", content: "", excerpt: "", category: "", video_url: "", featured_image: "" });
            }
          }} className="mb-6">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Cancel" : `New ${activeTab === "blog" ? "Post" : "Article"}`}
          </Button>
        )}

        {/* Creation Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingPost ? "Edit Blog Post" : `Create New ${activeTab === "blog" ? "Blog Post" : "KB Article"}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingPost ? handleUpdatePost : handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="content-title" className="block text-sm font-medium mb-2">Title</label>
                  <input
                    id="content-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                    placeholder="Enter title..."
                  />
                </div>

                {activeTab === "blog" && (
                  <>
                    <div>
                      <label htmlFor="blog-excerpt" className="block text-sm font-medium mb-2">Excerpt</label>
                      <textarea
                        id="blog-excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg h-20 bg-background"
                        placeholder="Short excerpt..."
                      />
                    </div>

                    <div>
                      <label htmlFor="blog-category" className="block text-sm font-medium mb-2">Category</label>
                      <select
                        id="blog-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg bg-background"
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {blogCategories.length === 0 ? (
                          <>
                            <option value="news">News</option>
                            <option value="tutorial">Tutorial</option>
                            <option value="guide">Guide</option>
                            <option value="update">Update</option>
                          </>
                        ) : (
                          blogCategories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>{cat.name}</option>
                          ))
                        )}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        <button type="button" onClick={() => setActiveTab("categories")} className="text-primary hover:underline">
                          Manage categories
                        </button>
                      </p>
                    </div>

                    <div>
                      <label htmlFor="blog-featured-image" className="block text-sm font-medium mb-2">Featured Image URL</label>
                      <input
                        id="blog-featured-image"
                        type="url"
                        value={formData.featured_image}
                        onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg bg-background"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </>
                )}

                {activeTab === "kb" && (
                  <div>
                    <label htmlFor="kb-video-url" className="block text-sm font-medium mb-2">Video Tutorial URL (YouTube/Vimeo)</label>
                    <input
                      id="kb-video-url"
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg bg-background"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use embed URL format
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="content-main" className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    id="content-main"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg h-64 font-mono text-sm bg-background"
                    placeholder="Write your content here (HTML supported)..."
                  />
                </div>

                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : editingPost ? (
                    <Save className="mr-2 h-4 w-4" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {editingPost ? "Update Post" : `Publish ${activeTab === "blog" ? "Post" : "Article"}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Blog Categories Management */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            {/* Create Category Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCategory} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label htmlFor="cat-name" className="block text-sm font-medium mb-2">Category Name</label>
                    <input
                      id="cat-name"
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border rounded-lg bg-background"
                      placeholder="e.g., Tutorials, News, Updates..."
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cat-desc" className="block text-sm font-medium mb-2">Description (optional)</label>
                    <input
                      id="cat-desc"
                      type="text"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg bg-background"
                      placeholder="Short description..."
                    />
                  </div>
                  <Button type="submit" disabled={saving || !newCategory.name.trim()}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Add
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                  </div>
                ) : blogCategories.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No categories yet. Create your first category above.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {blogCategories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-4 border rounded-lg">
                        {editingCategory?.id === cat.id ? (
                          <form onSubmit={handleUpdateCategory} className="flex-1 flex gap-4 items-center">
                            <input
                              type="text"
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              className="flex-1 px-3 py-1 border rounded bg-background"
                            />
                            <input
                              type="text"
                              value={editingCategory.description || ""}
                              onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                              className="flex-1 px-3 py-1 border rounded bg-background"
                              placeholder="Description..."
                            />
                            <Button type="submit" size="sm" disabled={saving}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => setEditingCategory(null)}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <>
                            <div>
                              <h3 className="font-medium flex items-center gap-2">
                                <Tag className="h-4 w-4 text-primary" />
                                {cat.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {cat.description || cat.slug}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingCategory(cat)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(cat.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Existing Content List */}
        {activeTab !== "categories" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {activeTab === "blog" ? "Existing Blog Posts" : "Existing KB Articles"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
              </div>
            ) : currentContent.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No {activeTab === "blog" ? "blog posts" : "KB articles"} yet
              </p>
            ) : (
              <div className="space-y-3">
                {currentContent.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.category && <span className="mr-2">#{item.category}</span>}
                        {item.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={activeTab === "blog" ? `/blog/${item.slug}` : `/knowledge-base/${item.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {activeTab === "blog" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPost(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id, activeTab)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog & News</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share updates, guides, and news with your community
              </p>
              <Button variant="outline" asChild>
                <Link href="/blog">View Public Blog</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create searchable help articles with video tutorials
              </p>
              <Button variant="outline" asChild>
                <Link href="/knowledge-base">View Knowledge Base</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
