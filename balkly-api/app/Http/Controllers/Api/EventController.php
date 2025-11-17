<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketOrder;
use App\Models\TicketQRCode;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with(['organizer', 'tickets'])
            ->where('status', 'published');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        // Show events from yesterday onwards (not too strict)
        $query->where('start_at', '>=', now()->subDay())
              ->orderBy('start_at');

        $events = $query->paginate(20);

        return response()->json($events);
    }

    public function show($id)
    {
        $event = Event::with(['organizer.profile', 'tickets' => function($q) {
            $q->where('is_active', true);
        }])->findOrFail($id);

        return response()->json(['event' => $event]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:affiliate,own',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'venue' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|size:2',
            'start_at' => 'required|date',
            'end_at' => 'nullable|date|after:start_at',
            'partner_url' => 'nullable|url',
            'partner_ref' => 'nullable|string|max:100',
            'image_url' => 'nullable|url',
        ]);

        $event = Event::create([
            'organizer_id' => auth()->id(),
            'type' => $validated['type'],
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(8),
            'description' => $validated['description'] ?? null,
            'venue' => $validated['venue'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'start_at' => $validated['start_at'],
            'end_at' => $validated['end_at'] ?? null,
            'partner_url' => $validated['partner_url'] ?? null,
            'partner_ref' => $validated['partner_ref'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'status' => 'draft',
        ]);

        return response()->json([
            'event' => $event,
            'message' => 'Event created successfully',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $event = Event::where('organizer_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'venue' => 'sometimes|string',
            'start_at' => 'sometimes|date',
            'end_at' => 'sometimes|date',
        ]);

        $event->update($validated);

        return response()->json([
            'event' => $event,
            'message' => 'Event updated successfully',
        ]);
    }

    public function createTicketType(Request $request, $id)
    {
        $event = Event::where('organizer_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'nullable|integer|min:1',
        ]);

        $ticket = $event->tickets()->create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'currency' => 'EUR',
            'capacity' => $validated['capacity'] ?? null,
            'is_active' => true,
        ]);

        return response()->json([
            'ticket' => $ticket,
            'message' => 'Ticket type created successfully',
        ], 201);
    }

    public function purchaseTickets(Request $request)
    {
        // TODO: Implement ticket purchase flow with payment
        return response()->json([
            'message' => 'Ticket purchase pending payment implementation',
        ]);
    }

    public function scanTicket(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $qrCode = TicketQRCode::where('code', $validated['code'])->first();

        if (!$qrCode) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'QR code not found',
            ], 404);
        }

        if ($qrCode->status !== 'valid') {
            return response()->json([
                'status' => $qrCode->status,
                'message' => 'QR code already used or invalid',
            ], 400);
        }

        // Mark as used (idempotent)
        $qrCode->update([
            'status' => 'used',
            'used_at' => now(),
            'scanned_by' => auth()->id(),
        ]);

        return response()->json([
            'status' => 'valid',
            'ticket' => $qrCode->load(['ticketOrder', 'ticket']),
            'message' => 'Ticket scanned successfully',
        ]);
    }
}

