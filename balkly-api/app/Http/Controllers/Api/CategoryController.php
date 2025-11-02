<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('order')
            ->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function attributes($id)
    {
        $category = Category::with('attributes')->findOrFail($id);

        return response()->json([
            'category' => $category,
            'attributes' => $category->attributes,
        ]);
    }
}

