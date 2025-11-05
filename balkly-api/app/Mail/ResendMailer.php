<?php

namespace App\Mail;

use Illuminate\Support\Facades\Http;

class ResendMailer
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('resend.api_key');
    }

    public function send($to, $subject, $html, $from = null)
    {
        $from = $from ?? 'noreply@balkly.live';

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
            'from' => $from,
            'to' => is_array($to) ? $to : [$to],
            'subject' => $subject,
            'html' => $html,
        ]);

        return $response->json();
    }
}

