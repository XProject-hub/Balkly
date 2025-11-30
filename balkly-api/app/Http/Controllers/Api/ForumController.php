<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ForumCategory;
use App\Models\ForumTopic;
use App\Models\ForumPost;
use App\Services\NotificationService;
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
        
        $categories = $query->with('subcategories')->orderBy('order')->get();

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

        // Add user_has_liked flag for topic and posts
        $topicArray = $topic->toArray();
        
        if (auth()->check()) {
            $topicArray['user_has_liked'] = \DB::table('forum_topic_likes')
                ->where('topic_id', $topic->id)
                ->where('user_id', auth()->id())
                ->exists();
                
            // Add user_has_liked for each post
            if (isset($topicArray['posts']) && is_array($topicArray['posts'])) {
                foreach ($topicArray['posts'] as &$post) {
                    $post['user_has_liked'] = \DB::table('forum_post_likes')
                        ->where('post_id', $post['id'])
                        ->where('user_id', auth()->id())
                        ->exists();
                }
                unset($post); // Clear reference
            }
        } else {
            $topicArray['user_has_liked'] = false;
            if (isset($topicArray['posts']) && is_array($topicArray['posts'])) {
                foreach ($topicArray['posts'] as &$post) {
                    $post['user_has_liked'] = false;
                }
                unset($post); // Clear reference
            }
        }

        return response()->json(['topic' => $topicArray]);
    }

    public function createTopic(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        // Check if it's a subcategory or main category
        $subcategory = \App\Models\ForumSubcategory::find($validated['category_id']);
        
        if ($subcategory) {
            // It's a subcategory - use parent category
            $categoryId = $subcategory->forum_category_id;
            $subcategoryId = $subcategory->id;
        } else {
            // It's a main category
            $categoryId = $validated['category_id'];
            $subcategoryId = null;
        }

        $topic = ForumTopic::create([
            'category_id' => $categoryId,
            'subcategory_id' => $subcategoryId,
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

    public function updateTopic(Request $request, $id)
    {
        $topic = ForumTopic::findOrFail($id);

        // Only author can edit
        if ($topic->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $topic->update([
            'content' => $validated['content'],
        ]);

        return response()->json([
            'topic' => $topic->fresh(['user', 'category']),
            'message' => 'Topic updated successfully',
        ]);
    }

    public function likeTopic(Request $request, $id)
    {
        $topic = ForumTopic::findOrFail($id);
        
        \Log::info('Like topic attempt', [
            'topic_id' => $id,
            'user_id' => auth()->id(),
        ]);
        
        // Toggle like
        $existingLike = \DB::table('forum_topic_likes')
            ->where('topic_id', $id)
            ->where('user_id', auth()->id())
            ->first();

        \Log::info('Existing like?', ['exists' => (bool)$existingLike]);

        if ($existingLike) {
            // Unlike
            \DB::table('forum_topic_likes')
                ->where('topic_id', $id)
                ->where('user_id', auth()->id())
                ->delete();
            
            // Decrement and get new count
            \DB::table('forum_topics')
                ->where('id', $id)
                ->decrement('likes_count');
            
            $liked = false;
            \Log::info('Unliked topic');
        } else {
            // Like
            \DB::table('forum_topic_likes')->insert([
                'topic_id' => $id,
                'user_id' => auth()->id(),
                'created_at' => now(),
            ]);
            
            // Increment and get new count
            \DB::table('forum_topics')
                ->where('id', $id)
                ->increment('likes_count');
            
            $liked = true;
            \Log::info('Liked topic');
            
            // Send notification to topic owner
            if (auth()->id() !== $topic->user_id) {
                $notificationService = app(NotificationService::class);
                $notificationService->forumLike(
                    $id, 
                    'topic', 
                    auth()->user(), 
                    $topic->user_id, 
                    $topic->title
                );
            }
        }

        // Get fresh count from database
        $currentCount = \DB::table('forum_topics')
            ->where('id', $id)
            ->value('likes_count');
        
        $response = [
            'liked' => $liked,
            'likes_count' => $currentCount ?? 0,
            'user_has_liked' => $liked,
        ];
        
        \Log::info('Like response', $response);
        
        return response()->json($response);
    }

    public function likePost(Request $request, $id)
    {
        $post = ForumPost::findOrFail($id);
        
        // Toggle like
        $existingLike = \DB::table('forum_post_likes')
            ->where('post_id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingLike) {
            // Unlike
            \DB::table('forum_post_likes')
                ->where('post_id', $id)
                ->where('user_id', auth()->id())
                ->delete();
            $post->decrement('likes_count');
            $liked = false;
        } else {
            // Like
            \DB::table('forum_post_likes')->insert([
                'post_id' => $id,
                'user_id' => auth()->id(),
                'created_at' => now(),
            ]);
            $post->increment('likes_count');
            $liked = true;
            
            // Send notification to post owner
            $topic = $post->topic;
            $notificationService = app(NotificationService::class);
            $notificationService->forumLike(
                $topic->id, 
                'post', 
                auth()->user(), 
                $post->user_id, 
                substr($post->content, 0, 50) . '...'
            );
        }

        $freshPost = $post->fresh();
        
        return response()->json([
            'liked' => $liked,
            'likes_count' => $freshPost->likes_count ?? 0,
            'user_has_liked' => $liked, // Explicitly return the current state
        ]);
    }

    public function updatePost(Request $request, $id)
    {
        $post = ForumPost::findOrFail($id);

        // Only author can edit
        if ($post->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $post->update([
            'content' => $validated['content'],
            'is_edited' => true,
            'edited_at' => now(),
        ]);

        return response()->json([
            'post' => $post->load('user'),
            'message' => 'Post updated successfully',
        ]);
    }

    public function deletePost($id)
    {
        $post = ForumPost::findOrFail($id);

        // Only author or admin can delete
        if ($post->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
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

        // Send notification to topic owner
        $notificationService = app(NotificationService::class);
        $notificationService->forumReply(
            $topic->id,
            $topic->user_id,
            auth()->user(),
            $topic->title
        );

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

    // Report topic
    public function reportTopic(Request $request, $id)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $topic = ForumTopic::findOrFail($id);

        // Create report (you can create a reports table or just log)
        \Illuminate\Support\Facades\Log::warning('Forum Topic Reported', [
            'topic_id' => $id,
            'topic_title' => $topic->title,
            'reported_by' => auth()->id(),
            'reporter_name' => auth()->user()->name,
            'reason' => $validated['reason'],
            'url' => '/forum/topics/' . $id,
        ]);

        // You can also store in database if you have a reports table
        // Report::create([...]);

        return response()->json([
            'message' => 'Report submitted successfully',
        ]);
    }

    // Admin: Delete topic
    public function deleteTopic($id)
    {
        $topic = ForumTopic::findOrFail($id);
        
        // Log deletion
        \Illuminate\Support\Facades\Log::info('Forum Topic Deleted by Admin', [
            'topic_id' => $id,
            'topic_title' => $topic->title,
            'deleted_by' => auth()->id(),
            'admin_name' => auth()->user()->name,
        ]);

        $topic->delete(); // Soft delete

        return response()->json([
            'message' => 'Topic deleted successfully',
        ]);
    }

    // React to topic or post
    public function react(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:like,love,haha,wow,sad,angry',
            'reactable_type' => 'required|in:topic,post',
            'reactable_id' => 'required|integer',
        ]);

        $reactableClass = $validated['reactable_type'] === 'topic' 
            ? \App\Models\ForumTopic::class 
            : \App\Models\ForumPost::class;

        // Toggle reaction
        $existing = \App\Models\ForumReaction::where([
            'user_id' => auth()->id(),
            'reactable_type' => $reactableClass,
            'reactable_id' => $validated['reactable_id'],
        ])->first();

        if ($existing) {
            if ($existing->type === $validated['type']) {
                // Remove reaction
                $existing->delete();
                return response()->json(['reacted' => false]);
            } else {
                // Change reaction
                $existing->update(['type' => $validated['type']]);
                return response()->json(['reacted' => true, 'type' => $validated['type']]);
            }
        }

        // Add new reaction
        \App\Models\ForumReaction::create([
            'user_id' => auth()->id(),
            'reactable_type' => $reactableClass,
            'reactable_id' => $validated['reactable_id'],
            'type' => $validated['type'],
        ]);

        return response()->json(['reacted' => true, 'type' => $validated['type']]);
    }

    // Watch/unwatch thread
    public function toggleWatch(Request $request, $topicId)
    {
        $topic = ForumTopic::findOrFail($topicId);

        $existing = \DB::table('forum_thread_watchers')
            ->where('user_id', auth()->id())
            ->where('topic_id', $topicId)
            ->first();

        if ($existing) {
            \DB::table('forum_thread_watchers')
                ->where('user_id', auth()->id())
                ->where('topic_id', $topicId)
                ->delete();
            $topic->decrement('watchers_count');
            $watching = false;
        } else {
            \DB::table('forum_thread_watchers')->insert([
                'user_id' => auth()->id(),
                'topic_id' => $topicId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $topic->increment('watchers_count');
            $watching = true;
        }

        return response()->json([
            'watching' => $watching,
            'watchers_count' => $topic->fresh()->watchers_count,
        ]);
    }

    // Mark post as best answer
    public function markBestAnswer(Request $request, $postId)
    {
        $post = ForumPost::findOrFail($postId);
        $topic = $post->topic;

        // Only topic owner can mark best answer
        if ($topic->user_id !== auth()->id()) {
            return response()->json(['message' => 'Only topic owner can mark best answer'], 403);
        }

        // Toggle best answer
        if ($topic->best_answer_id === $postId) {
            $topic->update(['best_answer_id' => null, 'is_solved' => false]);
            $post->update(['is_best_answer' => false]);
            $message = 'Best answer removed';
        } else {
            // Remove previous best answer
            if ($topic->best_answer_id) {
                ForumPost::find($topic->best_answer_id)?->update(['is_best_answer' => false]);
            }
            
            $topic->update(['best_answer_id' => $postId, 'is_solved' => true]);
            $post->update(['is_best_answer' => true]);
            
            // Add reputation to answer author
            $reputation = \App\Models\UserReputation::firstOrCreate(
                ['user_id' => $post->user_id],
                ['points' => 0, 'posts_count' => 0, 'topics_count' => 0, 'solutions_count' => 0, 'helpful_count' => 0]
            );
            $reputation->increment('helpful_count');
            $reputation->addPoints(10);
            
            $message = 'Best answer marked';
        }

        return response()->json([
            'message' => $message,
            'topic' => $topic->fresh(['posts']),
        ]);
    }

    // Lock/unlock thread
    public function toggleLock(Request $request, $topicId)
    {
        $topic = ForumTopic::findOrFail($topicId);

        // Only admin or topic owner can lock
        if ($topic->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $topic->update(['is_locked' => !$topic->is_locked]);

        return response()->json([
            'locked' => $topic->is_locked,
            'message' => $topic->is_locked ? 'Thread locked' : 'Thread unlocked',
        ]);
    }

}

