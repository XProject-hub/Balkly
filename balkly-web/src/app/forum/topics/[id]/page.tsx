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
  Heart,
  Flag,
  Star,
  Edit,
  MessageSquare,
} from "lucide-react";
import { forumAPI } from "@/lib/api";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [showStickyModal, setShowStickyModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editingTopic, setEditingTopic] = useState(false);
  const [editTopicContent, setEditTopicContent] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== 'undefined' && userData !== 'null') {
      try {
        const parsed = JSON.parse(userData);
        setCurrentUser(parsed);
        console.log("Current user loaded:", parsed.id, parsed.name);
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

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

  const handleReport = async () => {
    const reason = prompt("Razlog prijave:");
    if (!reason) return;

    try {
      await fetch(`/api/v1/forum/topics/${topicId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ reason }),
      });
      alert("Prijava poslana! Moderatori će pregledati u roku 24h.");
    } catch (error) {
      alert("Greška pri slanju prijave.");
    }
  };

  const handleDeleteTopic = async () => {
    if (!confirm("Sigurno želite obrisati ovaj topic?")) return;

    try {
      await fetch(`/api/v1/admin/forum/topics/${topicId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      alert("Topic obrisan!");
      router.push("/forum");
    } catch (error) {
      alert("Greška pri brisanju topica.");
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const response = await fetch(`/api/v1/forum/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update post state immediately
        setTopic((prevTopic: any) => ({
          ...prevTopic,
          posts: prevTopic.posts.map((p: any) => 
            p.id === postId 
              ? { ...p, user_has_liked: data.liked, likes_count: data.likes_count }
              : p
          ),
        }));
        
        // Also reload
        setTimeout(() => loadTopic(), 500);
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleQuotePost = (post: any) => {
    const quotedText = `> ${post.user?.name} said:\n> ${post.content.split('\n').join('\n> ')}\n\n`;
    setReply(quotedText);
    // Scroll to reply form
    document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setEditContent(post.content);
  };

  const handleLikeTopic = async () => {
    try {
      const response = await fetch(`/api/v1/forum/topics/${topicId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      
      console.log("Like response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Like data:", data);
        
        // Update topic state immediately
        setTopic((prevTopic: any) => ({
          ...prevTopic,
          user_has_liked: data.liked,
          likes_count: data.likes_count,
        }));
        
        // Also reload for complete data
        setTimeout(() => loadTopic(), 500);
      } else {
        const error = await response.json();
        console.error("Like failed:", error);
        alert("Failed to like: " + (error.message || response.status));
      }
    } catch (error) {
      console.error("Failed to like topic:", error);
      alert("Like error - check console!");
    }
  };

  const handleEditTopic = () => {
    setEditingTopic(true);
    setEditTopicContent(topic.content);
  };

  const handleSaveTopicEdit = async () => {
    if (!editTopicContent.trim()) return;

    try {
      const response = await fetch(`/api/v1/forum/topics/${topicId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          content: editTopicContent,
        }),
      });
      
      console.log("Edit response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Edit success:", data);
        setEditingTopic(false);
        setEditTopicContent("");
        loadTopic();
        alert("Topic updated successfully!");
      } else {
        const error = await response.json();
        console.error("Edit failed:", error);
        alert("Failed to update: " + (error.message || response.status));
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert("Failed to update topic - check console!");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPost || !editContent.trim()) return;

    try {
      await fetch(`/api/v1/forum/posts/${editingPost.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });
      
      setEditingPost(null);
      setEditContent("");
      loadTopic();
    } catch (error) {
      alert("Failed to update post.");
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Sigurno želite obrisati ovaj post?")) return;

    try {
      await fetch(`/api/v1/admin/forum/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      loadTopic(); // Reload to show changes
      alert("Post obrisan!");
    } catch (error) {
      alert("Greška pri brisanju posta.");
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
                {!topic.is_sticky && topic.user_id === currentUser?.id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowStickyModal(true)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Make Sticky
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleReport}
                  title="Prijavi topic"
                >
                  <Flag className="h-4 w-4" />
                </Button>
                {currentUser?.role === "admin" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDeleteTopic}
                    title="Obriši topic (Admin)"
                  >
                    🗑️ Delete
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{topic.content}</p>
            </div>
            
            {/* Topic Actions */}
            <div className="flex gap-4 mt-4 pt-4 border-t items-center">
              <button 
                onClick={() => handleLikeTopic()}
                className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Heart className={`h-4 w-4 transition-all ${topic.user_has_liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                <span>Like</span>
                <span>({topic.likes_count || 0})</span>
              </button>
              {currentUser?.id === topic.user_id && (
                <button
                  onClick={() => handleEditTopic()}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Topic
                </button>
              )}
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
                    <div className="flex gap-4 mt-3 items-center">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Heart className={`h-4 w-4 transition-all ${post.user_has_liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                        <span>Like</span>
                        <span>({post.likes_count || 0})</span>
                      </button>
                      <button 
                        onClick={() => handleQuotePost(post)}
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Quote
                      </button>
                      {currentUser?.id === post.user_id && (
                        <button
                          onClick={() => {
                            console.log("Edit clicked - Current user:", currentUser?.id, "Post user:", post.user_id);
                            handleEditPost(post);
                          }}
                          className="text-sm text-muted-foreground hover:text-foreground flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      )}
                      {currentUser?.role === "admin" && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium ml-auto"
                        >
                          🗑️ Delete (Admin)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Topic Modal */}
        {editingTopic && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl">
              <CardHeader>
                <CardTitle>Edit Topic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MarkdownEditor
                  value={editTopicContent}
                  onChange={setEditTopicContent}
                  placeholder="Edit your topic..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveTopicEdit} disabled={!editTopicContent.trim()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingTopic(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Post Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl">
              <CardHeader>
                <CardTitle>Edit Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MarkdownEditor
                  value={editContent}
                  onChange={setEditContent}
                  placeholder="Edit your post..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} disabled={!editContent.trim()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPost(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reply Form */}
        {!topic.is_locked ? (
          <Card id="reply-form">
            <CardHeader>
              <CardTitle>Post a Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReply}>
                <div className="mb-4">
                  <MarkdownEditor
                    value={reply}
                    onChange={setReply}
                    placeholder="Write your reply... Use toolbar for formatting, emojis, and images!"
                  />
                </div>
                <Button type="submit" disabled={!reply.trim()}>
                  <MessageCircle className="mr-2 h-4 w-4" />
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

