"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Plus, Pin, Eye, Lock, CheckCircle } from "lucide-react";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* XenForo Style Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Forum</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Community discussions and support</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/forum/new">
                <Plus className="mr-2 h-4 w-4" />
                Post thread
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* XenForo Style Main Layout */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Sidebar - XenForo Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 overflow-hidden sticky top-6">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                <h3 className="font-semibold text-sm uppercase text-gray-700 dark:text-gray-300">Categories</h3>
              </div>
              <div className="divide-y dark:divide-gray-800">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                    !selectedCategory ? 'bg-blue-50 dark:bg-blue-950 text-primary font-medium border-l-2 border-primary' : ''
                  }`}
                >
                  All discussions
                </button>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                        selectedCategory === cat.id ? 'bg-blue-50 dark:bg-blue-950 text-primary border-l-2 border-primary' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                    {cat.subcategories?.map((sub: any) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedCategory(sub.id)}
                        className={`w-full text-left pl-8 pr-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                          selectedCategory === sub.id ? 'bg-blue-50 dark:bg-blue-950 text-primary border-l-2 border-primary' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        → {sub.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - XenForo Thread List */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ) : topics.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-lg p-12 text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No threads yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Be the first to start a discussion</p>
                <Button asChild>
                  <Link href="/forum/new">Create thread</Link>
                </Button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 overflow-hidden">
                {/* XenForo Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  <div className="col-span-6">Thread</div>
                  <div className="col-span-2 text-center">Replies</div>
                  <div className="col-span-2 text-center">Views</div>
                  <div className="col-span-2 text-right">Latest post</div>
                </div>

                {/* XenForo Thread List */}
                <div className="divide-y dark:divide-gray-800">
                  {topics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/forum/topics/${topic.id}`}
                      className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4">
                        {/* Thread Info */}
                        <div className="col-span-12 md:col-span-6 flex gap-3">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm">
                              {topic.user?.name?.[0]?.toUpperCase()}
                            </div>
                          </div>

                          {/* Thread Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {topic.is_sticky && <Pin className="h-4 w-4 text-amber-500 flex-shrink-0" />}
                              {topic.is_locked && <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                              {topic.is_solved && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                              
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary transition truncate">
                                {topic.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-medium">{topic.user?.name}</span>
                              <span>•</span>
                              <span>{formatDate(topic.created_at)}</span>
                              {topic.category && (
                                <>
                                  <span>•</span>
                                  <span className="text-primary">{topic.category.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Replies Count */}
                        <div className="hidden md:flex col-span-2 items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {topic.replies_count || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">replies</div>
                          </div>
                        </div>

                        {/* Views Count */}
                        <div className="hidden md:flex col-span-2 items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {topic.views_count || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">views</div>
                          </div>
                        </div>

                        {/* Latest Post */}
                        <div className="hidden md:flex col-span-2 items-center justify-end">
                          <div className="text-right text-xs">
                            <div className="text-gray-900 dark:text-gray-100 font-medium">
                              {topic.user?.name}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {formatDate(topic.last_post_at || topic.created_at)}
                            </div>
                          </div>
                        </div>

                        {/* Mobile Stats */}
                        <div className="md:hidden col-span-12 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{topic.replies_count || 0} replies</span>
                          <span>•</span>
                          <span>{topic.views_count || 0} views</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
