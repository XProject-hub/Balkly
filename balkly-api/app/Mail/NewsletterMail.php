<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $emailSubject,
        public string $htmlContent,
        public string $unsubscribeUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->emailSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml(),
        );
    }

    private function buildHtml(): string
    {
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f4f4f5; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                .header { background: #1a1a2e; padding: 32px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
                .content { padding: 32px; color: #1a1a2e; line-height: 1.6; font-size: 16px; }
                .content img { max-width: 100%; height: auto; }
                .footer { padding: 24px 32px; background: #f4f4f5; text-align: center; font-size: 13px; color: #71717a; }
                .footer a { color: #3b82f6; text-decoration: none; }
                .unsubscribe { margin-top: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Balkly</h1>
                </div>
                <div class="content">
                    {$this->htmlContent}
                </div>
                <div class="footer">
                    <p>You received this email because you subscribed to Balkly newsletter.</p>
                    <p class="unsubscribe">
                        <a href="{$this->unsubscribeUrl}">Unsubscribe</a> from future emails.
                    </p>
                </div>
            </div>
        </body>
        </html>
        HTML;
    }
}
