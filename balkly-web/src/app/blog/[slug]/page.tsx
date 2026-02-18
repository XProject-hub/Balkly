"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Eye, Heart, Share2, Facebook, Twitter, Linkedin, Link2, MessageCircle, Send, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import { sanitizeHtml } from "@/lib/sanitize";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user info
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/blog/${slug}`);
      const data = await response.json();
      setPost(data.post);
      setRelated(data.related || []);
      setLikesCount(data.post?.likes_count || 0);
      setComments(data.post?.comments || []);
      
      // Check if user has liked this post
      const likedPosts = JSON.parse(localStorage.getItem('liked_blog_posts') || '[]');
      setLiked(likedPosts.includes(data.post?.id));
    } catch (error) {
      console.error("Failed to load post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    
    const likedPosts = JSON.parse(localStorage.getItem('liked_blog_posts') || '[]');
    
    if (liked) {
      // Unlike
      const newLikedPosts = likedPosts.filter((id: number) => id !== post.id);
      localStorage.setItem('liked_blog_posts', JSON.stringify(newLikedPosts));
      setLiked(false);
      setLikesCount(prev => Math.max(0, prev - 1));
    } else {
      // Like
      likedPosts.push(post.id);
      localStorage.setItem('liked_blog_posts', JSON.stringify(likedPosts));
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }

    // Send to backend (fire and forget)
    try {
      await fetch(`/api/v1/blog/${slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      // Ignore errors - local state is already updated
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || 'Check out this article';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        setShowShareMenu(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Please login to comment');
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/v1/blog/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment("");
        toast.success('Comment posted!');
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const canDeleteComment = () => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || currentUser.role === 'moderator';
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const response = await fetch(`/api/v1/blog/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        toast.success('Comment deleted');
      } else {
        toast.error('Failed to delete comment');
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button onClick={() => router.push("/blog")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
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
          onClick={() => router.push("/blog")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        <article>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium uppercase">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author?.name}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(post.published_at).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {post.views_count} views
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-8">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Like & Share Section */}
          <div className="flex items-center justify-between py-6 border-t border-b mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className={liked ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
              </Button>
              
              <span className="text-muted-foreground text-sm flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {comments.length} Comments
              </span>
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-background border rounded-lg shadow-lg p-2 z-50 min-w-[160px]">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-md"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-md"
                  >
                    <Twitter className="h-4 w-4 text-sky-500" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-md"
                  >
                    <Linkedin className="h-4 w-4 text-blue-700" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-md"
                  >
                    <Link2 className="h-4 w-4" />
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <div className="mb-8">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="mb-3"
              />
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submittingComment}
              >
                <Send className="h-4 w-4 mr-2" />
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{comment.user?.name || 'Anonymous'}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {canDeleteComment() && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Delete comment (Admin/Moderator)"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-foreground">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Forum Discussion Link */}
          <div className="bg-gradient-to-r from-balkly-blue/10 to-purple-500/10 border border-primary/20 rounded-xl p-6 text-center mb-8">
            <MessageCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="text-lg font-bold mb-2">Want to discuss more?</h3>
            <p className="text-muted-foreground mb-4">
              Join the conversation with the Balkly community
            </p>
            <a 
              href="/forum" 
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Discuss on Balkly Forum
            </a>
          </div>
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-bold line-clamp-2 mb-2 hover:text-primary">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(relatedPost.published_at).toLocaleDateString()}
                      </p>
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

