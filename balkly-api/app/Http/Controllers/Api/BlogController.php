<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class BlogController extends Controller
{
    /**
     * Get published blog posts
     */
    public function index(Request $request)
    {
        $query = BlogPost::published()->with('author');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        $posts = $query->orderBy('published_at', 'desc')->paginate(12);

        return response()->json($posts);
    }

    /**
     * Get single blog post
     */
    public function show($slug)
    {
        $post = BlogPost::where('slug', $slug)
            ->published()
            ->with('author')
            ->firstOrFail();

        $post->increment('views_count');

        // Get related posts
        $related = BlogPost::published()
            ->where('category', $post->category)
            ->where('id', '!=', $post->id)
            ->take(3)
            ->get();

        return response()->json([
            'post' => $post,
            'related' => $related,
        ]);
    }

    /**
     * Create blog post (Admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|url',
            'category' => 'required|in:news,tutorial,update,guide',
            'tags' => 'nullable|array',
            'status' => 'required|in:draft,published',
        ]);

        $post = BlogPost::create([
            'author_id' => auth()->id(),
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'featured_image' => $validated['featured_image'] ?? null,
            'category' => $validated['category'],
            'tags' => $validated['tags'] ?? [],
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return response()->json(['post' => $post], 201);
    }

    /**
     * Update blog post (Admin)
     */
    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'content' => 'sometimes|string',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'published' && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return response()->json(['post' => $post]);
    }

    /**
     * Delete blog post (Admin)
     */
    public function destroy($id)
    {
        BlogPost::findOrFail($id)->delete();
        return response()->json(['message' => 'Post deleted']);
    }

    /**
     * Get all blog categories
     */
    public function categories()
    {
        $categories = DB::table('blog_categories')
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();

        return response()->json(['categories' => $categories]);
    }

    /**
     * Create blog category (Admin)
     */
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
        ]);

        $slug = Str::slug($validated['name']);
        
        // Check if slug exists
        $exists = DB::table('blog_categories')->where('slug', $slug)->exists();
        if ($exists) {
            $slug = $slug . '-' . Str::random(4);
        }

        $id = DB::table('blog_categories')->insertGetId([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'order' => DB::table('blog_categories')->max('order') + 1,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $category = DB::table('blog_categories')->find($id);

        return response()->json(['category' => $category], 201);
    }

    /**
     * Update blog category (Admin)
     */
    public function updateCategory(Request $request, $id)
    {
        $category = DB::table('blog_categories')->find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:500',
        ]);

        $updateData = ['updated_at' => now()];
        
        if (isset($validated['name'])) {
            $updateData['name'] = $validated['name'];
            $updateData['slug'] = Str::slug($validated['name']);
        }
        if (array_key_exists('description', $validated)) {
            $updateData['description'] = $validated['description'];
        }

        DB::table('blog_categories')->where('id', $id)->update($updateData);

        $category = DB::table('blog_categories')->find($id);

        return response()->json(['category' => $category]);
    }

    /**
     * Delete blog category (Admin)
     */
    public function destroyCategory($id)
    {
        $category = DB::table('blog_categories')->find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        // Set posts in this category to null
        BlogPost::where('category', $category->slug)->update(['category' => null]);

        DB::table('blog_categories')->where('id', $id)->delete();

        return response()->json(['message' => 'Category deleted']);
    }
}

