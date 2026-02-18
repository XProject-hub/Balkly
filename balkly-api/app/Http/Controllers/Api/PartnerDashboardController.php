<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\PartnerClick;
use App\Models\PartnerConversion;
use App\Models\Voucher;
use App\Models\Redemption;
use Illuminate\Http\Request;

class PartnerDashboardController extends Controller
{
    private function getPartner(Request $request): Partner
    {
        $user = $request->user();
        $partner = $user->getPartnerEntity();

        if (!$partner) {
            abort(403, 'No partner account found.');
        }

        return $partner;
    }

    public function dashboard(Request $request)
    {
        $partner = $this->getPartner($request);
        $period = max(1, min(365, (int) $request->get('period', 30)));

        $stats = [
            'total_clicks' => $partner->clicks()->count(),
            'clicks_today' => $partner->clicks()->whereDate('created_at', today())->count(),
            'clicks_period' => $partner->clicks()->where('created_at', '>=', now()->subDays($period))->count(),

            'total_vouchers' => $partner->vouchers()->count(),
            'active_vouchers' => $partner->vouchers()->where('status', 'issued')->where('expires_at', '>', now())->count(),
            'redeemed_vouchers' => $partner->vouchers()->where('status', 'redeemed')->count(),

            'total_conversions' => $partner->conversions()->count(),
            'conversions_today' => $partner->conversions()->whereDate('created_at', today())->count(),
            'confirmed_conversions' => $partner->conversions()->where('status', 'confirmed')->count(),

            'total_commission' => (float) $partner->conversions()->whereIn('status', ['confirmed', 'paid'])->sum('commission_amount'),
            'commission_pending' => (float) $partner->conversions()->where('status', 'pending')->sum('commission_amount'),
            'commission_paid' => (float) $partner->conversions()->where('status', 'paid')->sum('commission_amount'),
        ];

        $clicksByDay = PartnerClick::where('partner_id', $partner->id)
            ->where('created_at', '>=', now()->subDays($period))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $conversionsByDay = PartnerConversion::where('partner_id', $partner->id)
            ->where('created_at', '>=', now()->subDays($period))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(commission_amount) as commission')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $recentRedemptions = Redemption::where('partner_id', $partner->id)
            ->with(['voucher.offer', 'staff'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'stats' => $stats,
            'clicks_by_day' => $clicksByDay,
            'conversions_by_day' => $conversionsByDay,
            'recent_redemptions' => $recentRedemptions,
            'partner' => $partner->only(['id', 'company_name', 'commission_type', 'commission_rate', 'tracking_code']),
        ]);
    }

    public function clicks(Request $request)
    {
        $partner = $this->getPartner($request);

        $clicks = $partner->clicks()
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($clicks);
    }

    public function conversions(Request $request)
    {
        $partner = $this->getPartner($request);

        $query = $partner->conversions()->with(['voucher', 'confirmedByUser:id,name']);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $conversions = $query->orderBy('created_at', 'desc')->paginate(50);

        return response()->json($conversions);
    }

    public function storeConversion(Request $request)
    {
        $partner = $this->getPartner($request);

        $validated = $request->validate([
            'type' => 'required|in:digital,physical',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $commissionAmount = $partner->calculateCommission($validated['amount']);

        $conversion = PartnerConversion::create([
            'partner_id' => $partner->id,
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'commission_rate' => $partner->commission_rate,
            'commission_amount' => $commissionAmount,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Conversion recorded successfully',
            'conversion' => $conversion,
        ], 201);
    }

    public function updateConversion(Request $request, $id)
    {
        $partner = $this->getPartner($request);

        $conversion = PartnerConversion::where('partner_id', $partner->id)->findOrFail($id);

        $validated = $request->validate([
            'amount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:pending,confirmed',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['amount'])) {
            $validated['commission_amount'] = $partner->calculateCommission($validated['amount']);
            $validated['commission_rate'] = $partner->commission_rate;
        }

        if (isset($validated['status']) && $validated['status'] === 'confirmed') {
            $validated['confirmed_at'] = now();
            $validated['confirmed_by'] = $request->user()->id;
        }

        $conversion->update($validated);

        return response()->json([
            'message' => 'Conversion updated',
            'conversion' => $conversion,
        ]);
    }
}
