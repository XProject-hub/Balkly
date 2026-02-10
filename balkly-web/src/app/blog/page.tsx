"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Eye, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [category]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = category ? `?category=${category}` : '';
      const response = await fetch(`/api/v1/blog${params}`);
      const data = await response.json();
      setPosts(data.data || []);
    } catch (error) {
      console.error("Failed to load blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl opacity-90">
            Latest updates, guides, and marketplace tips
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={category === "" ? "default" : "outline"}
            onClick={() => setCategory("")}
          >
            All Posts
          </Button>
          <Button
            variant={category === "news" ? "default" : "outline"}
            onClick={() => setCategory("news")}
          >
            News
          </Button>
          <Button
            variant={category === "tutorial" ? "default" : "outline"}
            onClick={() => setCategory("tutorial")}
          >
            Tutorials
          </Button>
          <Button
            variant={category === "guide" ? "default" : "outline"}
            onClick={() => setCategory("guide")}
          >
            Guides
          </Button>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  {post.featured_image && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium uppercase">
                        {post.category}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {post.author?.name}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views_count}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

