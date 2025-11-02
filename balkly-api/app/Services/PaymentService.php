<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Plan;
use App\Models\Listing;
use Illuminate\Support\Str;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\PaymentIntent;
use Stripe\Webhook;
use Exception;

class PaymentService
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret'));
        Stripe::setApiVersion(config('stripe.api_version'));
    }

    /**
     * Create a Stripe Checkout session for listing plan purchase
     */
    public function createListingCheckoutSession(Listing $listing, Plan $plan, $userId)
    {
        // Create order
        $order = Order::create([
            'buyer_id' => $userId,
            'subtotal' => $plan->price,
            'tax' => $this->calculateTax($plan->price),
            'total' => $plan->price + $this->calculateTax($plan->price),
            'currency' => $plan->currency,
            'status' => 'pending',
            'provider' => 'stripe',
        ]);

        // Create order item
        OrderItem::create([
            'order_id' => $order->id,
            'item_type' => 'listing_plan',
            'item_id' => $listing->id,
            'quantity' => 1,
            'unit_price' => $plan->price,
            'total' => $plan->price,
            'metadata' => [
                'plan_id' => $plan->id,
                'plan_name' => $plan->name,
                'duration_days' => $plan->duration_days,
            ],
        ]);

        // Create Stripe Checkout Session
        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => strtolower($plan->currency),
                        'product_data' => [
                            'name' => $plan->name . ' - Listing Plan',
                            'description' => "Listing: {$listing->title}",
                            'metadata' => [
                                'listing_id' => $listing->id,
                                'plan_id' => $plan->id,
                            ],
                        ],
                        'unit_amount' => $plan->price * 100, // Stripe uses cents
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => config('app.url') . '/dashboard/listings?payment=success&order_id=' . $order->id,
                'cancel_url' => config('app.url') . '/dashboard/listings?payment=cancelled',
                'client_reference_id' => $order->id,
                'customer_email' => $order->buyer->email,
                'metadata' => [
                    'order_id' => $order->id,
                    'listing_id' => $listing->id,
                    'plan_id' => $plan->id,
                    'user_id' => $userId,
                ],
            ]);

            // Update order with session info
            $order->update([
                'provider_session_id' => $session->id,
                'metadata' => [
                    'stripe_session_url' => $session->url,
                ],
            ]);

            return [
                'success' => true,
                'order' => $order,
                'session_id' => $session->id,
                'session_url' => $session->url,
            ];
        } catch (Exception $e) {
            // Mark order as failed
            $order->update(['status' => 'failed']);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Create a Stripe Checkout session for forum sticky purchase
     */
    public function createForumStickyCheckoutSession($topicId, Plan $plan, $userId)
    {
        $order = Order::create([
            'buyer_id' => $userId,
            'subtotal' => $plan->price,
            'tax' => $this->calculateTax($plan->price),
            'total' => $plan->price + $this->calculateTax($plan->price),
            'currency' => $plan->currency,
            'status' => 'pending',
            'provider' => 'stripe',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'item_type' => 'forum_sticky',
            'item_id' => $topicId,
            'quantity' => 1,
            'unit_price' => $plan->price,
            'total' => $plan->price,
            'metadata' => [
                'plan_id' => $plan->id,
                'duration_days' => $plan->duration_days,
            ],
        ]);

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => strtolower($plan->currency),
                        'product_data' => [
                            'name' => $plan->name . ' - Forum Sticky',
                            'description' => "Make your topic sticky for {$plan->duration_days} days",
                        ],
                        'unit_amount' => $plan->price * 100,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => config('app.url') . '/forum/topics/' . $topicId . '?payment=success',
                'cancel_url' => config('app.url') . '/forum/topics/' . $topicId . '?payment=cancelled',
                'client_reference_id' => $order->id,
                'metadata' => [
                    'order_id' => $order->id,
                    'topic_id' => $topicId,
                    'plan_id' => $plan->id,
                    'user_id' => $userId,
                ],
            ]);

            $order->update([
                'provider_session_id' => $session->id,
                'metadata' => ['stripe_session_url' => $session->url],
            ]);

            return [
                'success' => true,
                'order' => $order,
                'session_id' => $session->id,
                'session_url' => $session->url,
            ];
        } catch (Exception $e) {
            $order->update(['status' => 'failed']);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Create a Stripe Checkout session for ticket purchase
     */
    public function createTicketCheckoutSession($eventId, array $tickets, $userId)
    {
        $subtotal = 0;
        $ticketItems = [];

        foreach ($tickets as $ticketData) {
            $ticket = \App\Models\Ticket::findOrFail($ticketData['ticket_id']);
            $quantity = $ticketData['quantity'];
            $subtotal += $ticket->price * $quantity;

            $ticketItems[] = [
                'price_data' => [
                    'currency' => strtolower($ticket->currency),
                    'product_data' => [
                        'name' => $ticket->name,
                        'description' => $ticket->description ?? 'Event ticket',
                    ],
                    'unit_amount' => $ticket->price * 100,
                ],
                'quantity' => $quantity,
            ];
        }

        $tax = $this->calculateTax($subtotal);
        $total = $subtotal + $tax;

        $order = Order::create([
            'buyer_id' => $userId,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'currency' => 'EUR',
            'status' => 'pending',
            'provider' => 'stripe',
        ]);

        foreach ($tickets as $ticketData) {
            $ticket = \App\Models\Ticket::findOrFail($ticketData['ticket_id']);
            OrderItem::create([
                'order_id' => $order->id,
                'item_type' => 'ticket',
                'item_id' => $ticket->id,
                'quantity' => $ticketData['quantity'],
                'unit_price' => $ticket->price,
                'total' => $ticket->price * $ticketData['quantity'],
            ]);
        }

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $ticketItems,
                'mode' => 'payment',
                'success_url' => config('app.url') . '/events/' . $eventId . '/tickets?payment=success&order_id=' . $order->id,
                'cancel_url' => config('app.url') . '/events/' . $eventId . '?payment=cancelled',
                'client_reference_id' => $order->id,
                'metadata' => [
                    'order_id' => $order->id,
                    'event_id' => $eventId,
                    'user_id' => $userId,
                ],
            ]);

            $order->update([
                'provider_session_id' => $session->id,
                'metadata' => ['stripe_session_url' => $session->url],
            ]);

            return [
                'success' => true,
                'order' => $order,
                'session_id' => $session->id,
                'session_url' => $session->url,
            ];
        } catch (Exception $e) {
            $order->update(['status' => 'failed']);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle Stripe webhook events
     */
    public function handleWebhook($payload, $signature)
    {
        try {
            $event = Webhook::constructEvent(
                $payload,
                $signature,
                config('stripe.webhook_secret')
            );
        } catch (\UnexpectedValueException $e) {
            return ['error' => 'Invalid payload'];
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return ['error' => 'Invalid signature'];
        }

        // Handle different event types
        switch ($event->type) {
            case 'checkout.session.completed':
                $this->handleCheckoutCompleted($event->data->object);
                break;

            case 'payment_intent.succeeded':
                $this->handlePaymentSucceeded($event->data->object);
                break;

            case 'payment_intent.payment_failed':
                $this->handlePaymentFailed($event->data->object);
                break;

            case 'charge.refunded':
                $this->handleRefund($event->data->object);
                break;
        }

        return ['success' => true];
    }

    /**
     * Handle successful checkout session
     */
    protected function handleCheckoutCompleted($session)
    {
        $orderId = $session->client_reference_id ?? $session->metadata->order_id ?? null;

        if (!$orderId) {
            return;
        }

        $order = Order::find($orderId);
        if (!$order) {
            return;
        }

        // Update order status
        $order->update([
            'status' => 'paid',
            'paid_at' => now(),
            'provider_ref' => $session->payment_intent,
        ]);

        // Process the order based on item type
        foreach ($order->items as $item) {
            switch ($item->item_type) {
                case 'listing_plan':
                    $this->processListingPlan($item);
                    break;

                case 'forum_sticky':
                    $this->processForumSticky($item);
                    break;

                case 'ticket':
                    $this->processTicket($item);
                    break;
            }
        }

        // Generate invoice
        app(InvoiceService::class)->generateInvoice($order);
    }

    /**
     * Process listing plan purchase
     */
    protected function processListingPlan($orderItem)
    {
        $listing = Listing::find($orderItem->item_id);
        if (!$listing) return;

        $planId = $orderItem->metadata['plan_id'] ?? null;
        $plan = Plan::find($planId);

        if ($plan) {
            $listing->update([
                'status' => 'pending_review', // Or 'active' if auto-approve
                'published_at' => now(),
                'expires_at' => now()->addDays($plan->duration_days),
            ]);
        }
    }

    /**
     * Process forum sticky purchase
     */
    protected function processForumSticky($orderItem)
    {
        $topic = \App\Models\ForumTopic::find($orderItem->item_id);
        if (!$topic) return;

        $durationDays = $orderItem->metadata['duration_days'] ?? 7;

        $topic->update([
            'is_sticky' => true,
            'sticky_until' => now()->addDays($durationDays),
        ]);
    }

    /**
     * Process ticket purchase
     */
    protected function processTicket($orderItem)
    {
        $ticket = \App\Models\Ticket::find($orderItem->item_id);
        if (!$ticket) return;

        $ticketOrder = \App\Models\TicketOrder::create([
            'buyer_id' => $orderItem->order->buyer_id,
            'event_id' => $ticket->event_id,
            'order_id' => $orderItem->order_id,
            'order_number' => 'TKT-' . strtoupper(Str::random(10)),
            'total' => $orderItem->total,
            'currency' => $ticket->currency,
            'status' => 'paid',
            'buyer_name' => $orderItem->order->buyer->name,
            'buyer_email' => $orderItem->order->buyer->email,
        ]);

        // Generate QR codes for each ticket
        for ($i = 0; $i < $orderItem->quantity; $i++) {
            \App\Models\TicketQRCode::create([
                'ticket_order_id' => $ticketOrder->id,
                'ticket_id' => $ticket->id,
                'code' => 'BALKLY-' . strtoupper(Str::random(16)),
                'status' => 'valid',
                'issued_at' => now(),
            ]);
        }

        // Update ticket sold count
        $ticket->increment('sold', $orderItem->quantity);
    }

    /**
     * Handle successful payment
     */
    protected function handlePaymentSucceeded($paymentIntent)
    {
        // Additional payment success handling if needed
    }

    /**
     * Handle failed payment
     */
    protected function handlePaymentFailed($paymentIntent)
    {
        $order = Order::where('provider_ref', $paymentIntent->id)->first();
        if ($order) {
            $order->update(['status' => 'failed']);
        }
    }

    /**
     * Handle refund
     */
    protected function handleRefund($charge)
    {
        $order = Order::where('provider_ref', $charge->payment_intent)->first();
        if ($order) {
            $order->update(['status' => 'refunded']);
        }
    }

    /**
     * Process refund for an order
     */
    public function refundOrder(Order $order, $reason = null)
    {
        if ($order->status !== 'paid') {
            return ['success' => false, 'error' => 'Order cannot be refunded'];
        }

        try {
            $refund = \Stripe\Refund::create([
                'payment_intent' => $order->provider_ref,
                'reason' => $reason ?? 'requested_by_customer',
            ]);

            $order->update(['status' => 'refunded']);

            return ['success' => true, 'refund' => $refund];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Calculate tax based on amount
     */
    protected function calculateTax($amount)
    {
        // Simple VAT calculation - 20%
        // TODO: Make this configurable per country
        $vatRate = 0.20;
        return round($amount * $vatRate, 2);
    }
}

