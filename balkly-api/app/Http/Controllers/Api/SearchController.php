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
            $results['listings'] = Listing::search($query)
                ->where('status', 'active')
                ->take(10)
                ->get();
        }

        if ($type === 'all' || $type === 'events') {
            $results['events'] = Event::search($query)
                ->where('status', 'published')
                ->take(10)
                ->get();
        }

        if ($type === 'all' || $type === 'forum') {
            $results['forum'] = ForumTopic::search($query)
                ->where('status', 'active')
                ->take(10)
                ->get();
        }

        return response()->json([
            'query' => $query,
            'results' => $results,
        ]);
    }
}

