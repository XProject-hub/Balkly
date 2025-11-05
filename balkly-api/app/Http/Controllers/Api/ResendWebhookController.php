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
}

