<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class MediaController extends Controller
{
    /**
     * Upload media files
     */
    public function upload(Request $request)
    {
        $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'required|file|mimes:jpeg,jpg,png,gif,webp,bmp,tiff,tif,avif,heic,heif,svg,pdf,mp4,mov,avi,mkv|max:102400', // 100MB max
            'owner_type' => 'required|string',
            'owner_id' => 'required|integer',
        ]);

        $uploadedMedia = [];
        $files = $request->file('files');

        foreach ($files as $index => $file) {
            try {
                $media = $this->processAndStore($file, $request->owner_type, $request->owner_id, $index);
                $uploadedMedia[] = $media;
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Failed to upload file: ' . $file->getClientOriginalName(),
                    'message' => $e->getMessage(),
                ], 400);
            }
        }

        return response()->json([
            'media' => $uploadedMedia,
            'message' => 'Files uploaded successfully',
        ], 201);
    }

    /**
     * Process and store media file
     */
    protected function processAndStore($file, $ownerType, $ownerId, $order)
    {
        $mimeType = $file->getMimeType();
        $isImage = str_starts_with($mimeType, 'image/');
        $isVideo = str_starts_with($mimeType, 'video/');

        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = "media/{$ownerType}/{$ownerId}/";

        if ($isImage) {
            // Process image with Intervention Image
            $manager = new ImageManager(new Driver());
            $image = $manager->read($file);

            // Resize if too large (max 2000px width)
            if ($image->width() > 2000) {
                $image->scale(width: 2000);
            }

            // Optimize quality
            $encoded = $image->toJpeg(quality: 85);
            
            // Store original
            Storage::disk('s3')->put($path . $filename, $encoded);

            // Create thumbnail
            $thumb = $manager->read($file);
            $thumb->cover(400, 300);
            $thumbFilename = 'thumb_' . $filename;
            Storage::disk('s3')->put($path . $thumbFilename, $thumb->toJpeg(quality: 80));

            $url = Storage::disk('s3')->url($path . $filename);
            $thumbUrl = Storage::disk('s3')->url($path . $thumbFilename);

            $metadata = [
                'width' => $image->width(),
                'height' => $image->height(),
                'thumbnail_url' => $thumbUrl,
            ];
        } else {
            // Store video as-is
            $storedPath = Storage::disk('s3')->putFileAs($path, $file, $filename);
            $url = Storage::disk('s3')->url($storedPath);
            $metadata = null;
        }

        // Create media record
        $media = Media::create([
            'owner_type' => $ownerType,
            'owner_id' => $ownerId,
            'url' => $url,
            'type' => $isVideo ? 'video' : 'image',
            'mime_type' => $mimeType,
            'size' => $file->getSize(),
            'order' => $order,
            'metadata' => $metadata,
        ]);

        return $media;
    }

    /**
     * Delete media
     */
    public function destroy($id)
    {
        $media = Media::findOrFail($id);

        // Check ownership
        if ($media->owner_type === 'App\\Models\\Listing') {
            $listing = \App\Models\Listing::find($media->owner_id);
            if ($listing && $listing->user_id !== auth()->id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
        }

        // Delete from storage
        try {
            $path = parse_url($media->url, PHP_URL_PATH);
            Storage::disk('s3')->delete($path);
            
            // Delete thumbnail if exists
            if ($media->metadata && isset($media->metadata['thumbnail_url'])) {
                $thumbPath = parse_url($media->metadata['thumbnail_url'], PHP_URL_PATH);
                Storage::disk('s3')->delete($thumbPath);
            }
        } catch (\Exception $e) {
            // Continue even if storage deletion fails
        }

        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }

    /**
     * Reorder media
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'media_ids' => 'required|array',
            'media_ids.*' => 'required|integer|exists:media,id',
        ]);

        foreach ($request->media_ids as $index => $mediaId) {
            Media::where('id', $mediaId)->update(['order' => $index]);
        }

        return response()->json(['message' => 'Media reordered successfully']);
    }
}

