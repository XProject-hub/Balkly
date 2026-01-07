<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PayPalService;
use App\Models\Order;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PayPalController extends Controller
{
    protected $paypal;

    public function __construct(PayPalService $paypal)
    {
        $this->paypal = $paypal;
    }

    /**
     * Create PayPal checkout for listing promotion
     */
    public function createCheckout(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'plan_id' => 'required|integer',
            'amount' => 'required|numeric|min:0',
        ]);

        $listing = Listing::findOrFail($validated['listing_id']);
        
        // Create pending order in database
        $order = Order::create([
            'buyer_id' => auth()->id(),
            'seller_id' => $listing->user_id,
            'listing_id' => $listing->id,
            'subtotal' => $validated['amount'],
            'tax' => 0,
            'total' => $validated['amount'],
            'currency' => env('PAYPAL_CURRENCY', 'EUR'),
            'payment_method' => 'paypal',
            'status' => 'pending',
            'metadata' => json_encode([
                'plan_id' => $validated['plan_id'],
                'listing_title' => $listing->title,
            ]),
        ]);

        try {
            $planNames = [
                1 => 'Free Listing',
                2 => 'Standard - 30 days',
                3 => 'Featured - 30 days',
                4 => 'Boost - 7 days',
            ];
            
            $description = ($planNames[$validated['plan_id']] ?? 'Listing Promotion') . ' - ' . $listing->title;
            
            $paypalOrder = $this->paypal->createOrder(
                $validated['amount'],
                env('PAYPAL_CURRENCY', 'EUR'),
                $description,
                route('api.paypal.success') . '?order_id=' . $order->id,
                route('api.paypal.cancel') . '?order_id=' . $order->id
            );

            // Save PayPal order ID
            $order->update([
                'payment_id' => $paypalOrder['order_id'],
            ]);

            return response()->json([
                'order_id' => $order->id,
                'paypal_order_id' => $paypalOrder['order_id'],
                'approval_url' => $paypalOrder['approval_url'],
            ]);

        } catch (\Exception $e) {
            $order->update(['status' => 'failed']);
            
            return response()->json([
                'message' => 'Failed to create PayPal checkout',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle PayPal success callback
     */
    public function handleSuccess(Request $request)
    {
        $orderId = $request->query('order_id');
        $paypalOrderId = $request->query('token'); // PayPal sends 'token' param
        
        $order = Order::findOrFail($orderId);

        try {
            // Capture the payment
            $capture = $this->paypal->captureOrder($paypalOrderId);
            
            if ($capture['status'] === 'COMPLETED') {
                // Update order status to 'paid'
                $order->update([
                    'status' => 'paid',
                    'payment_id' => $capture['transaction_id'],
                    'paid_at' => now(),
                ]);
                
                // Apply promotion to listing
                $metadata = json_decode($order->metadata, true);
                $listing = Listing::find($order->listing_id);
                
                if ($listing && isset($metadata['plan_id'])) {
                    $planDurations = [
                        2 => 30, // Standard - 30 days
                        3 => 30, // Featured - 30 days
                        4 => 7,  // Boost - 7 days
                    ];
                    
                    $days = $planDurations[$metadata['plan_id']] ?? 30;
                    
                    $listing->update([
                        'is_featured' => $metadata['plan_id'] == 3,  // Only Featured gets this
                        'is_boosted' => $metadata['plan_id'] == 4,   // Only Boost gets this
                        'is_promoted' => in_array($metadata['plan_id'], [2, 3, 4]), // All paid plans
                        'featured_until' => now()->addDays($days),
                        'status' => 'active', // Ensure it's active
                    ]);
                    
                    \Log::info('Listing promoted', [
                        'listing_id' => $listing->id,
                        'plan' => $metadata['plan_id'],
                        'is_featured' => $listing->is_featured,
                        'is_boosted' => $listing->is_boosted,
                    ]);
                }
                
                // Redirect to success page
                return redirect(env('FRONTEND_URL', 'https://balkly.live') . '/payment/success?order=' . $order->id);
            }
            
            throw new \Exception('Payment not completed');
            
        } catch (\Exception $e) {
            Log::error('PayPal capture failed', ['error' => $e->getMessage()]);
            
            $order->update(['status' => 'failed']);
            
            return redirect(env('FRONTEND_URL', 'https://balkly.live') . '/payment/failed');
        }
    }

    /**
     * Handle PayPal cancel callback
     */
    public function handleCancel(Request $request)
    {
        $orderId = $request->query('order_id');
        
        if ($orderId) {
            $order = Order::find($orderId);
            if ($order) {
                $order->update(['status' => 'cancelled']);
            }
        }
        
        return redirect(env('FRONTEND_URL', 'https://balkly.live') . '/payment/cancelled');
    }
}

