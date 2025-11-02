"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Pin,
  Lock,
  Eye,
  MessageCircle,
  ThumbsUp,
  Flag,
  Star,
} from "lucide-react";
import { forumAPI } from "@/lib/api";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [showStickyModal, setShowStickyModal] = useState(false);

  useEffect(() => {
    if (topicId) {
      loadTopic();
    }
  }, [topicId]);

  const loadTopic = async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getTopic(topicId);
      setTopic(response.data.topic);
    } catch (error) {
      console.error("Failed to load topic:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forumAPI.createPost({
        topic_id: topicId,
        content: reply,
      });
      setReply("");
      loadTopic(); // Reload to show new reply
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  const handleMakeSticky = async (duration: number) => {
    try {
      const response = await fetch(`/api/v1/orders/sticky`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          topic_id: topicId,
          plan_id: duration === 7 ? 6 : 7, // 6 = 7 days, 7 = 30 days
        }),
      });

      const data = await response.json();
      
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error("Failed to purchase sticky:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Button onClick={() => router.push("/forum")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/forum")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>

        {/* Topic Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {topic.is_sticky && (
                    <Pin className="h-5 w-5 text-primary" />
                  )}
                  {topic.is_locked && (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <CardTitle className="text-3xl">{topic.title}</CardTitle>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Posted by {topic.user?.name}</span>
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {topic.views_count} views
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {topic.replies_count} replies
                  </span>
                  <span>{new Date(topic.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {!topic.is_sticky && topic.user_id === JSON.parse(localStorage.getItem("user") || "{}")?.id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowStickyModal(true)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Make Sticky
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{topic.content}</p>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold">Replies ({topic.replies_count})</h2>
          
          {topic.posts?.map((post: any) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {post.user?.name?.[0]?.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{post.user?.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{post.content}</p>
                    </div>
                    <div className="flex gap-4 mt-3">
                      <button className="text-sm text-muted-foreground hover:text-foreground flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Like ({post.likes_count || 0})
                      </button>
                      <button className="text-sm text-muted-foreground hover:text-foreground">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Form */}
        {!topic.is_locked ? (
          <Card>
            <CardHeader>
              <CardTitle>Post a Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReply}>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full px-4 py-3 border rounded-lg h-32 mb-4"
                  required
                />
                <Button type="submit" disabled={!reply.trim()}>
                  Post Reply
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <p>This topic is locked and cannot receive new replies.</p>
            </CardContent>
          </Card>
        )}

        {/* Sticky Payment Modal */}
        {showStickyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Make Topic Sticky</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Keep your topic at the top of the list for increased visibility
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => handleMakeSticky(7)}
                    className="p-6 border-2 rounded-lg hover:border-primary transition-all text-left"
                  >
                    <h3 className="font-bold text-lg mb-2">7 Days</h3>
                    <p className="text-3xl font-bold text-primary mb-2">€2.99</p>
                    <p className="text-sm text-muted-foreground">
                      Stay pinned for one week
                    </p>
                  </button>
                  
                  <button
                    onClick={() => handleMakeSticky(30)}
                    className="p-6 border-2 rounded-lg hover:border-primary transition-all text-left"
                  >
                    <h3 className="font-bold text-lg mb-2">30 Days</h3>
                    <p className="text-3xl font-bold text-primary mb-2">€9.99</p>
                    <p className="text-sm text-muted-foreground">
                      Stay pinned for one month
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                      BEST VALUE
                    </span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowStickyModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

