<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CurrencyService;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    protected $currencyService;
    
    public function __construct(CurrencyService $currencyService)
    {
        $this->currencyService = $currencyService;
    }
    
    /**
     * Get all exchange rates
     */
    public function getRates()
    {
        $rates = $this->currencyService->getExchangeRates();
        
        return response()->json([
            'success' => true,
            'rates' => $rates,
            'base' => 'EUR',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
    
    /**
     * Convert currency
     */
    public function convert(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'from' => 'required|string|size:3',
            'to' => 'required|string|size:3',
        ]);
        
        $converted = $this->currencyService->convert(
            $validated['amount'],
            $validated['from'],
            $validated['to']
        );
        
        $formatted = $this->currencyService->format($converted, $validated['to']);
        
        return response()->json([
            'success' => true,
            'original' => [
                'amount' => $validated['amount'],
                'currency' => $validated['from'],
                'formatted' => $this->currencyService->format($validated['amount'], $validated['from']),
            ],
            'converted' => [
                'amount' => $converted,
                'currency' => $validated['to'],
                'formatted' => $formatted,
            ],
        ]);
    }
    
    /**
     * Get supported currencies
     */
    public function getSupportedCurrencies()
    {
        $currencies = $this->currencyService->getSupportedCurrencies();
        
        return response()->json([
            'success' => true,
            'currencies' => $currencies,
        ]);
    }
}

