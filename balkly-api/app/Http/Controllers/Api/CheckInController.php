<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\PartnerVisit;
use Illuminate\Http\Request;

class CheckInController extends Controller
{
    /** Public: fetch partner info before user logs in (to show on the check-in landing page) */
    public function info($trackingCode)
    {
        $partner = Partner::where('tracking_code', $trackingCode)
            ->where('is_active', true)
            ->select('id', 'company_name', 'company_logo', 'company_description', 'address', 'city', 'tracking_code')
            ->firstOrFail();

        return response()->json(['partner' => $partner]);
    }

    /** Authenticated: record a QR check-in */
    public function checkin(Request $request, $trackingCode)
    {
        $partner = Partner::where('tracking_code', $trackingCode)
            ->where('is_active', true)
            ->firstOrFail();

        $visit = PartnerVisit::create([
            'partner_id' => $partner->id,
            'user_id'    => $request->user()->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message'        => 'Check-in zabilježen!',
            'partner'        => $partner->only(['id', 'company_name', 'city']),
            'checked_in_at'  => $visit->created_at->toISOString(),
        ], 201);
    }
}
