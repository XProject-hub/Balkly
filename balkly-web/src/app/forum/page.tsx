"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Plus, Pin, Eye, ThumbsUp } from "lucide-react";
import { forumAPI } from "@/lib/api";

export default function ForumPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    loadCategories();
    loadTopics();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await forumAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadTopics = async () => {
    setLoading(true);
    try {
      const params = selectedCategory ? { category_id: selectedCategory } : {};
      const response = await forumAPI.getTopics(params);
      setTopics(response.data.data || []);
    } catch (error) {
      console.error("Failed to load topics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community Forum</h1>
              <p className="text-lg opacity-90">
                Join discussions, ask questions, and connect with the community
              </p>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/forum/new">
                <Plus className="mr-2 h-5 w-5" />
                New Topic
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button
              onClick={() => setSelectedCategory("")}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedCategory === ""
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-2xl mb-2">📌</div>
              <p className="font-medium">All Topics</p>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-2">{cat.icon || "💬"}</div>
                <p className="font-medium text-sm">{cat.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : "Recent Topics"}
            </CardTitle>
            <CardDescription>
              {topics.length} topics • Sorted by latest activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : topics.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No topics found in this category
                </p>
                <Button asChild>
                  <Link href="/forum/new">Start a Discussion</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <Link key={topic.id} href={`/forum/topics/${topic.id}`}>
                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {topic.is_sticky && (
                              <Pin className="h-4 w-4 text-primary" />
                            )}
                            <h3 className="font-bold hover:text-primary transition-colors">
                              {topic.title}
                            </h3>
                            {topic.is_sticky && (
                              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                                STICKY
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {topic.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>by {topic.user?.name}</span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {topic.views_count}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {topic.replies_count}
                            </span>
                            <span>
                              {new Date(topic.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

