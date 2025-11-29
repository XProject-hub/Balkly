<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;

class PlanController extends Controller
{
    /**
     * Get all active plans
     */
    public function index()
    {
        $plans = Plan::where('is_active', true)
            ->orderBy('price', 'asc')
            ->get();

        return response()->json(['plans' => $plans]);
    }

    /**
     * Get plans for specific category
     */
    public function byCategory($categoryId)
    {
        $plans = Plan::where('category_id', $categoryId)
            ->where('is_active', true)
            ->orderBy('price', 'asc')
            ->get();

        return response()->json(['plans' => $plans]);
    }
}

