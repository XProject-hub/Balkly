<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use Illuminate\Http\Request;

class AIController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Listing helper - improve title and description
     */
    public function listingHelper(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'locale' => 'nullable|string|in:en,bs,de',
        ]);

        $result = $this->aiService->improveListing(
            $validated['title'] ?? '',
            $validated['description'] ?? '',
            $validated['category'] ?? null,
            $validated['locale'] ?? 'en'
        );

        return response()->json($result);
    }

    /**
     * Classify listing into category
     */
    public function classify(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $result = $this->aiService->classifyListing(
            $validated['title'],
            $validated['description']
        );

        return response()->json($result);
    }

    /**
     * Moderate content for safety
     */
    public function moderate(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'type' => 'nullable|in:text,image',
        ]);

        $result = $this->aiService->moderateContent(
            $validated['content'],
            $validated['type'] ?? 'text'
        );

        return response()->json($result);
    }
}

