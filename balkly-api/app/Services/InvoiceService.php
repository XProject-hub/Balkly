<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    /**
     * Generate invoice PDF for an order
     */
    public function generateInvoice(Order $order)
    {
        if ($order->status !== 'paid') {
            throw new \Exception('Cannot generate invoice for unpaid order');
        }

        // Check if invoice already exists
        if ($order->invoice) {
            return $order->invoice;
        }

        // Generate invoice number
        $invoiceNumber = $this->generateInvoiceNumber();

        // Determine VAT details
        $vatCountry = $order->buyer->profile->country ?? 'BA';
        $vatRate = $this->getVatRate($vatCountry);

        // Calculate totals
        $totals = [
            'subtotal' => $order->subtotal,
            'vat' => $order->tax,
            'total' => $order->total,
            'currency' => $order->currency,
        ];

        // Create invoice record
        $invoice = Invoice::create([
            'user_id' => $order->buyer_id,
            'order_id' => $order->id,
            'invoice_number' => $invoiceNumber,
            'vat_country' => $vatCountry,
            'vat_rate' => $vatRate,
            'totals_json' => $totals,
            'billing_details' => [
                'name' => $order->buyer->name,
                'email' => $order->buyer->email,
                'address' => $order->buyer->profile->address ?? null,
                'city' => $order->buyer->profile->city ?? null,
                'country' => $vatCountry,
                'vat_id' => $order->buyer->profile->vat_id ?? null,
            ],
            'issued_at' => now(),
        ]);

        // Generate PDF
        $pdfPath = $this->generatePDF($invoice, $order);
        
        // Update invoice with PDF URL
        $invoice->update(['pdf_url' => $pdfPath]);

        return $invoice;
    }

    /**
     * Generate PDF document
     */
    protected function generatePDF(Invoice $invoice, Order $order)
    {
        $data = [
            'invoice' => $invoice,
            'order' => $order->load(['buyer.profile', 'items']),
            'company' => [
                'name' => 'Balkly Platform',
                'address' => 'Your Company Address',
                'city' => 'Sarajevo',
                'country' => 'Bosnia and Herzegovina',
                'email' => 'billing@balkly.com',
                'phone' => '+387 XX XXX XXX',
                'vat_id' => 'BA123456789',
            ],
        ];

        $pdf = Pdf::loadView('invoices.template', $data);
        
        // Save PDF to storage
        $filename = "invoices/{$invoice->invoice_number}.pdf";
        Storage::disk('s3')->put($filename, $pdf->output());

        return Storage::disk('s3')->url($filename);
    }

    /**
     * Generate unique invoice number
     */
    protected function generateInvoiceNumber()
    {
        $year = date('Y');
        $lastInvoice = Invoice::whereYear('issued_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastInvoice ? (int) substr($lastInvoice->invoice_number, -6) + 1 : 1;

        return sprintf('INV-%s-%06d', $year, $sequence);
    }

    /**
     * Get VAT rate for country
     */
    protected function getVatRate($countryCode)
    {
        $vatRates = [
            'BA' => 17.00, // Bosnia and Herzegovina
            'HR' => 25.00, // Croatia
            'RS' => 20.00, // Serbia
            'ME' => 21.00, // Montenegro
            'SI' => 22.00, // Slovenia
            'AT' => 20.00, // Austria
            'DE' => 19.00, // Germany
            // Add more countries as needed
        ];

        return $vatRates[$countryCode] ?? 20.00;
    }

    /**
     * Get invoice by ID
     */
    public function getInvoice($invoiceId, $userId)
    {
        $invoice = Invoice::where('id', $invoiceId)
            ->where('user_id', $userId)
            ->with('order.items')
            ->firstOrFail();

        return $invoice;
    }

    /**
     * Download invoice PDF
     */
    public function downloadInvoice($invoiceId, $userId)
    {
        $invoice = $this->getInvoice($invoiceId, $userId);

        if (!$invoice->pdf_url) {
            // Generate if not exists
            $order = $invoice->order;
            $this->generatePDF($invoice, $order);
            $invoice->refresh();
        }

        return $invoice->pdf_url;
    }
}

