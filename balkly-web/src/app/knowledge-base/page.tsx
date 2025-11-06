"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookOpen, ChevronRight, TrendingUp, Eye } from "lucide-react";

export default function KnowledgeBasePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/v1/kb/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`/api/v1/kb/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.articles || []);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="text-white py-16"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #111827 100%)" }}
      >
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-teal-glow" />
          <h1 className="text-4xl font-bold mb-4">Knowledge Base</h1>
          <p className="text-lg opacity-90 mb-8">
            Find answers, guides, and video tutorials
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-teal-glow text-gray-900 text-lg"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Search Results ({searchResults.length})
            </h2>
            <div className="space-y-4">
              {searchResults.map((article: any) => (
                <Link key={article.id} href={`/knowledge-base/${article.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.content.substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views_count} views
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-balkly-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading articles...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No articles available yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Check back soon for helpful guides and tutorials!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="bg-white hover:shadow-xl transition-all group"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-balkly-blue to-teal-glow flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-900 group-hover:text-balkly-blue transition-colors">
                          {category.name}
                        </CardTitle>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    {category.articles && category.articles.length > 0 ? (
                      <div className="space-y-2">
                        {category.articles.slice(0, 5).map((article: any) => (
                          <Link
                            key={article.id}
                            href={`/knowledge-base/${article.slug}`}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors group/article"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover/article:text-balkly-blue" />
                            <span className="text-sm text-gray-700 group-hover/article:text-balkly-blue flex-1">
                              {article.title}
                            </span>
                          </Link>
                        ))}
                        {category.articles.length > 5 && (
                          <Link
                            href={`/knowledge-base/category/${category.slug}`}
                            className="flex items-center gap-2 p-2 text-balkly-blue hover:bg-blue-50 rounded-lg text-sm font-medium"
                          >
                            View all {category.articles.length} articles →
                          </Link>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No articles yet</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Popular Articles */}
        {!loading && categories.some(cat => cat.articles?.length > 0) && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-balkly-blue" />
              Popular Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories
                .flatMap((cat) => cat.articles || [])
                .sort((a: any, b: any) => (b.views_count || 0) - (a.views_count || 0))
                .slice(0, 6)
                .map((article: any) => (
                  <Link key={article.id} href={`/knowledge-base/${article.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          {article.views_count || 0} views
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
