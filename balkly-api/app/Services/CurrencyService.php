<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CurrencyService
{
    private const CACHE_KEY = 'currency_rates';
    private const CACHE_TTL = 3600; // 1 hour
    
    // Free API for exchange rates (you can also use ExchangeRate-API, Fixer.io, etc.)
    private const API_URL = 'https://api.exchangerate-api.com/v4/latest/EUR';
    
    /**
     * Supported currencies
     */
    private const SUPPORTED_CURRENCIES = ['EUR', 'AED'];
    
    /**
     * Get all exchange rates (base is EUR)
     */
    public function getExchangeRates(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            try {
                $response = Http::timeout(10)->get(self::API_URL);
                
                if ($response->successful()) {
                    $data = $response->json();
                    
                    // Filter only supported currencies
                    $rates = ['EUR' => 1.0]; // Base currency
                    foreach (self::SUPPORTED_CURRENCIES as $currency) {
                        if (isset($data['rates'][$currency])) {
                            $rates[$currency] = $data['rates'][$currency];
                        }
                    }
                    
                    return $rates;
                }
            } catch (\Exception $e) {
                Log::error('Failed to fetch exchange rates: ' . $e->getMessage());
            }
            
            // Fallback to approximate rates if API fails
            return $this->getFallbackRates();
        });
    }
    
    /**
     * Convert amount from one currency to another
     */
    public function convert(float $amount, string $from, string $to): float
    {
        if ($from === $to) {
            return $amount;
        }
        
        $rates = $this->getExchangeRates();
        
        if (!isset($rates[$from]) || !isset($rates[$to])) {
            return $amount; // Return original if currency not supported
        }
        
        // Convert to EUR first, then to target currency
        $inEur = $amount / $rates[$from];
        $converted = $inEur * $rates[$to];
        
        return round($converted, 2);
    }
    
    /**
     * Get fallback rates (approximate values)
     * These are approximate rates - update periodically
     */
    private function getFallbackRates(): array
    {
        return [
            'EUR' => 1.0,      // Base
            'AED' => 4.0,      // 1 EUR ≈ 4 AED (real rate)
        ];
    }
    
    /**
     * Get currency symbol
     */
    public function getCurrencySymbol(string $currency): string
    {
        $symbols = [
            'EUR' => '€',
            'AED' => 'د.إ',
            'USD' => '$',
            'GBP' => '£',
            'BAM' => 'KM',
            'RSD' => 'din',
            'HRK' => 'kn',
        ];
        
        return $symbols[$currency] ?? $currency;
    }
    
    /**
     * Format currency with proper symbol and locale
     */
    public function format(float $amount, string $currency): string
    {
        $symbol = $this->getCurrencySymbol($currency);
        
        // Different formatting based on currency
        switch ($currency) {
            case 'AED':
                return $symbol . ' ' . number_format($amount, 2, '.', ',');
            case 'RSD':
            case 'BAM':
                return number_format($amount, 2, ',', '.') . ' ' . $symbol;
            default:
                return $symbol . number_format($amount, 2, '.', ',');
        }
    }
    
    /**
     * Get supported currencies list
     */
    public function getSupportedCurrencies(): array
    {
        $currencies = [];
        foreach (self::SUPPORTED_CURRENCIES as $code) {
            $currencies[] = [
                'code' => $code,
                'symbol' => $this->getCurrencySymbol($code),
            ];
        }
        return $currencies;
    }
}

