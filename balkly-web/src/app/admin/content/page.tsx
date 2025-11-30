"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, FileText, BookOpen } from "lucide-react";

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"blog" | "kb">("blog");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "news",
    video_url: "",
    featured_image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = activeTab === "blog" ? "/api/v1/admin/blog" : "/api/v1/admin/kb/articles";
    
    try {
      await fetch(url, {
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
      
      alert(`${activeTab === "blog" ? "Blog post" : "KB article"} created!`);
      setShowForm(false);
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "news",
        video_url: "",
        featured_image: "",
      });
    } catch (error) {
      alert("Failed to create content");
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
          <h1 className="text-4xl font-bold mb-2">Content Management</h1>
          <p className="text-lg opacity-90">Manage blog posts and knowledge base articles</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "blog" ? "default" : "outline"}
            onClick={() => setActiveTab("blog")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Blog Posts
          </Button>
          <Button
            variant={activeTab === "kb" ? "default" : "outline"}
            onClick={() => setActiveTab("kb")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Knowledge Base
          </Button>
        </div>

        {/* Create Button */}
        <Button onClick={() => setShowForm(!showForm)} className="mb-6">
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : `New ${activeTab === "blog" ? "Post" : "Article"}`}
        </Button>

        {/* Creation Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                Create New {activeTab === "blog" ? "Blog Post" : "KB Article"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="content-title" className="block text-sm font-medium mb-2">Title</label>
                  <input
                    id="content-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter title..."
                  />
                </div>

                {activeTab === "blog" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Excerpt</label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg h-20"
                        placeholder="Short excerpt..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="news">News</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="guide">Guide</option>
                        <option value="update">Update</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                      <input
                        type="url"
                        value={formData.featured_image}
                        onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </>
                )}

                {activeTab === "kb" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Video Tutorial URL (YouTube/Vimeo)</label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use embed URL format
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg h-64 font-mono text-sm"
                    placeholder="Write your content here (HTML supported)..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Publish {activeTab === "blog" ? "Post" : "Article"}
                </Button>
              </form>
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

