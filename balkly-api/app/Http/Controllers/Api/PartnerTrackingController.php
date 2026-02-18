<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\PartnerClick;
use Illuminate\Http\Request;

class PartnerTrackingController extends Controller
{
    public function redirect(Request $request, $trackingCode)
    {
        $partner = Partner::where('tracking_code', $trackingCode)
            ->where('is_active', true)
            ->firstOrFail();

        $userId = null;
        if ($request->user()) {
            $userId = $request->user()->id;
        }

        PartnerClick::create([
            'partner_id' => $partner->id,
            'user_id' => $userId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'referrer_url' => $request->header('Referer'),
            'landing_url' => $partner->website_url,
        ]);

        $destination = $partner->website_url;

        if (!$destination || !preg_match('/^https?:\/\//', $destination)) {
            return redirect('/');
        }

        return redirect()->away($destination);
    }
}
