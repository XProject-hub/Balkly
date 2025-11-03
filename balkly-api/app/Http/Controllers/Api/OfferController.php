<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Listing;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    /**
     * Get offers for a listing (seller)
     */
    public function getListingOffers($listingId)
    {
        $listing = Listing::where('user_id', auth()->id())->findOrFail($listingId);

        $offers = Offer::where('listing_id', $listingId)
            ->with(['buyer'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['offers' => $offers]);
    }

    /**
     * Get my offers (buyer)
     */
    public function getMyOffers()
    {
        $offers = Offer::where('buyer_id', auth()->id())
            ->with(['listing', 'seller'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['offers' => $offers]);
    }

    /**
     * Make an offer
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'amount' => 'required|numeric|min:0',
            'message' => 'nullable|string|max:500',
        ]);

        $listing = Listing::findOrFail($validated['listing_id']);

        // Can't offer on own listing
        if ($listing->user_id === auth()->id()) {
            return response()->json(['error' => 'Cannot make offer on your own listing'], 400);
        }

        $offer = Offer::create([
            'listing_id' => $validated['listing_id'],
            'buyer_id' => auth()->id(),
            'seller_id' => $listing->user_id,
            'amount' => $validated['amount'],
            'currency' => $listing->currency,
            'message' => $validated['message'] ?? null,
            'status' => 'pending',
            'expires_at' => now()->addDays(3),
        ]);

        return response()->json(['offer' => $offer], 201);
    }

    /**
     * Accept offer
     */
    public function accept($id)
    {
        $offer = Offer::findOrFail($id);
        
        // Verify seller owns the listing
        $listing = Listing::where('id', $offer->listing_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $offer->update(['status' => 'accepted']);

        // Reject all other pending offers
        Offer::where('listing_id', $offer->listing_id)
            ->where('id', '!=', $id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

        return response()->json([
            'offer' => $offer,
            'message' => 'Offer accepted',
        ]);
    }

    /**
     * Reject offer
     */
    public function reject($id)
    {
        $offer = Offer::findOrFail($id);
        
        // Verify seller owns the listing
        Listing::where('id', $offer->listing_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $offer->update(['status' => 'rejected']);

        return response()->json(['message' => 'Offer rejected']);
    }

    /**
     * Counter offer
     */
    public function counter(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'message' => 'nullable|string|max:500',
        ]);

        $originalOffer = Offer::findOrFail($id);
        
        // Verify seller owns the listing
        $listing = Listing::where('id', $originalOffer->listing_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Mark original as countered
        $originalOffer->update(['status' => 'countered']);

        // Create counter offer
        $counterOffer = Offer::create([
            'listing_id' => $originalOffer->listing_id,
            'buyer_id' => $originalOffer->buyer_id,
            'seller_id' => auth()->id(),
            'amount' => $validated['amount'],
            'currency' => $listing->currency,
            'message' => $validated['message'] ?? null,
            'status' => 'pending',
            'expires_at' => now()->addDays(3),
        ]);

        return response()->json([
            'offer' => $counterOffer,
            'message' => 'Counter offer sent',
        ]);
    }
}

