<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $token;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     * Using Resend API channel
     */
    public function via($notifiable): array
    {
        return [ResendPasswordChannel::class];
    }

    /**
     * Get the Resend mail representation.
     */
    public function toResend($notifiable): array
    {
        $resetUrl = config('app.frontend_url', 'https://balkly.live') . '/auth/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->email);
        $name = $notifiable->name;

        return [
            'to' => $notifiable->email,
            'subject' => 'Reset Your Password - Balkly',
            'html' => $this->buildHtml($name, $resetUrl),
        ];
    }

    /**
     * Build HTML email content
     */
    protected function buildHtml($name, $resetUrl): string
    {
        return "
        <div style='background: #f3f4f6; padding: 40px 20px;'>
            <div style='background: white; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;'>
                <div style='text-align: center; margin-bottom: 30px;'>
                    <h1 style='color: #1E63FF; margin: 0; font-size: 28px;'>🔐 Password Reset</h1>
                </div>
                
                <p style='color: #374151; font-size: 16px; line-height: 1.6;'>Hello <strong>{$name}</strong>!</p>
                
                <p style='color: #374151; font-size: 16px; line-height: 1.6;'>
                    You are receiving this email because we received a password reset request for your Balkly account.
                </p>
                
                <div style='text-align: center; margin: 35px 0;'>
                    <a href='{$resetUrl}' style='background: linear-gradient(135deg, #1E63FF 0%, #7C3AED 100%); color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;'>
                        Reset Password
                    </a>
                </div>
                
                <p style='color: #6b7280; font-size: 14px; line-height: 1.6;'>
                    This password reset link will expire in <strong>60 minutes</strong>.
                </p>
                
                <p style='color: #6b7280; font-size: 14px; line-height: 1.6;'>
                    If you did not request a password reset, no further action is required. Your password will remain unchanged.
                </p>
                
                <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>
                
                <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                    If the button doesn't work, copy and paste this link:<br>
                    <a href='{$resetUrl}' style='color: #1E63FF; word-break: break-all;'>{$resetUrl}</a>
                </p>
                
                <p style='color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;'>
                    © " . date('Y') . " Balkly. All rights reserved.<br>
                    <a href='https://balkly.live' style='color: #1E63FF;'>balkly.live</a>
                </p>
            </div>
        </div>
        ";
    }
}

/**
 * Custom notification channel for Resend API (Password Reset)
 */
class ResendPasswordChannel
{
    public function send($notifiable, Notification $notification)
    {
        $data = $notification->toResend($notifiable);
        
        $apiKey = config('resend.api_key');
        
        if (!$apiKey) {
            Log::error('Resend API key not configured');
            return;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.resend.com/emails', [
                'from' => 'Balkly <noreply@balkly.live>',
                'to' => [$data['to']],
                'subject' => $data['subject'],
                'html' => $data['html'],
            ]);

            if (!$response->successful()) {
                Log::error('Resend password reset email failed', [
                    'to' => $data['to'],
                    'response' => $response->json(),
                ]);
            } else {
                Log::info('Password reset email sent via Resend', ['to' => $data['to']]);
            }
        } catch (\Exception $e) {
            Log::error('Resend password reset email exception', [
                'to' => $data['to'],
                'error' => $e->getMessage(),
            ]);
        }
    }
}

