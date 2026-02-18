<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\PartnerConversion;
use App\Models\PartnerOffer;
use App\Models\PartnerStaff;
use App\Models\Redemption;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoucherController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'partner_id' => 'required|exists:partners,id',
            'offer_id' => 'required|exists:partner_offers,id',
        ]);

        $partner = Partner::where('is_active', true)->findOrFail($validated['partner_id']);
        $offer = PartnerOffer::where('partner_id', $partner->id)
            ->where('is_active', true)
            ->findOrFail($validated['offer_id']);

        $existing = Voucher::where('user_id', $request->user()->id)
            ->where('partner_id', $partner->id)
            ->where('status', 'issued')
            ->where('expires_at', '>', now())
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You already have an active voucher for this partner.',
                'voucher' => $existing->load('offer'),
            ], 422);
        }

        $voucher = Voucher::create([
            'partner_id' => $partner->id,
            'offer_id' => $offer->id,
            'user_id' => $request->user()->id,
            'status' => 'issued',
            'expires_at' => now()->addHours($partner->default_voucher_duration_hours ?? 2),
        ]);

        $voucher->load(['partner:id,company_name', 'offer']);

        return response()->json([
            'message' => 'Voucher generated!',
            'voucher' => $voucher,
            'qr_url' => url("/v/{$voucher->code}"),
        ], 201);
    }

    public function show($code)
    {
        $voucher = Voucher::where('code', $code)
            ->with(['partner:id,company_name,company_logo', 'offer:id,title,description,benefit_type,benefit_value'])
            ->firstOrFail();

        if ($voucher->status === 'issued' && $voucher->isExpired()) {
            $voucher->update(['status' => 'expired']);
        }

        return response()->json([
            'voucher' => [
                'code' => $voucher->code,
                'status' => $voucher->status,
                'partner_name' => $voucher->partner->company_name,
                'partner_logo' => $voucher->partner->company_logo,
                'offer_title' => $voucher->offer?->title,
                'offer_description' => $voucher->offer?->description,
                'benefit_type' => $voucher->offer?->benefit_type,
                'benefit_value' => $voucher->offer?->benefit_value,
                'expires_at' => $voucher->expires_at,
                'is_expired' => $voucher->isExpired(),
                'is_redeemed' => $voucher->status === 'redeemed',
            ],
        ]);
    }

    public function staffShow(Request $request, $code)
    {
        $user = $request->user();
        $partner = $user->getPartnerEntity();

        if (!$partner) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $voucher = Voucher::where('code', $code)
            ->where('partner_id', $partner->id)
            ->with(['offer', 'user:id,name,email', 'redemption.staff:id,name'])
            ->firstOrFail();

        if ($voucher->status === 'issued' && $voucher->isExpired()) {
            $voucher->update(['status' => 'expired']);
        }

        return response()->json(['voucher' => $voucher]);
    }

    public function redeem(Request $request, $code)
    {
        $user = $request->user();
        $partner = $user->getPartnerEntity();

        if (!$partner) {
            return response()->json(['message' => 'Only staff can redeem vouchers.'], 403);
        }

        $validated = $request->validate([
            'amount' => 'nullable|numeric|min:0',
            'benefit_applied' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        try {
            $result = DB::transaction(function () use ($code, $user, $partner, $validated, $request) {
                $voucher = Voucher::where('code', $code)
                    ->where('partner_id', $partner->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($voucher->status === 'redeemed') {
                    throw new \RuntimeException('Voucher already redeemed.');
                }

                if ($voucher->isExpired()) {
                    $voucher->update(['status' => 'expired']);
                    throw new \RuntimeException('Voucher has expired.');
                }

                if ($voucher->status !== 'issued') {
                    throw new \RuntimeException("Voucher cannot be redeemed (status: {$voucher->status}).");
                }

                $redemption = Redemption::create([
                    'voucher_id' => $voucher->id,
                    'staff_id' => $user->id,
                    'partner_id' => $partner->id,
                    'amount' => $validated['amount'] ?? null,
                    'benefit_type' => $voucher->offer?->benefit_type,
                    'benefit_applied' => $validated['benefit_applied'] ?? null,
                    'notes' => $validated['notes'] ?? null,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);

                $voucher->update([
                    'status' => 'redeemed',
                    'redeemed_at' => now(),
                    'redeemed_by' => $user->id,
                ]);

                $billAmount = (float) ($validated['amount'] ?? 0);
                $commissionAmount = $billAmount > 0 ? $partner->calculateCommission($billAmount) : 0;

                $conversion = PartnerConversion::create([
                    'partner_id' => $partner->id,
                    'voucher_id' => $voucher->id,
                    'type' => 'physical',
                    'amount' => $billAmount,
                    'commission_rate' => $partner->commission_rate,
                    'commission_amount' => $commissionAmount,
                    'status' => 'confirmed',
                    'confirmed_at' => now(),
                    'confirmed_by' => $user->id,
                ]);

                return [
                    'redemption' => $redemption,
                    'conversion' => $conversion,
                ];
            });

            return response()->json([
                'message' => 'Voucher redeemed successfully!',
                'redeemed' => true,
                'redemption_id' => $result['redemption']->id,
                'commission' => $result['conversion']->commission_amount,
                'timestamp' => now()->toISOString(),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function staffRedemptions(Request $request)
    {
        $user = $request->user();
        $partner = $user->getPartnerEntity();

        if (!$partner) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Redemption::where('partner_id', $partner->id)
            ->with(['voucher.offer', 'voucher.user:id,name', 'staff:id,name']);

        if ($request->has('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $redemptions = $query->orderBy('created_at', 'desc')->paginate(50);

        return response()->json($redemptions);
    }

    public function userVouchers(Request $request)
    {
        $vouchers = Voucher::where('user_id', $request->user()->id)
            ->with(['partner:id,company_name,company_logo', 'offer:id,title,benefit_type,benefit_value'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($vouchers);
    }
}
