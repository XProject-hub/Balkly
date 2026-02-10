<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    /**
     * Get list of jobs with filtering and pagination
     */
    public function index(Request $request)
    {
        $query = Job::active()->orderBy('created_date', 'desc');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('company', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Filter by city
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by contract type
        if ($request->filled('contract_type')) {
            $query->where('contract_type', $request->contract_type);
        }

        // Filter by salary range
        if ($request->filled('salary_min')) {
            $query->where('salary_min', '>=', $request->salary_min);
        }
        if ($request->filled('salary_max')) {
            $query->where('salary_max', '<=', $request->salary_max);
        }

        $jobs = $query->paginate($request->input('per_page', 20));

        return response()->json($jobs);
    }

    /**
     * Get a single job
     */
    public function show($id)
    {
        $job = Job::findOrFail($id);
        
        return response()->json(['job' => $job]);
    }

    /**
     * Get job categories with counts
     */
    public function categories()
    {
        $categories = Job::active()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();

        return response()->json(['categories' => $categories]);
    }

    /**
     * Get featured/latest jobs for homepage
     */
    public function featured(Request $request)
    {
        $limit = $request->input('limit', 6);

        $jobs = Job::active()
            ->orderBy('created_date', 'desc')
            ->limit($limit)
            ->get();

        return response()->json(['jobs' => $jobs]);
    }
}
