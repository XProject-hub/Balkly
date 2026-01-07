<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class TranslationService
{
    /**
     * Translate text to target language using FREE MyMemory API
     */
    public function translate(string $text, string $targetLang, string $sourceLang = 'en'): ?string
    {
        // Cache key
        $cacheKey = "translation_" . md5($text . $targetLang);
        
        // Check cache first
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        try {
            // MyMemory Free Translation API (no API key needed!)
            $response = Http::get('https://api.mymemory.translated.net/get', [
                'q' => $text,
                'langpair' => $sourceLang . '|' . $this->mapLanguageCode($targetLang),
            ]);
            
            if ($response->successful() && $response->json()['responseStatus'] == 200) {
                $translatedText = $response->json()['responseData']['translatedText'];
                
                // Cache for 30 days
                Cache::put($cacheKey, $translatedText, now()->addDays(30));
                
                return $translatedText;
            }
        } catch (\Exception $e) {
            \Log::error('Translation failed: ' . $e->getMessage());
        }
        
        // Fallback to original text
        return $text;
    }
    
    /**
     * Map app language codes to translation API codes
     */
    private function mapLanguageCode(string $code): string
    {
        $map = [
            'balkly' => 'sr',  // Serbian
            'bs' => 'bs',      // Bosnian
            'en' => 'en',      // English
            'ar' => 'ar',      // Arabic
            'de' => 'de',      // German
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

