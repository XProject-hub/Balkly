<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RamadanCodeView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RamadanController extends Controller
{
    /**
     * Authenticated user visits the Ramadan confirm page.
     * Records the view (first time only) and returns the promo code.
     */
    public function confirm(Request $request)
    {
        $user = Auth::user();

        // Record the visit (first time only - unique constraint on user_id)
        try {
            RamadanCodeView::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'ip_address' => $request->ip(),
                    'user_agent' => substr($request->userAgent() ?? '', 0, 500),
                ]
            );
        } catch (\Exception $e) {
            // If unique constraint fires for any reason, just continue
        }

        return response()->json([
            'code'        => 'Balkly26',
            'valid_until' => 'Ramazan 2026',
            'restaurant'  => 'Bosnian Marengo Restaurant',
            'location'    => 'Jumeirah Beach, Jumeirah 1, Dubai',
            'maps_url'    => 'https://www.google.com/maps/search/?api=1&query=Bosnian+Marengo+Restaurant+Dubai',
            'benefit'     => 'Besplatna domaća kafa ili čorba tokom iftara',
            'already_seen' => RamadanCodeView::where('user_id', $user->id)->exists(),
        ]);
    }

    /**
     * Admin: list all users who have seen the Ramadan code.
     */
    public function adminViews(Request $request)
    {
        $perPage = (int) $request->get('per_page', 50);
        $search  = $request->get('search', '');

        $query = RamadanCodeView::with('user:id,name,email')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $views = $query->paginate($perPage);

        return response()->json([
            'views' => $views,
            'total' => RamadanCodeView::count(),
        ]);
    }
}
