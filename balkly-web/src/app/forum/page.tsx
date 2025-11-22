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
    const loadData = async () => {
      try {
        const response = await forumAPI.getCategories();
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
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
    loadData();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Community Forum</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Diskusije, pitanja i zajednica</p>
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

      <div className="w-full px-4 py-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 sticky top-20">
                <CardContent className="p-0">
                  <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 uppercase text-xs tracking-wider">Forum Categories</h3>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedCategory === null ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-balkly-blue' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MessageCircle className="h-5 w-5 text-balkly-blue" />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 dark:text-gray-100 uppercase text-sm">All Discussions</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{topics.length} topics</p>
                        </div>
                      </div>
                    </button>

                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-white dark:bg-gray-800">
                        <div className="px-4 pt-4 pb-2 bg-gray-50/50 dark:bg-gray-700/50">
                          <button
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`w-full text-left p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors ${
                              selectedCategory === cat.id ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-balkly-blue' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 text-2xl">
                                {cat.icon || '📁'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 dark:text-gray-100 uppercase text-sm tracking-wide">{cat.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{cat.description}</p>
                              </div>
                            </div>
                          </button>
                        </div>
                        
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="px-4 pb-3 space-y-1">
                            {cat.subcategories.map((subcat: any) => (
                              <button
                                key={subcat.id}
                                onClick={() => setSelectedCategory(subcat.id)}
                                className={`w-full text-left pl-10 pr-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                  selectedCategory === subcat.id ? 'bg-purple-50 dark:bg-purple-900/30 ring-2 ring-iris-purple' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-iris-purple"></div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{subcat.name}</p>
                                    {subcat.description && (
                                      <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{subcat.description}</p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

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
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-0">
                    <div className="divide-y dark:divide-gray-700">
                      {topics.map((topic) => (
                        <Link
                          key={topic.id}
                          href={`/forum/topics/${topic.id}`}
                          className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="p-5">
                            <div className="flex gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-balkly-blue to-teal-glow flex items-center justify-center text-white font-bold text-lg">
                                  {topic.user?.name?.[0]?.toUpperCase()}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      {topic.is_sticky && (
                                        <Pin className="h-4 w-4 text-iris-purple" />
                                      )}
                                      <h3 className="font-bold text-gray-900 dark:text-gray-100 hover:text-balkly-blue transition-colors">
                                        {topic.title}
                                      </h3>
                                      {topic.is_sticky && (
                                        <span className="px-2 py-0.5 bg-iris-purple text-white text-xs rounded-full font-medium">
                                          STICKY
                                        </span>
                                      )}
                                      {topic.category && (
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                          {topic.category.name}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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

                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
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
    </div>
  );
}
