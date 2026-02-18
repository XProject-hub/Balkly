<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\PartnerStaff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PartnerController extends Controller
{
    public function index(Request $request)
    {
        $query = Partner::with(['user.profile', 'staff', 'offers']);

        if ($request->has('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('company_name', 'like', "%{$s}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"));
            });
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $partners = $query->withCount(['vouchers', 'clicks', 'conversions'])
            ->withSum('conversions as total_commission', 'commission_amount')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($partners);
    }

    public function show($id)
    {
        $partner = Partner::with(['user.profile', 'staff.user', 'offers'])
            ->withCount(['vouchers', 'clicks', 'conversions', 'redemptions'])
            ->withSum('conversions as total_commission', 'commission_amount')
            ->findOrFail($id);

        return response()->json(['partner' => $partner]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'company_name' => 'required|string|max:255',
            'company_logo' => 'nullable|string',
            'company_description' => 'nullable|string',
            'website_url' => 'nullable|url',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50',
            'contact_email' => 'nullable|email',
            'commission_type' => 'required|in:percent_of_bill,fixed_per_client,digital_referral_percent',
            'commission_rate' => 'required|numeric|min:0|max:10000',
            'default_voucher_duration_hours' => 'nullable|integer|min:0|max:23',
            'default_voucher_duration_days' => 'nullable|integer|min:0|max:365',
        ]);

        try {
            $partner = DB::transaction(function () use ($validated) {
                if (Partner::where('user_id', $validated['user_id'])->lockForUpdate()->exists()) {
                    throw new \RuntimeException('This user is already a partner.');
                }

                $partner = Partner::create($validated);

                $user = User::findOrFail($validated['user_id']);
                $user->update(['role' => 'partner']);

                PartnerStaff::create([
                    'partner_id' => $partner->id,
                    'user_id' => $user->id,
                    'role' => 'owner',
                ]);

                return $partner;
            });

            return response()->json([
                'message' => 'Partner created successfully',
                'partner' => $partner->load('user.profile'),
            ], 201);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);

        $validated = $request->validate([
            'company_name' => 'sometimes|string|max:255',
            'company_logo' => 'nullable|string',
            'company_description' => 'nullable|string',
            'website_url' => 'nullable|url',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50',
            'contact_email' => 'nullable|email',
            'commission_type' => 'sometimes|in:percent_of_bill,fixed_per_client,digital_referral_percent',
            'commission_rate' => 'sometimes|numeric|min:0|max:10000',
            'default_voucher_duration_hours' => 'sometimes|integer|min:0|max:23',
            'default_voucher_duration_days' => 'sometimes|integer|min:0|max:365',
            'is_active' => 'sometimes|boolean',
        ]);

        $partner->update($validated);

        return response()->json([
            'message' => 'Partner updated successfully',
            'partner' => $partner->load('user.profile'),
        ]);
    }

    public function destroy($id)
    {
        $partner = Partner::findOrFail($id);

        DB::transaction(function () use ($partner) {
            $partner->update(['is_active' => false]);
            $partner->user->update(['role' => 'user']);
            $partner->staff()->update(['is_active' => false]);
        });

        return response()->json(['message' => 'Partner deactivated successfully']);
    }
}
