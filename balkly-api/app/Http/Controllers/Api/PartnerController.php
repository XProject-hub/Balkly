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
    /** Public listing for the /partners user-facing page */
    public function publicIndex(Request $request)
    {
        $partners = Partner::where('is_active', true)
            ->with(['offers' => fn($q) => $q->where('is_active', true)->select('id', 'partner_id', 'title', 'description', 'benefit_type', 'benefit_value')])
            ->select('id', 'company_name', 'company_description', 'company_logo', 'website_url', 'address', 'city', 'phone')
            ->orderBy('company_name')
            ->get();

        return response()->json(['data' => $partners]);
    }

    /** Public single partner detail */
    public function publicShow($id)
    {
        $partner = Partner::where('is_active', true)
            ->with(['offers' => fn($q) => $q->where('is_active', true)])
            ->select('id', 'company_name', 'company_description', 'company_logo', 'website_url', 'address', 'city', 'phone')
            ->findOrFail($id);

        return response()->json(['partner' => $partner]);
    }

    public function index(Request $request)
    {
        $query = Partner::with(['user:id,name,email']);

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('company_name', 'like', "%{$s}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"));
            });
        }

        $partners = $query->orderBy('created_at', 'desc')->paginate(20);

        // Attach counts and commission safely (won't break if tables are missing)
        $partners->getCollection()->transform(function ($p) {
            try { $p->vouchers_count    = $p->vouchers()->count(); } catch (\Throwable $e) { $p->vouchers_count = 0; }
            try { $p->clicks_count      = $p->clicks()->count(); }   catch (\Throwable $e) { $p->clicks_count = 0; }
            try { $p->conversions_count = $p->conversions()->count(); } catch (\Throwable $e) { $p->conversions_count = 0; }
            try {
                $p->total_commission = (float) $p->conversions()
                    ->whereIn('status', ['confirmed', 'paid'])
                    ->sum('commission_amount');
            } catch (\Throwable $e) { $p->total_commission = 0.0; }
            return $p;
        });

        return response()->json($partners);
    }

    public function show($id)
    {
        $partner = Partner::with(['user.profile', 'staff.user', 'offers'])
            ->withCount(['vouchers', 'clicks', 'conversions', 'redemptions', 'visits'])
            ->findOrFail($id);

        $partner->total_commission = (float) $partner->conversions()
            ->whereIn('status', ['confirmed', 'paid'])
            ->sum('commission_amount');

        $partner->total_commission_pending = (float) $partner->conversions()
            ->where('status', 'pending')
            ->sum('commission_amount');

        $partner->monthly_summary = $partner->conversions()
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count, SUM(commission_amount) as commission")
            ->where('status', '!=', 'cancelled')
            ->groupBy('month')
            ->orderByDesc('month')
            ->limit(12)
            ->get();

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

    public function adminVisits(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);

        $query = $partner->visits()->with('user:id,name,email');

        if ($request->has('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $visits = $query->orderBy('created_at', 'desc')->paginate(50);

        return response()->json($visits);
    }
}
