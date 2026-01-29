"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, BookOpen, ChevronRight, TrendingUp, Eye, FileText, HelpCircle, Loader2,
  Rocket, Shield, Package, ShoppingCart, MessageSquare, Ticket, Users, CreditCard,
  Lock, Settings, Home, Star, Zap, Globe, CheckCircle, AlertCircle
} from "lucide-react";

// Map category slugs/icons to Lucide icons
const getCategoryIcon = (slug: string, iconName?: string) => {
  const iconMap: Record<string, any> = {
    'getting-started': Rocket,
    'account-security': Shield,
    'listings-selling': Package,
    'buying-orders': ShoppingCart,
    'messaging-chat': MessageSquare,
    'events-tickets': Ticket,
    'forum-community': Users,
    'payments-billing': CreditCard,
    'trust-safety': Lock,
    // Fallbacks based on common icon names
    'rocket': Rocket,
    'shield': Shield,
    'package': Package,
    'cart': ShoppingCart,
    'message': MessageSquare,
    'ticket': Ticket,
    'users': Users,
    'credit-card': CreditCard,
    'lock': Lock,
    'settings': Settings,
    'home': Home,
    'star': Star,
    'zap': Zap,
    'globe': Globe,
    'check': CheckCircle,
    'alert': AlertCircle,
  };
  
  return iconMap[slug] || iconMap[iconName?.toLowerCase() || ''] || BookOpen;
};

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  views_count: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  articles: Article[];
}

export default function KnowledgeBasePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

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

    setSearching(true);
    try {
      const response = await fetch(`/api/v1/kb/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.articles || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Get all articles sorted by views for popular section
  const popularArticles = categories
    .flatMap((cat) => cat.articles || [])
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-lg shadow-cyan-500/25">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Knowledge Base
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Find answers, guides, and tutorials to help you get the most out of Balkly
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-4 h-14 bg-[#1a2332] border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20 text-lg"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Search className="h-6 w-6 text-cyan-400" />
                Search Results
                <span className="text-sm font-normal text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                  {searchResults.length} found
                </span>
              </h2>
              <button
                onClick={clearSearch}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                Clear search
              </button>
            </div>
            <div className="grid gap-4">
              {searchResults.map((article) => (
                <Link key={article.id} href={`/knowledge-base/${article.slug}`}>
                  <Card className="bg-[#1a2332] border-gray-800 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/5">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-white mb-2 group-hover:text-cyan-400">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {article.content?.replace(/[#*`\n]/g, ' ').substring(0, 200)}...
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views_count || 0} views
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {!searchResults.length && (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Browse by Category
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-cyan-500 mx-auto mb-4" />
                    <p className="text-gray-400">Loading articles...</p>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No articles available yet</h3>
                  <p className="text-gray-500">
                    Check back soon for helpful guides and tutorials!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => {
                    const CategoryIcon = getCategoryIcon(category.slug, category.icon);
                    return (
                    <Card
                      key={category.id}
                      className="bg-[#1a2332] border-gray-800 hover:border-gray-700 transition-all group"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                            <CategoryIcon className="h-6 w-6 text-cyan-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg group-hover:text-cyan-400 transition-colors">
                              {category.name}
                            </CardTitle>
                            <p className="text-xs text-gray-500">
                              {category.articles?.length || 0} articles
                            </p>
                          </div>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        {category.articles && category.articles.length > 0 ? (
                          <div className="space-y-1">
                            {category.articles.slice(0, 4).map((article) => (
                              <Link
                                key={article.id}
                                href={`/knowledge-base/${article.slug}`}
                                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-white/5 transition-colors group/article"
                              >
                                <ChevronRight className="h-4 w-4 text-gray-600 group-hover/article:text-cyan-400 transition-colors" />
                                <span className="text-sm text-gray-300 group-hover/article:text-white transition-colors flex-1 truncate">
                                  {article.title}
                                </span>
                              </Link>
                            ))}
                            {category.articles.length > 4 && (
                              <Link
                                href={`/knowledge-base?category=${category.slug}`}
                                className="flex items-center gap-2 p-2.5 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                              >
                                View all {category.articles.length} articles →
                              </Link>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 italic py-2">
                            No articles in this category yet
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                  })}
                </div>
              )}
            </div>

            {/* Popular Articles */}
            {popularArticles.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                  Popular Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularArticles.map((article) => (
                    <Link key={article.id} href={`/knowledge-base/${article.slug}`}>
                      <Card className="bg-[#1a2332] border-gray-800 hover:border-orange-500/30 transition-all h-full hover:shadow-lg hover:shadow-orange-500/5">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-orange-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Eye className="h-3 w-3" />
                              {article.views_count || 0} views
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Still Need Help */}
            <div className="mt-16">
              <Card className="bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 border-cyan-500/20">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Still need help?
                      </h3>
                      <p className="text-gray-400">
                        Can't find what you're looking for? Our support team is here to assist you.
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
                    >
                      Contact Support
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
