<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Listing;
use App\Services\PaymentService;
use App\Services\InvoiceService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $paymentService;
    protected $invoiceService;

    public function __construct(PaymentService $paymentService, InvoiceService $invoiceService)
    {
        $this->paymentService = $paymentService;
        $this->invoiceService = $invoiceService;
    }

    /**
     * Create listing plan order
     */
    public function createListingOrder(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'plan_id' => 'required|exists:plans,id',
        ]);

        $listing = Listing::where('user_id', auth()->id())
            ->findOrFail($validated['listing_id']);

        $plan = Plan::where('type', 'listing')
            ->where('is_active', true)
            ->findOrFail($validated['plan_id']);

        $result = $this->paymentService->createListingCheckoutSession(
            $listing,
            $plan,
            auth()->id()
        );

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error'],
            ], 400);
        }

        return response()->json([
            'order' => $result['order'],
            'checkout_url' => $result['session_url'],
            'session_id' => $result['session_id'],
        ], 201);
    }

    /**
     * Create forum sticky order
     */
    public function createStickyOrder(Request $request)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:forum_topics,id',
            'plan_id' => 'required|exists:plans,id',
        ]);

        $plan = Plan::where('type', 'sticky')
            ->where('is_active', true)
            ->findOrFail($validated['plan_id']);

        $result = $this->paymentService->createForumStickyCheckoutSession(
            $validated['topic_id'],
            $plan,
            auth()->id()
        );

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error'],
            ], 400);
        }

        return response()->json([
            'order' => $result['order'],
            'checkout_url' => $result['session_url'],
            'session_id' => $result['session_id'],
        ], 201);
    }

    /**
     * Create ticket order
     */
    public function createTicketOrder(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'tickets' => 'required|array|min:1',
            'tickets.*.ticket_id' => 'required|exists:tickets,id',
            'tickets.*.quantity' => 'required|integer|min:1|max:10',
        ]);

        $result = $this->paymentService->createTicketCheckoutSession(
            $validated['event_id'],
            $validated['tickets'],
            auth()->id()
        );

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error'],
            ], 400);
        }

        return response()->json([
            'order' => $result['order'],
            'checkout_url' => $result['session_url'],
            'session_id' => $result['session_id'],
        ], 201);
    }

    /**
     * Get order details
     */
    public function show($id)
    {
        $order = Order::where('buyer_id', auth()->id())
            ->with(['items', 'invoice'])
            ->findOrFail($id);

        return response()->json(['order' => $order]);
    }

    /**
     * Get user's orders
     */
    public function index(Request $request)
    {
        $orders = Order::where('buyer_id', auth()->id())
            ->with(['items'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($orders);
    }

    /**
     * Request refund
     */
    public function refund(Request $request, $id)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $order = Order::where('buyer_id', auth()->id())->findOrFail($id);

        $result = $this->paymentService->refundOrder($order, $validated['reason'] ?? null);

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error'],
            ], 400);
        }

        return response()->json([
            'message' => 'Refund processed successfully',
            'refund' => $result['refund'],
        ]);
    }

    /**
     * Get invoice
     */
    public function invoice($id)
    {
        try {
            $invoice = $this->invoiceService->getInvoice($id, auth()->id());

            return response()->json([
                'invoice' => $invoice,
                'download_url' => $invoice->pdf_url,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Invoice not found',
            ], 404);
        }
    }

    /**
     * Download invoice PDF
     */
    public function downloadInvoice($id)
    {
        try {
            $url = $this->invoiceService->downloadInvoice($id, auth()->id());

            return redirect($url);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Invoice not found',
            ], 404);
        }
    }

    /**
     * Stripe webhook handler
     */
    public function stripeWebhook(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        $result = $this->paymentService->handleWebhook($payload, $signature);

        if (isset($result['error'])) {
            return response()->json($result, 400);
        }

        return response()->json(['received' => true]);
    }

    /**
     * Generic checkout webhook handler
     */
    public function checkoutWebhook(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        try {
            $result = $this->paymentService->handleWebhook($payload, $signature);

            if (isset($result['error'])) {
                return response()->json($result, 400);
            }

            return response()->json(['received' => true]);
        } catch (\Exception $e) {
            \Log::error('Checkout webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }
}
