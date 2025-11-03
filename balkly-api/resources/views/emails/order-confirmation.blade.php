<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .order-summary {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .total {
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
            padding-top: 15px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: #0f172a;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #6b7280;
            padding: 20px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">BALKLY</div>
        <p style="margin: 0; opacity: 0.9;">Thank you for your order!</p>
    </div>
    
    <div class="content">
        <h2>Order Confirmation</h2>
        <p>Hi {{ $order->buyer->name }},</p>
        <p>Thank you for your purchase! Your order has been confirmed and payment received.</p>
        
        <div class="order-summary">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <p><strong>Order Number:</strong> #{{ $order->id }}</p>
            <p><strong>Date:</strong> {{ $order->created_at->format('F d, Y') }}</p>
            
            <div style="margin-top: 20px;">
                @foreach($order->items as $item)
                <div class="order-item">
                    <span>
                        @if($item->item_type === 'listing_plan')
                            {{ $item->metadata['plan_name'] ?? 'Listing Plan' }}
                            <br><small style="color: #6b7280;">{{ $item->metadata['duration_days'] ?? 30 }} days</small>
                        @elseif($item->item_type === 'forum_sticky')
                            Forum Sticky Post
                            <br><small style="color: #6b7280;">{{ $item->metadata['duration_days'] ?? 7 }} days</small>
                        @elseif($item->item_type === 'ticket')
                            Event Ticket × {{ $item->quantity }}
                        @endif
                    </span>
                    <span><strong>€{{ number_format($item->total, 2) }}</strong></span>
                </div>
                @endforeach
                
                <div class="total">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Total:</span>
                        <span>€{{ number_format($order->total, 2) }}</span>
                    </div>
                </div>
            </div>
        </div>

        @if($order->invoice)
        <p>Your invoice is attached to this email and can also be downloaded from your dashboard.</p>
        <a href="{{ config('app.url') }}/dashboard/orders?order_id={{ $order->id }}" class="button">
            View Order Details
        </a>
        @endif

        <p style="margin-top: 30px;">If you have any questions about your order, please don't hesitate to contact us.</p>
    </div>
    
    <div class="footer">
        <p>© {{ date('Y') }} Balkly. All rights reserved.</p>
        <p>
            <a href="{{ config('app.url') }}/terms" style="color: #6b7280; text-decoration: none;">Terms</a> | 
            <a href="{{ config('app.url') }}/privacy" style="color: #6b7280; text-decoration: none;">Privacy</a> | 
            <a href="{{ config('app.url') }}/contact" style="color: #6b7280; text-decoration: none;">Contact</a>
        </p>
    </div>
</body>
</html>

