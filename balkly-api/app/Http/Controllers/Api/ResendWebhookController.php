<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ResendWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // Verify webhook signature
        $signature = $request->header('svix-signature');
        $timestamp = $request->header('svix-timestamp');
        $webhookSecret = config('resend.webhook_secret');

        // Log the webhook event
        Log::info('Resend Webhook Received', [
            'type' => $request->input('type'),
            'email_id' => $request->input('data.email_id'),
            'payload' => $request->all(),
        ]);

        // Handle different event types
        $eventType = $request->input('type');

        switch ($eventType) {
            case 'email.received':
                // Forward incoming email to your actual email
                $this->forwardEmail($request->input('data'));
                break;
                
            case 'email.sent':
                // Email was successfully sent
                break;
            
            case 'email.delivered':
                // Email was delivered to recipient
                break;
            
            case 'email.opened':
                // Recipient opened the email
                break;
            
            case 'email.clicked':
                // Recipient clicked a link in the email
                break;
            
            case 'email.bounced':
                // Email bounced
                Log::warning('Email bounced', $request->all());
                break;
            
            case 'email.complained':
                // Recipient marked as spam
                Log::warning('Email marked as spam', $request->all());
                break;
        }

        return response()->json(['received' => true]);
    }

    /**
     * Forward incoming email to actual mailbox
     */
    protected function forwardEmail($emailData)
    {
        $apiKey = config('resend.api_key');
        $emailId = $emailData['email_id'] ?? null;
        
        if (!$emailId) {
            return;
        }

        // Determine where to forward based on recipient
        $to = $emailData['to'][0] ?? '';
        $from = $emailData['from'] ?? '';
        $subject = $emailData['subject'] ?? 'No Subject';
        
        // Route to appropriate mailbox
        $forwardTo = 'h.kravarevic@gmail.com'; // Default
        
        if (str_contains($to, 'support@')) {
            $forwardTo = 'h.kravarevic@gmail.com';
        } elseif (str_contains($to, 'info@')) {
            $forwardTo = 'h.kravarevic@gmail.com';
        } elseif (str_contains($to, 'haris.kravarevic@')) {
            $forwardTo = 'h.kravarevic@gmail.com';
        }

        // Get the full email content from Resend API
        $emailContent = \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
        ])->get("https://api.resend.com/emails/{$emailId}")->json();

        // Forward the email
        \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
            'from' => 'noreply@balkly.live',
            'to' => [$forwardTo],
            'subject' => "[Balkly - {$to}] {$subject}",
            'html' => "
                <div style='background: #f3f4f6; padding: 20px;'>
                    <div style='background: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;'>
                        <h3 style='color: #1E63FF;'>📧 New Email Received</h3>
                        <p><strong>To:</strong> {$to}</p>
                        <p><strong>From:</strong> {$from}</p>
                        <p><strong>Subject:</strong> {$subject}</p>
                        <hr style='margin: 20px 0;'>
                        <div style='background: #f9fafb; padding: 15px; border-left: 4px solid #1E63FF;'>
                            " . ($emailContent['html'] ?? $emailContent['text'] ?? 'No content') . "
                        </div>
                    </div>
                </div>
            ",
        ]);

        Log::info('Email forwarded', [
            'from' => $from,
            'to' => $to,
            'forwarded_to' => $forwardTo,
        ]);
    }
}

