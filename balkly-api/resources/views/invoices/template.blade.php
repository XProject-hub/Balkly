<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            margin-bottom: 40px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
        }
        .company-details {
            float: left;
            width: 50%;
        }
        .invoice-details {
            float: right;
            width: 50%;
            text-align: right;
        }
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }
        .billing-details {
            margin: 30px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        th {
            background-color: #f0f0f0;
            padding: 10px;
            text-align: left;
            border-bottom: 2px solid #000;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .totals {
            float: right;
            width: 300px;
            margin-top: 20px;
        }
        .totals table {
            margin: 0;
        }
        .totals td {
            border: none;
            padding: 5px 10px;
        }
        .total-row {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #000 !important;
        }
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        h1 {
            margin: 0;
            font-size: 28px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #000;
        }
    </style>
</head>
<body>
    <div class="header clearfix">
        <div class="company-details">
            <div class="logo">BALKLY</div>
            <p>
                <strong>{{ $company['name'] }}</strong><br>
                {{ $company['address'] }}<br>
                {{ $company['city'] }}, {{ $company['country'] }}<br>
                VAT ID: {{ $company['vat_id'] }}<br>
                Email: {{ $company['email'] }}<br>
                Phone: {{ $company['phone'] }}
            </p>
        </div>
        <div class="invoice-details">
            <h1>INVOICE</h1>
            <p>
                <strong>Invoice Number:</strong> {{ $invoice->invoice_number }}<br>
                <strong>Date:</strong> {{ $invoice->issued_at->format('d.m.Y') }}<br>
                <strong>Order ID:</strong> #{{ $order->id }}
            </p>
        </div>
    </div>

    <div class="billing-details clearfix">
        <strong>Bill To:</strong><br>
        {{ $invoice->billing_details['name'] }}<br>
        @if(!empty($invoice->billing_details['address']))
            {{ $invoice->billing_details['address'] }}<br>
        @endif
        @if(!empty($invoice->billing_details['city']))
            {{ $invoice->billing_details['city'] }}, {{ $invoice->billing_details['country'] }}<br>
        @endif
        {{ $invoice->billing_details['email'] }}<br>
        @if(!empty($invoice->billing_details['vat_id']))
            VAT ID: {{ $invoice->billing_details['vat_id'] }}<br>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align: right;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>
                    @if($item->item_type === 'listing_plan')
                        {{ $item->metadata['plan_name'] ?? 'Listing Plan' }}
                        <br><small>{{ $item->metadata['duration_days'] ?? 30 }} days</small>
                    @elseif($item->item_type === 'forum_sticky')
                        Forum Sticky Post
                        <br><small>{{ $item->metadata['duration_days'] ?? 7 }} days</small>
                    @elseif($item->item_type === 'ticket')
                        Event Ticket
                    @else
                        {{ ucfirst(str_replace('_', ' ', $item->item_type)) }}
                    @endif
                </td>
                <td style="text-align: right;">{{ $item->quantity }}</td>
                <td style="text-align: right;">{{ number_format($item->unit_price, 2) }} {{ $order->currency }}</td>
                <td style="text-align: right;">{{ number_format($item->total, 2) }} {{ $order->currency }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">{{ number_format($order->subtotal, 2) }} {{ $order->currency }}</td>
            </tr>
            <tr>
                <td>VAT ({{ number_format($invoice->vat_rate, 0) }}%):</td>
                <td style="text-align: right;">{{ number_format($order->tax, 2) }} {{ $order->currency }}</td>
            </tr>
            <tr class="total-row">
                <td>Total:</td>
                <td style="text-align: right;">{{ number_format($order->total, 2) }} {{ $order->currency }}</td>
            </tr>
        </table>
    </div>

    <div style="clear: both;"></div>

    <div class="footer">
        <p>
            <strong>Payment Status:</strong> {{ ucfirst($order->status) }}
            @if($order->paid_at)
                <br>
                <strong>Paid on:</strong> {{ $order->paid_at->format('d.m.Y H:i') }}
            @endif
        </p>
        <p>
            Thank you for your business!<br>
            For any questions regarding this invoice, please contact {{ $company['email'] }}
        </p>
        <p style="margin-top: 20px; font-size: 10px;">
            This invoice was generated electronically and is valid without signature.
        </p>
    </div>
</body>
</html>

