"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pin, Lock, Eye, Heart, Flag, MessageSquare, CheckCircle, MessageCircle, Edit, X, Trash2 } from "lucide-react";
import { forumAPI } from "@/lib/api";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editingTopic, setEditingTopic] = useState(false);
  const [editTopicContent, setEditTopicContent] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== 'undefined') {
      try {
        setCurrentUser(JSON.parse(userData));
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

  const handleReply = async () => {
    if (!reply.trim()) return;
    
    try {
      await forumAPI.createPost({
        topic_id: topicId,
        content: reply,
      });
      setReply("");
      loadTopic();
    } catch (error) {
      alert("Failed to post reply");
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
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ content: editTopicContent }),
      });
      
      if (response.ok) {
        setEditingTopic(false);
        setEditTopicContent("");
        loadTopic();
      } else {
        alert("Failed to save edit");
      }
    } catch (error) {
      alert("Failed to save edit");
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setEditContent(post.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !editingPost) return;
    
    try {
      await fetch(`/api/v1/forum/posts/${editingPost.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ content: editContent }),
      });
      
      setEditingPost(null);
      setEditContent("");
      loadTopic();
    } catch (error) {
      alert("Failed to save edit");
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    
    try {
      await fetch(`/api/v1/admin/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      loadTopic();
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const handleDeleteTopic = async () => {
    if (!confirm('Are you sure you want to delete this entire topic? This action cannot be undone.')) return;
    
    try {
      await fetch(`/api/v1/admin/forum/topics/${topicId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      router.push('/forum');
    } catch (error) {
      alert('Failed to delete topic');
    }
  };

  const handleTogglePin = async () => {
    try {
      const response = await fetch(`/api/v1/admin/forum/topics/${topicId}/pin`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      alert(data.message);
      loadTopic();
    } catch (error) {
      alert('Failed to pin/unpin topic');
    }
  };

  const handleLike = async (postId?: number) => {
    console.log('=== LIKE DEBUG ===');
    console.log('postId:', postId);
    console.log('topicId:', topicId);
    console.log('topic object:', topic);
    
    // Get current state
    const currentLiked = postId 
      ? topic.posts?.find((p: any) => p.id === postId)?.user_has_liked
      : topic.user_has_liked;
    
    const currentCount = postId
      ? topic.posts?.find((p: any) => p.id === postId)?.likes_count || 0
      : topic.likes_count || 0;

    // INSTANT UI UPDATE - before API call
    const newLiked = !currentLiked;
    const newCount = newLiked ? currentCount + 1 : currentCount - 1;

    if (postId) {
      setTopic((prev: any) => ({
        ...prev,
        posts: prev.posts.map((p: any) => 
          p.id === postId 
            ? { ...p, user_has_liked: newLiked, likes_count: newCount }
            : p
        )
      }));
    } else {
      setTopic((prev: any) => ({
        ...prev,
        user_has_liked: newLiked,
        likes_count: newCount
      }));
    }

    // Then confirm with server
    try {
      const url = postId 
        ? `/api/v1/forum/posts/${postId}/like`
        : `/api/v1/forum/topics/${topicId}/like`;
      
      console.log('API URL being called:', url);
        
      const token = localStorage.getItem("auth_token");
      console.log('Auth token:', token);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Like response:', data);
        console.log('Current liked state before:', currentLiked);
        console.log('New liked state from server:', data.liked);
        
        // Sync with server if different
        if (postId) {
          setTopic((prev: any) => ({
            ...prev,
            posts: prev.posts.map((p: any) => 
              p.id === postId 
                ? { ...p, user_has_liked: data.liked, likes_count: data.likes_count }
                : p
            )
          }));
        } else {
          setTopic((prev: any) => ({
            ...prev,
            user_has_liked: data.liked,
            likes_count: data.likes_count || 0
          }));
        }
      } else {
        // Revert on error
        if (postId) {
          setTopic((prev: any) => ({
            ...prev,
            posts: prev.posts.map((p: any) => 
              p.id === postId 
                ? { ...p, user_has_liked: currentLiked, likes_count: currentCount }
                : p
            )
          }));
        } else {
          setTopic((prev: any) => ({
            ...prev,
            user_has_liked: currentLiked,
            likes_count: currentCount
          }));
        }
      }
    } catch (error) {
      console.error("Failed to like:", error);
      // Revert on error
      if (postId) {
        setTopic((prev: any) => ({
          ...prev,
          posts: prev.posts.map((p: any) => 
            p.id === postId 
              ? { ...p, user_has_liked: currentLiked, likes_count: currentCount }
              : p
          )
        }));
      } else {
        setTopic((prev: any) => ({
          ...prev,
          user_has_liked: currentLiked,
          likes_count: currentCount
        }));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Thread not found</h1>
          <Button onClick={() => router.push("/forum")}>Back to Forum</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* XenForo Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-3">
            <Button variant="ghost" onClick={() => router.push("/forum")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to forum
            </Button>
            
            {currentUser?.role === 'admin' && (
              <div className="flex gap-2">
                <Button 
                  variant={topic?.is_sticky ? "secondary" : "default"}
                  size="sm"
                  onClick={handleTogglePin}
                  className={topic?.is_sticky ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  <Pin className="mr-2 h-4 w-4" />
                  {topic?.is_sticky ? 'Unpin' : 'Pin'}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteTopic}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Topic
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            {topic.is_sticky && <Pin className="h-5 w-5 text-amber-500" />}
            {topic.is_locked && <Lock className="h-5 w-5 text-gray-400" />}
            {topic.is_solved && <CheckCircle className="h-5 w-5 text-green-500" />}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{topic.title}</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {topic.views_count} views
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {topic.replies_count} replies
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {topic.likes_count || 0} likes
            </span>
          </div>
        </div>
      </div>

      {/* XenForo Thread Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-4">
        
        {/* Original Post - XenForo Style */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* User Info - Left Sidebar (XenForo style) */}
            <div className="md:col-span-3 bg-gray-50 dark:bg-gray-800/50 p-6 border-r dark:border-gray-800">
              <div className="text-center">
                {topic.user?.profile?.avatar_url ? (
                  <img 
                    src={topic.user.profile.avatar_url} 
                    alt={topic.user?.name} 
                    className="w-24 h-24 mx-auto rounded-full object-cover shadow-lg mb-3"
                  />
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-3">
                    {topic.user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <h3 className={`font-bold mb-1 ${
                  topic.user?.role === 'admin' 
                    ? 'text-red-600 dark:text-red-400' 
                    : topic.user?.role === 'moderator'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>{topic.user?.name}</h3>
                {topic.user?.role === 'admin' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs rounded-full font-semibold mb-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    Admin
                  </span>
                ) : topic.user?.role === 'moderator' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs rounded-full font-semibold mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    Moderator
                  </span>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Member</p>
                )}
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Messages:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reaction score:</span>
                    <span className="font-medium">{topic.likes_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Content - Right Side */}
            <div className="md:col-span-9 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(topic.created_at).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  #{topic.id}
                </div>
              </div>

              <div className="prose max-w-none dark:prose-invert mb-6">
                <div 
                  className="text-gray-800 dark:text-gray-200"
                  dangerouslySetInnerHTML={{
                  __html: topic.content
                    .replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replaceAll(/\*(.*?)\*/g, '<em>$1</em>')
                    .replaceAll(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
                    .replaceAll(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2" />')
                    .replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
                    .replaceAll('\n', '<br/>')
                  }}
                />
              </div>

              {/* Post Actions - XenForo Style */}
              <div className="pt-4 border-t dark:border-gray-800">
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLike();
                    }}
                    className={`flex items-center gap-2 transition ${
                      topic?.user_has_liked === true
                        ? 'text-red-500' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 transition-all ${topic?.user_has_liked === true ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="font-medium">{topic?.user_has_liked === true ? 'Liked' : 'Like'}</span>
                    {(topic?.likes_count || 0) > 0 && <span className="text-gray-500">({topic.likes_count})</span>}
                  </button>
                  {(currentUser?.id === topic.user_id || currentUser?.role === 'admin') && (
                    <button
                      onClick={handleEditTopic}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  )}
                  <button className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
                    <Flag className="h-4 w-4 inline mr-1" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        {topic.posts?.map((post: any) => (
          <div key={post.id} className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* User Info - Left */}
              <div className="md:col-span-3 bg-gray-50 dark:bg-gray-800/50 p-6 border-r dark:border-gray-800">
                <div className="text-center">
                  {post.user?.profile?.avatar_url ? (
                    <img 
                      src={post.user.profile.avatar_url} 
                      alt={post.user?.name} 
                      className="w-20 h-20 mx-auto rounded-full object-cover shadow-lg mb-3"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3">
                      {post.user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <h3 className={`font-bold mb-1 ${
                    post.user?.role === 'admin' 
                      ? 'text-red-600 dark:text-red-400' 
                      : post.user?.role === 'moderator'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>{post.user?.name}</h3>
                  {post.user?.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs rounded-full font-semibold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      Admin
                    </span>
                  ) : post.user?.role === 'moderator' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs rounded-full font-semibold">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      Moderator
                    </span>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Member</p>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="md:col-span-9 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">#{post.id}</div>
                </div>

                <div className="prose max-w-none dark:prose-invert mb-6">
                  <div 
                    className="text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: post.content
                        .replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replaceAll(/\*(.*?)\*/g, '<em>$1</em>')
                        .replaceAll(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
                        .replaceAll(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2" />')
                        .replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
                        .replaceAll('\n', '<br/>')
                    }}
                  />
                </div>

                <div className="pt-4 border-t dark:border-gray-800">
                  <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLike(post.id);
                    }}
                    className={`flex items-center gap-2 transition ${
                      post?.user_has_liked === true
                        ? 'text-red-500' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 transition-all ${post?.user_has_liked === true ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="font-medium">{post?.user_has_liked === true ? 'Liked' : 'Like'}</span>
                    {(post?.likes_count || 0) > 0 && <span className="text-gray-500">({post.likes_count})</span>}
                  </button>
                  <button
                    onClick={() => setReply(`> ${post.user?.name} wrote:\n> ${post.content}\n\n`)}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
                  >
                    Quote
                  </button>
                  {currentUser?.id === post.user_id && (
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  )}
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Reply Form - XenForo Style */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">Post a reply</h3>
          {topic.is_locked && currentUser?.role !== 'admin' ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              This thread is locked. Only moderators can reply.
            </div>
          ) : (
            <>
              <MarkdownEditor value={reply} onChange={setReply} placeholder="Write your reply..." />
              <div className="flex justify-end mt-4">
                <Button onClick={handleReply} disabled={!reply.trim()}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Post reply
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Edit Topic Modal */}
        {editingTopic && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full p-6 border dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Topic</h3>
                <button
                  onClick={() => setEditingTopic(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <MarkdownEditor 
                value={editTopicContent} 
                onChange={setEditTopicContent} 
                placeholder="Edit your topic..." 
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingTopic(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTopicEdit} disabled={!editTopicContent.trim()}>
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Post Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full p-6 border dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Post</h3>
                <button
                  onClick={() => setEditingPost(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <MarkdownEditor 
                value={editContent} 
                onChange={setEditContent} 
                placeholder="Edit your post..." 
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingPost(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={!editContent.trim()}>
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
