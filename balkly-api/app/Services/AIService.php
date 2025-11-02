<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AIService
{
    protected $apiKey;
    protected $model;

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
        $this->model = config('services.openai.model', 'gpt-4');
    }

    /**
     * Improve listing title and description
     */
    public function improveListing($title, $description, $category = null, $locale = 'en')
    {
        if (!$this->apiKey) {
            return [
                'improved_title' => $title,
                'improved_description' => $description,
                'translations' => [
                    'en' => $description,
                    'bs' => $description,
                    'de' => $description,
                ],
                'tags' => [],
            ];
        }

        try {
            $prompt = $this->buildListingPrompt($title, $description, $category, $locale);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are Balkly\'s listing editor. Improve titles and descriptions. Output valid JSON only.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature' => 0.7,
            ]);

            $result = $response->json();
            $content = json_decode($result['choices'][0]['message']['content'], true);

            return [
                'improved_title' => $content['title'] ?? $title,
                'improved_description' => $content['description'] ?? $description,
                'translations' => $content['translations'] ?? [],
                'tags' => $content['tags'] ?? [],
                'safety_flags' => $content['safety_flags'] ?? [],
            ];
        } catch (\Exception $e) {
            return [
                'improved_title' => $title,
                'improved_description' => $description,
                'translations' => [],
                'tags' => [],
                'error' => 'Enhancement service temporarily unavailable',
            ];
        }
    }

    /**
     * Classify listing category and attributes
     */
    public function classifyListing($title, $description)
    {
        if (!$this->apiKey) {
            return ['category_id' => null, 'attributes' => [], 'confidence' => 0];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Classify listings into categories: Auto, Real Estate, Events, or Other. Output JSON.',
                    ],
                    [
                        'role' => 'user',
                        'content' => "Title: {$title}\nDescription: {$description}",
                    ],
                ],
                'response_format' => ['type' => 'json_object'],
            ]);

            $result = $response->json();
            $content = json_decode($result['choices'][0]['message']['content'], true);

            return [
                'category' => $content['category'] ?? 'other',
                'attributes' => $content['attributes'] ?? [],
                'confidence' => $content['confidence'] ?? 0.5,
            ];
        } catch (\Exception $e) {
            return ['category' => null, 'attributes' => [], 'confidence' => 0];
        }
    }

    /**
     * Moderate content for safety
     */
    public function moderateContent($content, $type = 'text')
    {
        if (!$this->apiKey) {
            return ['safe' => true, 'score' => 1.0, 'flags' => []];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->post('https://api.openai.com/v1/moderations', [
                'input' => $content,
            ]);

            $result = $response->json();
            $moderation = $result['results'][0];

            $flags = [];
            foreach ($moderation['categories'] as $category => $flagged) {
                if ($flagged) {
                    $flags[] = $category;
                }
            }

            return [
                'safe' => !$moderation['flagged'],
                'score' => 1.0 - max(array_values($moderation['category_scores'])),
                'flags' => $flags,
            ];
        } catch (\Exception $e) {
            return ['safe' => true, 'score' => 0.8, 'flags' => [], 'error' => $e->getMessage()];
        }
    }

    /**
     * Build listing improvement prompt
     */
    protected function buildListingPrompt($title, $description, $category, $locale)
    {
        return <<<PROMPT
Improve this marketplace listing:

Title: {$title}
Description: {$description}
Category: {$category}
Target Locale: {$locale}

Requirements:
1. Create a compelling title (max 70 characters)
2. Improve description with bullet points and clear benefits
3. Translate to English, Bosnian, and German
4. Suggest relevant tags (max 8)
5. Flag any safety concerns

Output JSON format:
{
    "title": "improved title",
    "description": "improved description with bullets",
    "translations": {
        "en": "English version",
        "bs": "Bosnian version",
        "de": "German version"
    },
    "tags": ["tag1", "tag2"],
    "safety_flags": []
}
PROMPT;
    }
}

