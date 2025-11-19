<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ForumImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'images' => 'required|array|max:5',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB
        ]);

        $uploadedUrls = [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('forum/' . auth()->id(), 'public');
            $url = url('/storage/' . $path);
            $uploadedUrls[] = $url;
        }

        return response()->json([
            'images' => $uploadedUrls,
            'message' => 'Images uploaded successfully',
        ]);
    }
}

