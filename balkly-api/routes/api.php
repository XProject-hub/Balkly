<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\ForumController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\AIController;

/*
|--------------------------------------------------------------------------
| API Routes (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // Public routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/auth/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');
    Route::post('/auth/social-login', [AuthController::class, 'socialLogin']);
    
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}/attributes', [CategoryController::class, 'attributes']);
    
    // Listings
    Route::get('/listings', [ListingController::class, 'index']);
    Route::get('/listings/{id}', [ListingController::class, 'show']);
    
    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    
    // Forum
    Route::get('/forum/categories', [ForumController::class, 'categories']);
    Route::get('/forum/topics', [ForumController::class, 'topics']);
    Route::get('/forum/topics/{id}', [ForumController::class, 'show']);
    
    // Search
    Route::get('/search', [SearchController::class, 'search']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/send-verification', [AuthController::class, 'sendVerificationEmail']);
        
        // 2FA Routes
        Route::post('/auth/2fa/enable', [AuthController::class, 'enable2FA']);
        Route::post('/auth/2fa/confirm', [AuthController::class, 'confirm2FA']);
        Route::post('/auth/2fa/verify', [AuthController::class, 'verify2FA']);
        Route::post('/auth/2fa/disable', [AuthController::class, 'disable2FA']);
        Route::get('/auth/2fa/recovery-codes', [AuthController::class, 'get2FARecoveryCodes']);
        
        // Listings
        Route::post('/listings', [ListingController::class, 'store']);
        Route::patch('/listings/{id}', [ListingController::class, 'update']);
        Route::delete('/listings/{id}', [ListingController::class, 'destroy']);
        Route::post('/listings/{id}/publish', [ListingController::class, 'publish']);
        Route::post('/listings/{id}/boost', [ListingController::class, 'boost']);
        
        // Media
        Route::post('/media/upload', [\App\Http\Controllers\Api\MediaController::class, 'upload']);
        Route::delete('/media/{id}', [\App\Http\Controllers\Api\MediaController::class, 'destroy']);
        Route::post('/media/reorder', [\App\Http\Controllers\Api\MediaController::class, 'reorder']);
        
        // Forum
        Route::post('/forum/topics', [ForumController::class, 'createTopic']);
        Route::post('/forum/posts', [ForumController::class, 'createPost']);
        Route::post('/forum/posts/{id}/sticky', [ForumController::class, 'makeSticky']);
        
        // Events (Organizer)
        Route::post('/events', [EventController::class, 'store']);
        Route::patch('/events/{id}', [EventController::class, 'update']);
        Route::post('/events/{id}/tickets', [EventController::class, 'createTicketType']);
        
        // Tickets
        Route::post('/ticket_orders', [EventController::class, 'purchaseTickets']);
        Route::post('/ticket/scan', [EventController::class, 'scanTicket']);
        
        // Chat
        Route::get('/chats', [ChatController::class, 'index']);
        Route::post('/chats/{listing_id}', [ChatController::class, 'start']);
        Route::post('/messages', [ChatController::class, 'sendMessage']);
        
        // Orders & Payments
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::post('/orders/listings', [OrderController::class, 'createListingOrder']);
        Route::post('/orders/sticky', [OrderController::class, 'createStickyOrder']);
        Route::post('/orders/tickets', [OrderController::class, 'createTicketOrder']);
        Route::post('/orders/{id}/refund', [OrderController::class, 'refund']);
        
        // Invoices
        Route::get('/invoices/{id}', [OrderController::class, 'invoice']);
        Route::get('/invoices/{id}/download', [OrderController::class, 'downloadInvoice']);
        
        // AI Helpers
        Route::post('/ai/listing_helper', [AIController::class, 'listingHelper']);
        Route::post('/ai/classify', [AIController::class, 'classify']);
        Route::post('/ai/moderate', [AIController::class, 'moderate']);
        
        // Reports
        Route::post('/reports', [ListingController::class, 'report']);
        
        // Admin Routes (role-protected)
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\Api\AdminController::class, 'dashboard']);
            Route::get('/moderation', [\App\Http\Controllers\Api\AdminController::class, 'moderationQueue']);
            Route::post('/approve', [\App\Http\Controllers\Api\AdminController::class, 'approve']);
            Route::post('/reject', [\App\Http\Controllers\Api\AdminController::class, 'reject']);
            Route::get('/analytics', [\App\Http\Controllers\Api\AdminController::class, 'analytics']);
            Route::get('/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
            Route::post('/users/{id}/ban', [\App\Http\Controllers\Api\AdminController::class, 'banUser']);
        });
    });
    
    // Webhooks (no auth, verified by signature)
    Route::post('/webhooks/stripe', [OrderController::class, 'stripeWebhook']);
    Route::post('/webhooks/checkout', [OrderController::class, 'checkoutWebhook']);
});

