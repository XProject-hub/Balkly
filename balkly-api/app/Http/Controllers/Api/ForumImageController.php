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
            'images.*' => 'file|mimes:jpeg,jpg,png,gif,webp,bmp,tiff,tif,avif,heic,heif,svg|max:102400', // 100MB
        ]);

        $uploadedUrls = [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('forum/' . auth()->id(), 'public');
            // Use secure_url or build proper URL
            $url = config('app.url') . '/storage/' . $path;
            $uploadedUrls[] = $url;
        }

        return response()->json([
            'images' => $uploadedUrls,
            'message' => 'Images uploaded successfully',
        ]);
    }
}

