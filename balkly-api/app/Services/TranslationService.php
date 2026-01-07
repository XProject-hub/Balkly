<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class TranslationService
{
    /**
     * Translate text to target language using FREE MyMemory API
     */
    public function translate(string $text, string $targetLang, string $sourceLang = 'bs'): ?string
    {
        // Cache key
        $cacheKey = "translation_" . md5($text . $targetLang);
        
        // Check cache first
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        try {
            $source = $this->mapLanguageCode($sourceLang);
            $target = $this->mapLanguageCode($targetLang);
            
            // Don't translate if source and target are the same
            if ($source === $target) {
                return $text;
            }
            
            // MyMemory Free Translation API (no API key needed!)
            $response = Http::timeout(10)->get('https://api.mymemory.translated.net/get', [
                'q' => substr($text, 0, 500), // Max 500 bytes
                'langpair' => $source . '|' . $target,
            ]);
            
            \Log::info('Translation request', [
                'text' => substr($text, 0, 50),
                'target' => $targetLang,
                'status' => $response->status(),
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['responseData']['translatedText'])) {
                    $translatedText = $data['responseData']['translatedText'];
                    
                    // Cache for 30 days
                    Cache::put($cacheKey, $translatedText, now()->addDays(30));
                    
                    \Log::info('Translation success', ['translated' => substr($translatedText, 0, 50)]);
                    
                    return $translatedText;
                }
            }
            
            \Log::warning('Translation API response invalid', ['response' => $response->json()]);
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

