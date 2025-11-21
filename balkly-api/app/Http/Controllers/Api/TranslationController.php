<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TranslationService;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    protected $translator;

    public function __construct(TranslationService $translator)
    {
        $this->translator = $translator;
    }

    /**
     * Translate text
     */
    public function translate(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:5000',
            'target' => 'required|string|in:en,balkly,ar',
        ]);

        $translated = $this->translator->translate(
            $validated['text'],
            $validated['target']
        );

        return response()->json([
            'original' => $validated['text'],
            'translated' => $translated ?? $validated['text'],
            'target_language' => $validated['target'],
        ]);
    }

    /**
     * Translate multiple texts (batch)
     */
    public function translateBatch(Request $request)
    {
        $validated = $request->validate([
            'texts' => 'required|array|max:100',
            'texts.*' => 'required|string|max:5000',
            'target' => 'required|string|in:en,balkly,ar',
        ]);

        $translations = [];
        foreach ($validated['texts'] as $key => $text) {
            $translations[$key] = $this->translator->translate($text, $validated['target']) ?? $text;
        }

        return response()->json([
            'translations' => $translations,
            'target_language' => $validated['target'],
        ]);
    }
}

