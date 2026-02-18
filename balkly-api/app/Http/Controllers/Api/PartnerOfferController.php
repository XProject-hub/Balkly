<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\PartnerOffer;
use Illuminate\Http\Request;

class PartnerOfferController extends Controller
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

        $offers = $partner->offers()
            ->withCount('vouchers')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['offers' => $offers]);
    }

    public function store(Request $request)
    {
        $partner = $this->getPartner($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'benefit_type' => 'required|in:free_item,percent_off,fixed_off',
            'benefit_value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'terms' => 'nullable|string',
        ]);

        $offer = $partner->offers()->create($validated);

        return response()->json([
            'message' => 'Offer created successfully',
            'offer' => $offer,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $partner = $this->getPartner($request);

        $offer = PartnerOffer::where('partner_id', $partner->id)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'benefit_type' => 'sometimes|in:free_item,percent_off,fixed_off',
            'benefit_value' => 'sometimes|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'terms' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $offer->update($validated);

        return response()->json([
            'message' => 'Offer updated',
            'offer' => $offer,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $partner = $this->getPartner($request);

        $offer = PartnerOffer::where('partner_id', $partner->id)->findOrFail($id);
        $offer->update(['is_active' => false]);

        return response()->json(['message' => 'Offer deactivated']);
    }

    public function publicOffers($partnerId)
    {
        $partner = Partner::where('is_active', true)->findOrFail($partnerId);

        $offers = $partner->offers()
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'title', 'description', 'benefit_type', 'benefit_value', 'min_purchase', 'terms']);

        return response()->json([
            'partner' => $partner->only(['id', 'company_name', 'company_logo', 'company_description']),
            'offers' => $offers,
        ]);
    }
}
