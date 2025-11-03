<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KbCategory;
use App\Models\KbArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KnowledgeBaseController extends Controller
{
    /**
     * Get all KB categories
     */
    public function categories()
    {
        $categories = KbCategory::with(['articles' => function($query) {
            $query->published()->orderBy('display_order');
        }])->orderBy('display_order')->get();

        return response()->json(['categories' => $categories]);
    }

    /**
     * Search knowledge base
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');

        if (empty($query)) {
            return response()->json(['articles' => []]);
        }

        $articles = KbArticle::search($query)
            ->where('is_published', true)
            ->take(20)
            ->get();

        return response()->json(['articles' => $articles]);
    }

    /**
     * Get single KB article
     */
    public function show($slug)
    {
        $article = KbArticle::where('slug', $slug)
            ->published()
            ->with('category')
            ->firstOrFail();

        $article->increment('views_count');

        // Get related articles
        $related = KbArticle::published()
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->take(5)
            ->get();

        return response()->json([
            'article' => $article,
            'related' => $related,
        ]);
    }

    /**
     * Submit article feedback
     */
    public function feedback(Request $request, $id)
    {
        $validated = $request->validate([
            'is_helpful' => 'required|boolean',
            'comment' => 'nullable|string|max:500',
        ]);

        $article = KbArticle::findOrFail($id);

        // Record feedback
        \DB::table('kb_article_feedback')->insert([
            'article_id' => $id,
            'user_id' => auth()->id(),
            'is_helpful' => $validated['is_helpful'],
            'comment' => $validated['comment'] ?? null,
            'ip_address' => request()->ip(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Update counts
        if ($validated['is_helpful']) {
            $article->increment('helpful_count');
        } else {
            $article->increment('not_helpful_count');
        }

        return response()->json(['message' => 'Thank you for your feedback!']);
    }

    /**
     * Create KB article (Admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:kb_categories,id',
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'video_url' => 'nullable|url',
            'video_duration' => 'nullable|integer',
        ]);

        $article = KbArticle::create([
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'content' => $validated['content'],
            'video_url' => $validated['video_url'] ?? null,
            'video_duration' => $validated['video_duration'] ?? null,
            'is_published' => true,
        ]);

        return response()->json(['article' => $article], 201);
    }

    /**
     * Update KB article (Admin)
     */
    public function update(Request $request, $id)
    {
        $article = KbArticle::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'content' => 'sometimes|string',
            'video_url' => 'nullable|url',
            'is_published' => 'sometimes|boolean',
        ]);

        $article->update($validated);

        return response()->json(['article' => $article]);
    }

    /**
     * Delete KB article (Admin)
     */
    public function destroy($id)
    {
        KbArticle::findOrFail($id)->delete();
        return response()->json(['message' => 'Article deleted']);
    }
}

