"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Plus, Pin, Eye, User, Clock } from "lucide-react";
import { forumAPI } from "@/lib/api";

export default function ForumPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
              <p className="text-gray-600 mt-1">Discussions, questions, and community</p>
            </div>
            <Button className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white" asChild>
              <Link href="/forum/new">
                <Plus className="mr-2 h-4 w-4" />
                New Discussion
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Forum Layout - Flarum Style */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Categories (Flarum Style) */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-20">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-gray-900">Categories</h3>
                </div>
                <div className="divide-y">
                  {/* All Topics */}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedCategory === null ? 'bg-blue-50 border-l-4 border-balkly-blue' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-balkly-blue" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">All Discussions</p>
                        <p className="text-xs text-gray-500">{topics.length} topics</p>
                      </div>
                    </div>
                  </button>

                  {/* Category List with Subcategories */}
                  {categories.filter(cat => !cat.parent_id).map((cat) => (
                    <div key={cat.id}>
                      {/* Parent Category */}
                      <button
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedCategory === cat.id ? 'bg-blue-50 border-l-4 border-balkly-blue' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-glow/10 flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 text-teal-glow" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{cat.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{cat.description}</p>
                          </div>
                        </div>
                      </button>
                      
                      {/* Subcategories */}
                      {categories.filter(sub => sub.parent_id === cat.id).map((subcat) => (
                        <button
                          key={subcat.id}
                          onClick={() => setSelectedCategory(subcat.id)}
                          className={`w-full text-left pl-12 pr-4 py-2 hover:bg-gray-50 transition-colors border-l-2 border-gray-200 ${
                            selectedCategory === subcat.id ? 'bg-blue-50 border-l-4 border-iris-purple' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-iris-purple/50"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">{subcat.name}</p>
                              {subcat.description && (
                                <p className="text-xs text-gray-400 truncate">{subcat.description}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Discussions (Flarum Style) */}
          <div className="lg:col-span-3">
            {loading ? (
              <Card className="bg-white">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : topics.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="py-16 text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No discussions yet</h3>
                  <p className="text-gray-600 mb-6">
                    {selectedCategory 
                      ? "No topics in this category yet" 
                      : "Be the first to start a discussion"}
                  </p>
                  <Button className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white" asChild>
                    <Link href="/forum/new">Start a Discussion</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white">
                <CardContent className="p-0">
                  {/* Discussion List */}
                  <div className="divide-y">
                    {topics.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/forum/topics/${topic.id}`}
                        className="block hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-5">
                          <div className="flex gap-4">
                            {/* User Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-balkly-blue to-teal-glow flex items-center justify-center text-white font-bold text-lg">
                                {topic.user?.name?.[0]?.toUpperCase()}
                              </div>
                            </div>

                            {/* Topic Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  {/* Title with badges */}
                                  <div className="flex items-center gap-2 mb-1">
                                    {topic.is_sticky && (
                                      <Pin className="h-4 w-4 text-iris-purple" />
                                    )}
                                    <h3 className="font-bold text-gray-900 hover:text-balkly-blue transition-colors">
                                      {topic.title}
                                    </h3>
                                    {topic.is_sticky && (
                                      <span className="px-2 py-0.5 bg-iris-purple text-white text-xs rounded-full font-medium">
                                        STICKY
                                      </span>
                                    )}
                                  </div>

                                  {/* Meta Info */}
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {topic.user?.name}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageCircle className="h-3 w-3" />
                                      {topic.replies_count} replies
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Eye className="h-3 w-3" />
                                      {topic.views_count} views
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {new Date(topic.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Preview */}
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {topic.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
