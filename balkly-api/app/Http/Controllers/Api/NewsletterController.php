<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterMail;
use App\Models\Newsletter;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'nullable|string|max:255',
        ]);

        $existing = NewsletterSubscriber::where('email', $validated['email'])->first();

        if ($existing) {
            if ($existing->is_active) {
                return response()->json(['message' => 'You are already subscribed!'], 200);
            }

            $existing->update([
                'is_active' => true,
                'name' => $validated['name'] ?? $existing->name,
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);

            return response()->json(['message' => 'Welcome back! You have been re-subscribed.']);
        }

        NewsletterSubscriber::create([
            'email' => $validated['email'],
            'name' => $validated['name'] ?? null,
            'subscribed_at' => now(),
        ]);

        return response()->json(['message' => 'Successfully subscribed to our newsletter!'], 201);
    }

    public function unsubscribe($token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->first();

        if (!$subscriber) {
            return response()->json(['message' => 'Invalid unsubscribe link.'], 404);
        }

        if (!$subscriber->is_active) {
            return response()->json(['message' => 'You are already unsubscribed.']);
        }

        $subscriber->update([
            'is_active' => false,
            'unsubscribed_at' => now(),
        ]);

        return response()->json(['message' => 'You have been unsubscribed. Sorry to see you go!']);
    }

    public function subscribers(Request $request)
    {
        $query = NewsletterSubscriber::query();

        if ($request->has('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('email', 'like', "%{$s}%")
                  ->orWhere('name', 'like', "%{$s}%");
            });
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $subscribers = $query->orderBy('created_at', 'desc')->paginate(50);

        $stats = [
            'total' => NewsletterSubscriber::count(),
            'active' => NewsletterSubscriber::where('is_active', true)->count(),
            'inactive' => NewsletterSubscriber::where('is_active', false)->count(),
        ];

        return response()->json([
            'subscribers' => $subscribers,
            'stats' => $stats,
        ]);
    }

    public function deleteSubscriber($id)
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);
        $subscriber->delete();

        return response()->json(['message' => 'Subscriber removed.']);
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $subscribers = NewsletterSubscriber::where('is_active', true)->get();

        if ($subscribers->isEmpty()) {
            return response()->json(['message' => 'No active subscribers to send to.'], 422);
        }

        $newsletter = Newsletter::create([
            'subject' => $validated['subject'],
            'content' => $validated['content'],
            'sent_by' => $request->user()->id,
            'recipients_count' => $subscribers->count(),
            'sent_at' => now(),
        ]);

        $appUrl = config('app.url', 'https://balkly.live');

        foreach ($subscribers->chunk(50) as $batch) {
            foreach ($batch as $subscriber) {
                $unsubscribeUrl = "{$appUrl}/api/v1/newsletter/unsubscribe/{$subscriber->token}";

                Mail::to($subscriber->email)->queue(
                    new NewsletterMail(
                        emailSubject: $validated['subject'],
                        htmlContent: $validated['content'],
                        unsubscribeUrl: $unsubscribeUrl,
                    )
                );
            }
        }

        return response()->json([
            'message' => "Newsletter queued for {$subscribers->count()} subscriber(s).",
            'newsletter' => $newsletter,
        ]);
    }

    public function history(Request $request)
    {
        $newsletters = Newsletter::with('sentByUser:id,name')
            ->orderBy('sent_at', 'desc')
            ->paginate(20);

        return response()->json($newsletters);
    }
}
