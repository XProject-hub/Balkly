"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { forumAPI } from "@/lib/api";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function NewTopicPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await forumAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_id) {
      alert("Please select a category!");
      return;
    }
    
    if (!formData.title.trim()) {
      alert("Please enter a title!");
      return;
    }
    
    if (!formData.content.trim()) {
      alert("Please enter content!");
      return;
    }

    setLoading(true);

    try {
      console.log("Creating topic with data:", formData);
      console.log("Category ID being sent:", formData.category_id);
      
      const response = await forumAPI.createTopic(formData);
      console.log("Topic created:", response.data);
      const topicId = response.data.topic.id;
      router.push(`/forum/topics/${topicId}`);
    } catch (error: any) {
      console.error("Failed to create topic:", error);
      console.error("Error response:", error.response?.data);
      
      // Show validation errors
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        alert("Validation errors:\n" + errors.join("\n"));
      } else {
        const errorMsg = error.response?.data?.message || "Failed to create topic. Please try again.";
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/forum")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Start a New Discussion</CardTitle>
            <p className="text-muted-foreground">
              Share your thoughts, ask questions, or start a conversation
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <optgroup key={cat.id} label={cat.name}>
                      <option value={cat.id}>
                        {cat.name}
                      </option>
                      {cat.subcategories && cat.subcategories.map((subCat: any) => (
                        <option key={subCat.id} value={subCat.id}>
                          &nbsp;&nbsp;└─ {subCat.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  maxLength={200}
                  placeholder="What's your topic about?"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.title.length}/200 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your message... (Markdown supported)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.content.length}/10,000 characters
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading || !formData.category_id || !formData.title || !formData.content}
                  className="flex-1"
                >
                  {loading ? "Creating..." : "Post Topic"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/forum")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

