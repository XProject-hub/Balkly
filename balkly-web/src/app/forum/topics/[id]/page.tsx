"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pin, Lock, Eye, Heart, Flag, MessageSquare, CheckCircle, MessageCircle } from "lucide-react";
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

  const handleLike = async (postId?: number) => {
    // Optimistic update FIRST - update UI immediately
    if (postId) {
      setTopic((prev: any) => ({
        ...prev,
        posts: prev.posts.map((p: any) => 
          p.id === postId 
            ? { 
                ...p, 
                user_has_liked: !p.user_has_liked,
                likes_count: p.user_has_liked ? (p.likes_count - 1) : (p.likes_count + 1)
              }
            : p
        )
      }));
    } else {
      setTopic((prev: any) => ({
        ...prev,
        user_has_liked: !prev.user_has_liked,
        likes_count: prev.user_has_liked ? (prev.likes_count - 1) : (prev.likes_count + 1)
      }));
    }

    // Then send API request
    try {
      const url = postId 
        ? `/api/v1/forum/posts/${postId}/like`
        : `/api/v1/forum/topics/${topicId}/like`;
        
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update with server response to be sure
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
                ? { ...p, user_has_liked: !p.user_has_liked, likes_count: p.user_has_liked ? (p.likes_count + 1) : (p.likes_count - 1) }
                : p
            )
          }));
        } else {
          setTopic((prev: any) => ({
            ...prev,
            user_has_liked: !prev.user_has_liked,
            likes_count: prev.user_has_liked ? (prev.likes_count + 1) : (prev.likes_count - 1)
          }));
        }
      }
    } catch (error) {
      console.error("Failed to like:", error);
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
          <Button variant="ghost" onClick={() => router.push("/forum")} className="mb-3">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to forum
          </Button>
          
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
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-3">
                  {topic.user?.name?.[0]?.toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{topic.user?.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Member</p>
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
                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {topic.content}
                </div>
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
                      topic.user_has_liked 
                        ? 'text-red-500' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 transition-all ${topic.user_has_liked ? 'fill-red-500' : ''}`} />
                    <span className="font-medium">{topic.user_has_liked ? 'Liked' : 'Like'}</span>
                    {topic.likes_count > 0 && <span className="text-gray-500">({topic.likes_count})</span>}
                  </button>
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
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3">
                    {post.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{post.user?.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Member</p>
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
                  <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-gray-800">
                  <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLike(post.id);
                    }}
                    className={`flex items-center gap-2 transition ${
                      post.user_has_liked 
                        ? 'text-red-500' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 transition-all ${post.user_has_liked ? 'fill-red-500' : ''}`} />
                    <span className="font-medium">{post.user_has_liked ? 'Liked' : 'Like'}</span>
                    {post.likes_count > 0 && <span className="text-gray-500">({post.likes_count})</span>}
                  </button>
                    <button
                      onClick={() => setReply(`> ${post.user?.name} wrote:\n> ${post.content}\n\n`)}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
                    >
                      Quote
                    </button>
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
      </div>
    </div>
  );
}
