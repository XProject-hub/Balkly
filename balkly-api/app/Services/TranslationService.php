<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class TranslationService
{
    private $apiKey;
    
    public function __construct()
    {
        $this->apiKey = env('GOOGLE_TRANSLATE_API_KEY', 'AIzaSyBSzI9EzG4J7cloixYYGk0alUZLfR7Skjo');
    }
    
    /**
     * Translate text to target language
     */
    public function translate(string $text, string $targetLang, string $sourceLang = 'auto'): ?string
    {
        // Cache key
        $cacheKey = "translation_" . md5($text . $targetLang);
        
        // Check cache first
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        try {
            $response = Http::get('https://translation.googleapis.com/language/translate/v2', [
                'key' => $this->apiKey,
                'q' => $text,
                'target' => $this->mapLanguageCode($targetLang),
                'format' => 'text',
            ]);
            
            if ($response->successful()) {
                $translatedText = $response->json()['data']['translations'][0]['translatedText'];
                
                // Cache for 7 days
                Cache::put($cacheKey, $translatedText, now()->addDays(7));
                
                return $translatedText;
            }
        } catch (\Exception $e) {
            \Log::error('Translation failed: ' . $e->getMessage());
        }
        
        return null;
    }
    
    /**
     * Map app language codes to Google Translate codes
     */
    private function mapLanguageCode(string $code): string
    {
        $map = [
            'balkly' => 'sr', // Serbian (Cyrillic/Latin)
            'en' => 'en',
            'ar' => 'ar',
        ];
        
        return $map[$code] ?? $code;
    }
    
    /**
     * Translate multiple fields
     */
    public function translateFields(array $fields, string $targetLang): array
    {
        $translated = [];
        
        foreach ($fields as $key => $value) {
            if (is_string($value)) {
                $translated[$key] = $this->translate($value, $targetLang) ?? $value;
            } else {
                $translated[$key] = $value;
            }
        }
        
        return $translated;
    }
}

