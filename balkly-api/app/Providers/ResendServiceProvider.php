<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Transport\Transport;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mime\MessageConverter;
use Illuminate\Support\Facades\Http;

class ResendServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Mail::extend('resend', function (array $config = []) {
            return new ResendTransport();
        });
    }
}

class ResendTransport extends Transport
{
    public function __toString(): string
    {
        return 'resend';
    }

    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());
        
        $apiKey = config('resend.api_key');
        
        $payload = [
            'from' => $email->getFrom()[0]->getAddress(),
            'to' => array_map(fn($addr) => $addr->getAddress(), $email->getTo()),
            'subject' => $email->getSubject(),
            'html' => $email->getHtmlBody(),
        ];

        if ($email->getTextBody()) {
            $payload['text'] = $email->getTextBody();
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', $payload);

        if ($response->failed()) {
            throw new \Exception('Resend API error: ' . $response->body());
        }
    }
}

