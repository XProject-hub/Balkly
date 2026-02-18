<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\PartnerStaff;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PartnerStaffController extends Controller
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

    public function index(Request $request)
    {
        $partner = $this->getPartner($request);

        $staff = $partner->staff()
            ->with('user:id,name,email,role')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['staff' => $staff]);
    }

    public function store(Request $request)
    {
        $partner = $this->getPartner($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:staff,manager',
        ]);

        $staffMember = DB::transaction(function () use ($partner, $validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'staff',
                'email_verified_at' => now(),
            ]);

            Profile::create(['user_id' => $user->id]);

            $staffRecord = PartnerStaff::create([
                'partner_id' => $partner->id,
                'user_id' => $user->id,
                'role' => $validated['role'],
            ]);

            return $staffRecord->load('user:id,name,email');
        });

        return response()->json([
            'message' => 'Staff member created successfully',
            'staff' => $staffMember,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $partner = $this->getPartner($request);

        $staffRecord = PartnerStaff::where('partner_id', $partner->id)->findOrFail($id);

        if ($staffRecord->role === 'owner') {
            return response()->json(['message' => 'Cannot modify owner account.'], 403);
        }

        $validated = $request->validate([
            'role' => 'sometimes|in:staff,manager',
            'is_active' => 'sometimes|boolean',
            'name' => 'sometimes|string|max:255',
        ]);

        DB::transaction(function () use ($staffRecord, $validated) {
            if (isset($validated['role']) || isset($validated['is_active'])) {
                $staffRecord->update(array_intersect_key($validated, array_flip(['role', 'is_active'])));
            }

            if (isset($validated['name'])) {
                $staffRecord->user->update(['name' => $validated['name']]);
            }

            if (isset($validated['is_active']) && !$validated['is_active']) {
                $staffRecord->user->update(['role' => 'user']);
            }
        });

        return response()->json([
            'message' => 'Staff member updated',
            'staff' => $staffRecord->fresh()->load('user:id,name,email'),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $partner = $this->getPartner($request);

        $staffRecord = PartnerStaff::where('partner_id', $partner->id)->findOrFail($id);

        if ($staffRecord->role === 'owner') {
            return response()->json(['message' => 'Cannot remove owner.'], 403);
        }

        $staffRecord->update(['is_active' => false]);
        $staffRecord->user->update(['role' => 'user']);

        return response()->json(['message' => 'Staff member deactivated']);
    }
}
