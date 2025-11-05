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
    public function categories(Request $request)
    {
        // Admin can see all categories, public only sees active ones
        $query = ForumCategory::query();
        
        if (!$request->user() || !$request->user()->isAdmin()) {
            $query->where('is_active', true);
        }
        
        $categories = $query->orderBy('order')->get();

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

    // Admin category management
    public function createCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:forum_categories,slug',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'parent_id' => 'nullable|exists:forum_categories,id',
            'is_active' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Set default order
        if (!isset($validated['order'])) {
            $maxOrder = ForumCategory::max('order') ?? 0;
            $validated['order'] = $maxOrder + 1;
        }

        $category = ForumCategory::create($validated);

        return response()->json([
            'category' => $category,
            'message' => 'Category created successfully',
        ], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = ForumCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:forum_categories,slug,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'parent_id' => 'nullable|exists:forum_categories,id',
            'is_active' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        // Update slug if name changed and slug not provided
        if (isset($validated['name']) && !isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        return response()->json([
            'category' => $category,
            'message' => 'Category updated successfully',
        ]);
    }

    public function deleteCategory($id)
    {
        $category = ForumCategory::findOrFail($id);
        
        // Check if category has topics
        $topicsCount = ForumTopic::where('category_id', $id)->count();
        
        if ($topicsCount > 0) {
            return response()->json([
                'message' => "Cannot delete category with $topicsCount topics. Move or delete topics first."
            ], 400);
        }

        // Check if it has subcategories
        $subcategoriesCount = ForumCategory::where('parent_id', $id)->count();
        
        if ($subcategoriesCount > 0) {
            return response()->json([
                'message' => "Cannot delete category with $subcategoriesCount subcategories. Delete subcategories first."
            ], 400);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}

