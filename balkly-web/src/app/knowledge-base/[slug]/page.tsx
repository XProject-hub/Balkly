"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Calendar,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function KnowledgeBaseArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  useEffect(() => {
    loadArticle();
  }, [params.slug]);

  const loadArticle = async () => {
    try {
      const response = await fetch(`/api/v1/kb/${params.slug}`);
      const data = await response.json();
      setArticle(data.article);
      setRelated(data.related || []);
    } catch (error) {
      console.error("Failed to load article:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (isHelpful: boolean) => {
    try {
      await fetch(`/api/v1/kb/${article.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_helpful: isHelpful }),
      });
      setFeedback(isHelpful);
      alert("Thank you for your feedback!");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-balkly-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
            <p className="text-gray-600 mb-6">
              This knowledge base article doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/knowledge-base")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/knowledge-base" className="hover:text-balkly-blue">
            Knowledge Base
          </Link>
          <ChevronRight className="h-4 w-4" />
          {article.category && (
            <>
              <Link
                href={`/knowledge-base/category/${article.category.slug}`}
                className="hover:text-balkly-blue"
              >
                {article.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-gray-900">{article.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Eye className="h-4 w-4" />
                  {article.views_count || 0} views
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.content}
                </ReactMarkdown>

                {/* Video if available */}
                {article.video_url && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">📹 Video Tutorial</h3>
                    <div className="aspect-video">
                      <iframe
                        src={article.video_url}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Feedback */}
                <div className="mt-12 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">Was this article helpful?</h3>
                  {feedback === null ? (
                    <div className="flex gap-4">
                      <Button
                        onClick={() => submitFeedback(true)}
                        variant="outline"
                        className="flex-1"
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Yes, helpful!
                      </Button>
                      <Button
                        onClick={() => submitFeedback(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Not helpful
                      </Button>
                    </div>
                  ) : (
                    <p className="text-green-600 font-medium">
                      ✓ Thank you for your feedback!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Related Articles */}
          <div>
            <Card className="bg-white sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Related Articles</CardTitle>
              </CardHeader>
              <CardContent>
                {related.length > 0 ? (
                  <div className="space-y-3">
                    {related.map((rel: any) => (
                      <Link
                        key={rel.id}
                        href={`/knowledge-base/${rel.slug}`}
                        className="block p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                      >
                        <p className="text-sm font-medium text-gray-900 group-hover:text-balkly-blue line-clamp-2">
                          {rel.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {rel.views_count || 0} views
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No related articles</p>
                )}

                <div className="mt-6 pt-6 border-t">
                  <Link href="/knowledge-base">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      All Articles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Still Need Help */}
            <Card className="bg-gradient-to-br from-balkly-blue to-iris-purple text-white mt-6">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Still need help?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Our support team is here to assist you
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push("/contact")}
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
