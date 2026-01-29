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
  BookOpen,
  ChevronRight,
  FileText,
  HelpCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  views_count: number;
  video_url?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    icon: string;
  };
}

export default function KnowledgeBaseArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [params.slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/kb/${params.slug}`);
      const data = await response.json();
      if (data.article) {
        setArticle(data.article);
        setRelated(data.related || []);
      }
    } catch (error) {
      console.error("Failed to load article:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (isHelpful: boolean) => {
    if (!article) return;
    setFeedbackSubmitting(true);
    try {
      await fetch(`/api/v1/kb/${article.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_helpful: isHelpful }),
      });
      setFeedback(isHelpful);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-[#1a2332] border-gray-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
            <p className="text-gray-400 mb-6">
              This knowledge base article doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => router.push("/knowledge-base")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Breadcrumb Header */}
      <div className="border-b border-gray-800 bg-[#0B1120]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/knowledge-base" className="hover:text-cyan-400 transition-colors">
              Knowledge Base
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-600" />
            {article.category && (
              <>
                <span className="text-gray-400">
                  {article.category.name}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </>
            )}
            <span className="text-white truncate max-w-[200px] md:max-w-none">
              {article.title}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a2332] border-gray-800">
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Eye className="h-4 w-4" />
                  {article.views_count || 0} views
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {/* Markdown Content with Dark Theme */}
                <div className="prose prose-invert max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-8
                  prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-cyan-400
                  prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-gray-200
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300
                  prose-strong:text-white prose-strong:font-semibold
                  prose-code:text-cyan-300 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg
                  prose-ul:text-gray-300 prose-ul:space-y-1
                  prose-ol:text-gray-300 prose-ol:space-y-1
                  prose-li:text-gray-300
                  prose-blockquote:border-l-cyan-500 prose-blockquote:bg-cyan-500/5 prose-blockquote:text-gray-400 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                  prose-table:border-gray-700
                  prose-th:bg-gray-800 prose-th:text-white prose-th:font-semibold prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-gray-700
                  prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-700 prose-td:text-gray-300
                  prose-hr:border-gray-700
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.content}
                  </ReactMarkdown>
                </div>

                {/* Video if available */}
                {article.video_url && (
                  <div className="mt-8 pt-8 border-t border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      📹 Video Tutorial
                    </h3>
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
                      <iframe
                        src={article.video_url}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                <div className="mt-10 pt-8 border-t border-gray-700">
                  <Card className="bg-[#0B1120] border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-white text-lg mb-4">
                        Was this article helpful?
                      </h3>
                      {feedback === null ? (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={() => submitFeedback(true)}
                            disabled={feedbackSubmitting}
                            variant="outline"
                            className="flex-1 bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50"
                          >
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Yes, helpful!
                          </Button>
                          <Button
                            onClick={() => submitFeedback(false)}
                            disabled={feedbackSubmitting}
                            variant="outline"
                            className="flex-1 bg-gray-500/10 border-gray-600 text-gray-400 hover:bg-gray-500/20 hover:border-gray-500"
                          >
                            <ThumbsDown className="mr-2 h-4 w-4" />
                            Not helpful
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Thank you for your feedback!</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Articles */}
            <Card className="bg-[#1a2332] border-gray-800 sticky top-20">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-lg text-white">Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {related.length > 0 ? (
                  <div className="space-y-2">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/knowledge-base/${rel.slug}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        <FileText className="h-4 w-4 text-gray-500 group-hover:text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-300 group-hover:text-white line-clamp-2">
                            {rel.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {rel.views_count || 0} views
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No related articles found
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Link href="/knowledge-base">
                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      All Articles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Still Need Help */}
            <Card className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Still need help?</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Our support team is here to assist you with any questions.
                </p>
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
