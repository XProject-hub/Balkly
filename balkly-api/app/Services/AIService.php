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
        // Use local enhancement if no OpenAI key
        if (!$this->apiKey) {
            return $this->localEnhancement($title, $description, $category);
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
            // Fallback to local enhancement if API fails
            return $this->localEnhancement($title, $description, $category);
        }
    }

    /**
     * Local enhancement without OpenAI (fallback)
     */
    protected function localEnhancement($title, $description, $category = null)
    {
        // Improve title
        $improvedTitle = $this->improveTitle($title, $category);
        
        // Improve description
        $improvedDescription = $this->improveDescription($description, $category);
        
        return [
            'improved_title' => $improvedTitle,
            'improved_description' => $improvedDescription,
            'translations' => [],
            'tags' => $this->extractTags($title, $description),
            'enhanced_locally' => true,
        ];
    }

    /**
     * Improve title locally
     */
    protected function improveTitle($title, $category = null)
    {
        // Capitalize first letter of each word
        $title = ucwords(strtolower(trim($title)));
        
        // Add emoji based on category
        $emoji = $this->getCategoryEmoji($category);
        
        // Limit to 70 characters
        if (strlen($title) > 70) {
            $title = substr($title, 0, 67) . '...';
        }
        
        // Add emoji if not already present and category is known
        if ($emoji && !preg_match('/[\x{1F000}-\x{1F9FF}]/u', $title)) {
            $title = $emoji . ' ' . $title;
        }
        
        return $title;
    }

    /**
     * Improve description locally
     */
    protected function improveDescription($description, $category = null)
    {
        $description = trim($description);
        
        // If description is too short, suggest structure
        if (strlen($description) < 100) {
            return $description . "\n\n✨ Key Features:\n• Excellent condition\n• Ready for immediate use\n• Great value for money\n\n📍 Location & Contact:\nFeel free to message with any questions!";
        }
        
        // Split into sentences
        $sentences = preg_split('/(?<=[.!?])\s+/', $description);
        
        // Add structure with bullet points if not already formatted
        if (strpos($description, '•') === false && strpos($description, '-') === false) {
            $improved = "📝 Description:\n";
            $improved .= implode(' ', array_slice($sentences, 0, 2)) . "\n\n";
            $improved .= "✨ Features:\n";
            
            foreach (array_slice($sentences, 2) as $sentence) {
                if (strlen(trim($sentence)) > 10) {
                    $improved .= "• " . trim($sentence) . "\n";
                }
            }
            
            $improved .= "\n💬 Contact me for more details!";
            
            return $improved;
        }
        
        // Already formatted, just clean up
        return $description;
    }

    /**
     * Extract keywords as tags
     */
    protected function extractTags($title, $description)
    {
        $text = strtolower($title . ' ' . $description);
        $commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'from', 'are', 'was', 'will', 'have'];
        
        // Extract words longer than 4 characters
        preg_match_all('/\b\w{5,}\b/', $text, $matches);
        $words = $matches[0];
        
        // Filter and get unique
        $tags = array_diff($words, $commonWords);
        $tags = array_unique($tags);
        $tags = array_slice($tags, 0, 5);
        
        return array_values($tags);
    }

    /**
     * Get category emoji
     */
    protected function getCategoryEmoji($category)
    {
        if (!$category) return null;
        
        $category = strtolower($category);
        
        $emojis = [
            'auto' => '🚗',
            'car' => '🚗',
            'vehicle' => '🚗',
            'real estate' => '🏠',
            'house' => '🏠',
            'apartment' => '🏢',
            'property' => '🏘️',
            'electronics' => '📱',
            'phone' => '📱',
            'computer' => '💻',
            'laptop' => '💻',
            'fashion' => '👗',
            'clothing' => '👕',
            'shoes' => '👟',
            'furniture' => '🛋️',
            'home' => '🏡',
            'sports' => '⚽',
            'fitness' => '💪',
            'gym' => '🏋️',
            'jobs' => '💼',
            'work' => '💼',
            'events' => '🎉',
            'ticket' => '🎫',
            'concert' => '🎵',
        ];
        
        foreach ($emojis as $keyword => $emoji) {
            if (strpos($category, $keyword) !== false) {
                return $emoji;
            }
        }
        
        return null;
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

