"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { forumAPI } from "@/lib/api";

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
    setLoading(true);

    try {
      const response = await forumAPI.createTopic(formData);
      const topicId = response.data.topic.id;
      router.push(`/forum/topics/${topicId}`);
    } catch (error) {
      console.error("Failed to create topic:", error);
      alert("Failed to create topic. Please try again.");
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
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
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
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 border rounded-lg h-64"
                  maxLength={10000}
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

