<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayPalService
{
    private $clientId;
    private $secret;
    private $mode;
    private $baseUrl;
    
    public function __construct()
    {
        $this->clientId = env('PAYPAL_CLIENT_ID');
        $this->secret = env('PAYPAL_SECRET');
        $this->mode = env('PAYPAL_MODE', 'sandbox');
        
        // Live or Sandbox URLs
        $this->baseUrl = $this->mode === 'live' 
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }
    
    /**
     * Get PayPal access token
     */
    private function getAccessToken()
    {
        try {
            $response = Http::withBasicAuth($this->clientId, $this->secret)
                ->asForm()
                ->post("{$this->baseUrl}/v1/oauth2/token", [
                    'grant_type' => 'client_credentials',
                ]);
            
            if ($response->successful()) {
                return $response->json()['access_token'];
            }
            
            Log::error('PayPal auth failed', ['response' => $response->json()]);
            return null;
        } catch (\Exception $e) {
            Log::error('PayPal auth error: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Create PayPal order
     */
    public function createOrder($amount, $currency, $description, $returnUrl, $cancelUrl)
    {
        $token = $this->getAccessToken();
        
        if (!$token) {
            throw new \Exception('Failed to get PayPal access token');
        }
        
        try {
            $orderData = [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'amount' => [
                        'currency_code' => $currency,
                        'value' => number_format($amount, 2, '.', ''),
                    ],
                    'description' => substr($description, 0, 127), // Max 127 chars
                ]],
                'application_context' => [
                    'brand_name' => 'Balkly',
                    'landing_page' => 'BILLING',
                    'user_action' => 'PAY_NOW',
                    'return_url' => $returnUrl,
                    'cancel_url' => $cancelUrl,
                ],
            ];
            
            Log::info('PayPal Order Request', $orderData);
            
            $response = Http::withToken($token)
                ->post("{$this->baseUrl}/v2/checkout/orders", $orderData);
            
            Log::info('PayPal Order Response', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                
                // Get approval URL
                $approvalUrl = collect($data['links'])->firstWhere('rel', 'approve')['href'] ?? null;
                
                return [
                    'order_id' => $data['id'],
                    'approval_url' => $approvalUrl,
                    'status' => $data['status'],
                ];
            }
            
            Log::error('PayPal create order failed', [
                'status' => $response->status(),
                'response' => $response->json()
            ]);
            throw new \Exception('PayPal API error: ' . json_encode($response->json()));
            
        } catch (\Exception $e) {
            Log::error('PayPal order error: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Capture PayPal order (after user approves)
     */
    public function captureOrder($orderId)
    {
        $token = $this->getAccessToken();
        
        if (!$token) {
            throw new \Exception('Failed to get PayPal access token');
        }
        
        try {
            Log::info('PayPal Capture Request', ['order_id' => $orderId]);
            
            // IMPORTANT: Capture endpoint does NOT accept request body - it's POST but empty body!
            $response = Http::withToken($token)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post("{$this->baseUrl}/v2/checkout/orders/{$orderId}/capture", []); // Empty array = no body
            
            Log::info('PayPal Capture Response', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                
                return [
                    'status' => $data['status'],
                    'payer' => $data['payer'] ?? null,
                    'amount' => $data['purchase_units'][0]['payments']['captures'][0]['amount'] ?? null,
                    'transaction_id' => $data['purchase_units'][0]['payments']['captures'][0]['id'] ?? null,
                ];
            }
            
            Log::error('PayPal capture failed', [
                'status' => $response->status(),
                'response' => $response->json()
            ]);
            throw new \Exception('Failed to capture PayPal payment');
            
        } catch (\Exception $e) {
            Log::error('PayPal capture error: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Get order details
     */
    public function getOrderDetails($orderId)
    {
        $token = $this->getAccessToken();
        
        if (!$token) {
            return null;
        }
        
        try {
            $response = Http::withToken($token)
                ->get("{$this->baseUrl}/v2/checkout/orders/{$orderId}");
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error('PayPal get order error: ' . $e->getMessage());
            return null;
        }
    }
}

