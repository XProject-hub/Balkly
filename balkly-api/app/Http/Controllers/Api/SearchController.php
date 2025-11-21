<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Event;
use App\Models\ForumTopic;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $type = $request->get('type', 'all'); // all, listings, events, forum

        if (empty($query)) {
            return response()->json([
                'results' => [],
                'message' => 'Please provide a search query',
            ]);
        }

        $results = [];

        if ($type === 'all' || $type === 'listings') {
            // Use direct DB search instead of Scout (simpler, works immediately)
            $results['listings'] = Listing::with(['user', 'category', 'media'])
                ->where('status', 'active')
                ->where(function($q) use ($query) {
                    $q->where('title', 'LIKE', "%{$query}%")
                      ->orWhere('description', 'LIKE', "%{$query}%")
                      ->orWhereHas('listingAttributes', function($attr) use ($query) {
                          $attr->where('value', 'LIKE', "%{$query}%");
                      });
                })
                ->take(20)
                ->get();
        }

        if ($type === 'all' || $type === 'events') {
            // Use DB search for events
            $results['events'] = Event::with(['organizer'])
                ->where('status', 'published')
                ->where(function($q) use ($query) {
                    $q->where('title', 'LIKE', "%{$query}%")
                      ->orWhere('description', 'LIKE', "%{$query}%")
                      ->orWhere('venue', 'LIKE', "%{$query}%");
                })
                ->take(20)
                ->get();
        }

        if ($type === 'all' || $type === 'forum') {
            // Use DB search for forum
            $results['forum'] = ForumTopic::with(['user', 'category'])
                ->where('status', 'active')
                ->where(function($q) use ($query) {
                    $q->where('title', 'LIKE', "%{$query}%")
                      ->orWhere('content', 'LIKE', "%{$query}%");
                })
                ->take(20)
                ->get();
        }

        return response()->json([
            'query' => $query,
            'results' => $results,
        ]);
    }
}

