<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
}

