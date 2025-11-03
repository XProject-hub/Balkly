"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookOpen, Video, FileText } from "lucide-react";

export default function KnowledgeBasePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
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
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold mb-4 text-center">Knowledge Base</h1>
          <p className="text-xl opacity-90 text-center mb-8">
            Find answers, guides, and video tutorials
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white/95 backdrop-blur-md rounded-lg p-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-transparent"
                />
              </div>
              <Button type="submit" size="lg">Search</Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Search Results ({searchResults.length})</h2>
            <div className="space-y-4">
              {searchResults.map((article) => (
                <Link key={article.id} href={`/knowledge-base/${article.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {article.video_url && (
                          <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3">
                            <Video className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {article.category?.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{cat.name}</CardTitle>
                </div>
                {cat.description && (
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cat.articles?.slice(0, 5).map((article: any) => (
                    <Link
                      key={article.id}
                      href={`/knowledge-base/${article.slug}`}
                      className="block text-sm hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {article.video_url && <Video className="h-3 w-3" />}
                      {article.title}
                    </Link>
                  ))}
                  {cat.articles?.length > 5 && (
                    <p className="text-xs text-muted-foreground pt-2">
                      +{cat.articles.length - 5} more articles
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

