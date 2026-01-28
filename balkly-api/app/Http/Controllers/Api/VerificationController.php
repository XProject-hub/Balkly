<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VerificationController extends Controller
{
    /**
     * Request seller verification
     */
    public function requestVerification(Request $request)
    {
        $validated = $request->validate([
            'document_type' => 'required|in:id,business_license,tax_id',
            'document_url' => 'required|url',
        ]);

        DB::table('seller_verifications')->updateOrInsert(
            ['user_id' => auth()->id()],
            [
                'status' => 'pending',
                'document_type' => $validated['document_type'],
                'document_url' => $validated['document_url'],
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        return response()->json(['message' => 'Verification request submitted']);
    }

    /**
     * Admin: Approve verification
     */
    public function approve($userId)
    {
        DB::table('seller_verifications')
            ->where('user_id', $userId)
            ->update([
                'status' => 'verified',
                'verified_by' => auth()->id(),
                'verified_at' => now(),
                'updated_at' => now(),
            ]);

        User::find($userId)->update(['is_verified_seller' => true]);

        return response()->json(['message' => 'Seller verified']);
    }

    /**
     * Admin: Get pending verifications
     */
    public function pending()
    {
        $verifications = DB::table('seller_verifications')
            ->where('status', 'pending')
            ->join('users', 'seller_verifications.user_id', '=', 'users.id')
            ->select('seller_verifications.*', 'users.name', 'users.email')
            ->get();

        return response()->json(['verifications' => $verifications]);
    }

    /**
     * Admin: Reject verification
     */
    public function reject(Request $request, $userId)
    {
        $reason = $request->input('reason', 'No reason provided');

        DB::table('seller_verifications')
            ->where('user_id', $userId)
            ->update([
                'status' => 'rejected',
                'rejection_reason' => $reason,
                'verified_by' => auth()->id(),
                'updated_at' => now(),
            ]);

        return response()->json(['message' => 'Verification rejected']);
    }
}

