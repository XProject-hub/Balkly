"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ThumbsUp, ThumbsDown, Eye, Video as VideoIcon } from "lucide-react";

export default function KBArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/kb/${slug}`);
      const data = await response.json();
      setArticle(data.article);
      setRelated(data.related || []);
    } catch (error) {
      console.error("Failed to load article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (helpful: boolean) => {
    try {
      await fetch(`/api/v1/kb/${article.id}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ is_helpful: helpful }),
      });
      setFeedbackGiven(true);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background p-8">Loading...</div>;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Button onClick={() => router.push("/knowledge-base")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Knowledge Base
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/knowledge-base")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Knowledge Base
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                {article.category?.name}
              </p>
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views_count} views
                </span>
                {article.helpful_count + article.not_helpful_count > 0 && (
                  <span>
                    {article.helpful_count} of {article.helpful_count + article.not_helpful_count} found helpful
                  </span>
                )}
              </div>
            </div>

            {/* Video Tutorial */}
            {article.video_url && (
              <Card className="mb-8">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <VideoIcon className="h-5 w-5 text-primary" />
                    <h3 className="font-bold">Video Tutorial</h3>
                    {article.video_duration && (
                      <span className="text-sm text-muted-foreground">
                        ({Math.floor(article.video_duration / 60)} min)
                      </span>
                    )}
                  </div>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <iframe
                      src={article.video_url}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Article Content */}
            <div className="prose max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Feedback */}
            <Card>
              <CardContent className="p-6">
                {!feedbackGiven ? (
                  <div>
                    <h3 className="font-bold mb-4">Was this article helpful?</h3>
                    <div className="flex gap-4">
                      <Button onClick={() => handleFeedback(true)} variant="outline">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Yes, helpful
                      </Button>
                      <Button onClick={() => handleFeedback(false)} variant="outline">
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Not helpful
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-green-600 font-medium">Thank you for your feedback!</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Articles */}
            {related.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-bold">Related Articles</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/knowledge-base/${rel.slug}`}
                      className="block hover:text-primary transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        {rel.video_url && <VideoIcon className="h-4 w-4 mt-1 flex-shrink-0" />}
                        <span className="text-sm">{rel.title}</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

