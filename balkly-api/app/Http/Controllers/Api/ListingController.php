<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::query()
            ->with(['user', 'category', 'media'])
            ->where('status', 'active');

        // Filters - use filled() to ignore empty strings
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        if ($request->filled('country')) {
            $query->where('country', $request->country);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        // Filter by promotion status (is_promoted = Standard, Featured, or Boosted)
        if ($request->filled('is_promoted')) {
            $query->where('is_promoted', (bool)$request->is_promoted);
        }

        // Sorting - Promoted first, then by selected sort
        if ($request->get('is_promoted')) {
            $query->orderBy('is_promoted', 'desc')
                  ->orderBy('created_at', 'desc');
        } else {
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);
        }

        $listings = $query->paginate($request->get('per_page', 20));

        return response()->json($listings);
    }

    public function show($id)
    {
        $listing = Listing::with(['user.profile', 'category', 'media', 'listingAttributes.attribute'])
            ->findOrFail($id);

        // Increment views
        $listing->increment('views_count');

        // Get similar/related listings
        $similarListings = Listing::where('category_id', $listing->category_id)
            ->where('id', '!=', $listing->id)
            ->where('status', 'active')
            ->with(['media'])
            ->inRandomOrder()
            ->take(6)
            ->get();

        return response()->json([
            'listing' => $listing,
            'similar_listings' => $similarListings,
            'schema' => $this->generateSchema($listing),
        ]);
    }

    /**
     * Get current user's listings (all statuses)
     */
    public function myListings(Request $request)
    {
        $query = Listing::query()
            ->with(['category', 'media'])
            ->where('user_id', auth()->id());

        // Sort by most recent first
        $query->orderBy('created_at', 'desc');

        $listings = $query->paginate($request->get('per_page', 20));

        return response()->json($listings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|size:2',
            'attributes' => 'nullable|array',
        ]);

        $listing = DB::transaction(function () use ($request, $validated) {
            $listing = Listing::create([
                'user_id' => auth()->id(),
                'category_id' => $validated['category_id'],
                'title' => $validated['title'],
                'slug' => Str::slug($validated['title']) . '-' . Str::random(8),
                'description' => $validated['description'],
                'price' => $validated['price'] ?? null,
                'currency' => $validated['currency'] ?? 'AED',
                'city' => $validated['city'] ?? null,
                'country' => $validated['country'] ?? null,
                'status' => 'active', // Changed from draft to active for immediate visibility
            ]);

            // Handle attributes
            if (!empty($validated['attributes'])) {
                foreach ($validated['attributes'] as $attributeId => $value) {
                    $listing->listingAttributes()->create([
                        'attribute_id' => $attributeId,
                        'value' => $value,
                    ]);
                }
            }

            return $listing;
        });

        return response()->json([
            'listing' => $listing->fresh(['category', 'media', 'user']),
            'message' => 'Listing created successfully',
        ], 201);
    }

    /**
     * Generic media upload (for forum, messages, etc.)
     */
    public function uploadGenericMedia(Request $request)
    {
        $request->validate([
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif,webp|max:5120',
        ]);

        $uploadedMedia = [];

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('uploads/' . auth()->id(), 'public');
            
            $media = \App\Models\Media::create([
                'owner_type' => 'App\\Models\\User',
                'owner_id' => auth()->id(),
                'url' => '/storage/' . $path,
                'type' => 'image',
                'mime_type' => $image->getMimeType(),
                'size' => $image->getSize(),
                'order' => $index,
            ]);

            $uploadedMedia[] = $media;
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'media' => $uploadedMedia,
        ]);
    }

    /**
     * Upload media for listing
     */
    public function uploadMedia(Request $request, $id)
    {
        $listing = Listing::where('user_id', auth()->id())->findOrFail($id);

        $request->validate([
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
        ]);

        $uploadedMedia = [];

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('listings/' . $listing->id, 'public');
            
            $media = \App\Models\Media::create([
                'owner_type' => 'App\\Models\\Listing',
                'owner_id' => $listing->id,
                'url' => '/storage/' . $path,
                'type' => 'image',
                'mime_type' => $image->getMimeType(),
                'size' => $image->getSize(),
                'order' => $index,
            ]);

            $uploadedMedia[] = $media;
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'media' => $uploadedMedia,
        ]);
    }

    public function update(Request $request, $id)
    {
        $listing = Listing::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'city' => 'sometimes|string|max:100',
            'country' => 'sometimes|string|size:2',
        ]);

        $listing->update($validated);

        return response()->json([
            'listing' => $listing->fresh(['category', 'media']),
            'message' => 'Listing updated successfully',
        ]);
    }

    public function destroy($id)
    {
        // Admin can delete any listing, users can only delete their own
        if (auth()->user()->isAdmin()) {
            $listing = Listing::findOrFail($id);
            \Log::info('Admin deleted listing', ['listing_id' => $id, 'admin_id' => auth()->id()]);
        } else {
            $listing = Listing::where('user_id', auth()->id())->findOrFail($id);
        }
        
        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }

    public function publish($id)
    {
        $listing = Listing::where('user_id', auth()->id())->findOrFail($id);

        // Set to pending review for moderation
        $listing->update([
            'status' => 'pending_review',
        ]);

        return response()->json([
            'listing' => $listing,
            'message' => 'Listing submitted for review',
        ]);
    }

    public function boost(Request $request, $id)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $listing = Listing::where('user_id', auth()->id())->findOrFail($id);

        // Boost payment handled by OrderController

        return response()->json([
            'message' => 'Ready for boost checkout',
            'listing' => $listing,
        ]);
    }

    public function report(Request $request)
    {
        $validated = $request->validate([
            'target_type' => 'required|string',
            'target_id' => 'required|integer',
            'reason' => 'required|in:spam,inappropriate,fraud,duplicate,copyright,other',
            'description' => 'nullable|string',
        ]);

        $report = Report::create([
            'reporter_id' => auth()->id(),
            'target_type' => $validated['target_type'],
            'target_id' => $validated['target_id'],
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'report' => $report,
            'message' => 'Report submitted successfully',
        ], 201);
    }

    /**
     * Generate Schema.org JSON-LD for listing
     */
    protected function generateSchema($listing)
    {
        $images = $listing->media->pluck('url')->toArray();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $listing->title,
            'description' => $listing->description,
            'image' => $images,
            'offers' => [
                '@type' => 'Offer',
                'price' => $listing->price,
                'priceCurrency' => $listing->currency,
                'availability' => 'https://schema.org/InStock',
                'url' => config('app.url') . '/listings/' . $listing->id,
                'seller' => [
                    '@type' => 'Person',
                    'name' => $listing->user->name,
                ],
            ],
            'category' => $listing->category->name,
        ];
    }
}
