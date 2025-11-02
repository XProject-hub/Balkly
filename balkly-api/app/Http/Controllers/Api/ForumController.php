<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ForumCategory;
use App\Models\ForumTopic;
use App\Models\ForumPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ForumController extends Controller
{
    public function categories()
    {
        $categories = ForumCategory::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json(['categories' => $categories]);
    }

    public function topics(Request $request)
    {
        $query = ForumTopic::with(['user', 'category'])
            ->where('status', 'active');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Sticky topics first
        $query->orderBy('is_sticky', 'desc')
              ->orderBy('last_post_at', 'desc');

        $topics = $query->paginate(20);

        return response()->json($topics);
    }

    public function show($id)
    {
        $topic = ForumTopic::with(['user.profile', 'category', 'posts.user'])
            ->findOrFail($id);

        $topic->increment('views_count');

        return response()->json(['topic' => $topic]);
    }

    public function createTopic(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:forum_categories,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $topic = ForumTopic::create([
            'category_id' => $validated['category_id'],
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(8),
            'content' => $validated['content'],
            'status' => 'active',
            'last_post_at' => now(),
        ]);

        return response()->json([
            'topic' => $topic->load(['user', 'category']),
            'message' => 'Topic created successfully',
        ], 201);
    }

    public function createPost(Request $request)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:forum_topics,id',
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:forum_posts,id',
        ]);

        $post = ForumPost::create([
            'topic_id' => $validated['topic_id'],
            'user_id' => auth()->id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        // Update topic
        $topic = ForumTopic::find($validated['topic_id']);
        $topic->increment('replies_count');
        $topic->update(['last_post_at' => now()]);

        return response()->json([
            'post' => $post->load('user'),
            'message' => 'Post created successfully',
        ], 201);
    }

    public function makeSticky(Request $request, $id)
    {
        $validated = $request->validate([
            'duration_days' => 'required|integer|min:7|max:30',
        ]);

        $topic = ForumTopic::where('user_id', auth()->id())->findOrFail($id);

        // TODO: Implement sticky payment flow
        // For now, just make it sticky
        $topic->update([
            'is_sticky' => true,
            'sticky_until' => now()->addDays($validated['duration_days']),
        ]);

        return response()->json([
            'topic' => $topic,
            'message' => 'Topic made sticky (payment implementation pending)',
        ]);
    }
}

