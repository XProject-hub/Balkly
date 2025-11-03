<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PriceAlert;
use Illuminate\Http\Request;

class PriceAlertController extends Controller
{
    /**
     * Get my price alerts
     */
    public function index()
    {
        $alerts = PriceAlert::where('user_id', auth()->id())
            ->with('listing')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['alerts' => $alerts]);
    }

    /**
     * Create price alert
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'target_price' => 'required|numeric|min:0',
        ]);

        $alert = PriceAlert::create([
            'user_id' => auth()->id(),
            'listing_id' => $validated['listing_id'],
            'target_price' => $validated['target_price'],
            'currency' => 'EUR',
            'is_active' => true,
        ]);

        return response()->json(['alert' => $alert], 201);
    }

    /**
     * Delete price alert
     */
    public function destroy($id)
    {
        PriceAlert::where('user_id', auth()->id())
            ->where('id', $id)
            ->delete();

        return response()->json(['message' => 'Alert deleted']);
    }
}

