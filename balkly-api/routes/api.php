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
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\JobController;

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
    
    // 2FA Verify - PUBLIC (users verify during login, before they have token)
    Route::post('/auth/2fa/verify', [AuthController::class, 'verify2FA']);
    
    // Resend verification email - PUBLIC (users can't login to resend)
    Route::post('/auth/resend-verification', [AuthController::class, 'resendVerificationEmail']);
    
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}/attributes', [CategoryController::class, 'attributes']);
    
    // Listings
    Route::get('/listings', [ListingController::class, 'index']);
    Route::get('/listings/{id}', [ListingController::class, 'show'])->where('id', '[0-9]+');
    
    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    
    // Jobs (from Adzuna)
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/featured', [JobController::class, 'featured']);
    Route::get('/jobs/categories', [JobController::class, 'categories']);
    Route::get('/jobs/{id}', [JobController::class, 'show']);
    
    // Forum
    Route::get('/forum/categories', [ForumController::class, 'categories']);
    Route::get('/forum/topics', [ForumController::class, 'topics']);
    Route::get('/forum/topics/{id}', [ForumController::class, 'show']);
    Route::post('/forum/topics/{id}/report', [ForumController::class, 'reportTopic'])->middleware('auth:sanctum');
    
    // Search
    Route::get('/search', [SearchController::class, 'search']);
    
    // Currency (public - anyone can get rates and convert)
    Route::get('/currency/rates', [CurrencyController::class, 'getRates']);
    Route::post('/currency/convert', [CurrencyController::class, 'convert']);
    Route::get('/currency/supported', [CurrencyController::class, 'getSupportedCurrencies']);
    
    // Translation (public - anyone can translate)
    Route::post('/translate', [\App\Http\Controllers\Api\TranslationController::class, 'translate']);
    Route::post('/translate/batch', [\App\Http\Controllers\Api\TranslationController::class, 'translateBatch']);
    
    // PayPal Callbacks (public - PayPal calls these)
    Route::get('/paypal/success', [\App\Http\Controllers\Api\PayPalController::class, 'handleSuccess'])->name('api.paypal.success');
    Route::get('/paypal/cancel', [\App\Http\Controllers\Api\PayPalController::class, 'handleCancel'])->name('api.paypal.cancel');
    
    // Analytics tracking (public - track all visitors)
    Route::post('/analytics/track', [\App\Http\Controllers\Api\AnalyticsController::class, 'trackVisit']);
    
    // Partner tracking redirect (public)
    Route::get('/go/{trackingCode}', [\App\Http\Controllers\Api\PartnerTrackingController::class, 'redirect']);
    
    // Public voucher view (rate limited)
    Route::get('/vouchers/{code}', [\App\Http\Controllers\Api\VoucherController::class, 'show']);
    
    // Public partner offers
    Route::get('/partners/{id}/offers', [\App\Http\Controllers\Api\PartnerOfferController::class, 'publicOffers']);
    
    // Newsletter (public)
    Route::post('/newsletter/subscribe', [\App\Http\Controllers\Api\NewsletterController::class, 'subscribe']);
    Route::get('/newsletter/unsubscribe/{token}', [\App\Http\Controllers\Api\NewsletterController::class, 'unsubscribe']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/send-verification', [AuthController::class, 'sendVerificationEmail']);
        Route::delete('/auth/delete-account', [AuthController::class, 'deleteAccount']);
        // Profile
        Route::get('/profile', [\App\Http\Controllers\Api\ProfileController::class, 'show']);
        Route::patch('/profile/update', [\App\Http\Controllers\Api\ProfileController::class, 'update']);
        Route::post('/profile/avatar', [\App\Http\Controllers\Api\ProfileController::class, 'uploadAvatar']);
        Route::get('/profile/insights', [\App\Http\Controllers\Api\ProfileController::class, 'insights']);
        Route::post('/profile/change-password', [\App\Http\Controllers\Api\ProfileController::class, 'changePassword']);
        
        // 2FA Routes (authenticated users only)
        Route::post('/auth/2fa/enable', [AuthController::class, 'enable2FA']);
        Route::post('/auth/2fa/confirm', [AuthController::class, 'confirm2FA']);
        Route::post('/auth/2fa/disable', [AuthController::class, 'disable2FA']);
        Route::get('/auth/2fa/recovery-codes', [AuthController::class, 'get2FARecoveryCodes']);
        
        // Listings
        Route::get('/listings/my-listings', [ListingController::class, 'myListings']);
        Route::post('/listings', [ListingController::class, 'store']);
        Route::patch('/listings/{id}', [ListingController::class, 'update']);
        Route::delete('/listings/{id}', [ListingController::class, 'destroy']);
        Route::post('/listings/{id}/publish', [ListingController::class, 'publish']);
        Route::post('/listings/{id}/boost', [ListingController::class, 'boost']);
        Route::post('/listings/{id}/media', [ListingController::class, 'uploadMedia']);
        
        // Chats & Messages
        Route::get('/chats', [ChatController::class, 'index']);
        Route::post('/chats/start/{listingId}', [ChatController::class, 'start']);
        Route::get('/chats/{id}/messages', [ChatController::class, 'messages']);
        Route::post('/chats/messages', [ChatController::class, 'sendMessage']);
        
        // Media
        Route::post('/media/upload', [\App\Http\Controllers\Api\MediaController::class, 'upload']);
        Route::delete('/media/{id}', [\App\Http\Controllers\Api\MediaController::class, 'destroy']);
        Route::post('/media/reorder', [\App\Http\Controllers\Api\MediaController::class, 'reorder']);
        
        // Forum
        Route::post('/forum/topics', [ForumController::class, 'createTopic']);
        Route::patch('/forum/topics/{id}', [ForumController::class, 'updateTopic']);
        Route::post('/forum/topics/{id}/like', [ForumController::class, 'likeTopic']);
        Route::post('/forum/topics/{id}/watch', [ForumController::class, 'toggleWatch']);
        Route::post('/forum/topics/{id}/lock', [ForumController::class, 'toggleLock']);
        Route::post('/forum/posts', [ForumController::class, 'createPost']);
        Route::post('/forum/posts/{id}/sticky', [ForumController::class, 'makeSticky']);
        Route::post('/forum/posts/{id}/like', [ForumController::class, 'likePost']);
        Route::post('/forum/posts/{id}/best-answer', [ForumController::class, 'markBestAnswer']);
        Route::patch('/forum/posts/{id}', [ForumController::class, 'updatePost']);
        Route::post('/forum/upload-images', [\App\Http\Controllers\Api\ForumImageController::class, 'upload']);
        Route::post('/forum/react', [ForumController::class, 'react']);
        
        // Events (Organizer)
        Route::post('/events', [EventController::class, 'store']);
        Route::patch('/events/{id}', [EventController::class, 'update']);
        Route::post('/events/{id}/tickets', [EventController::class, 'createTicketType']);
        
        // Tickets
        Route::post('/ticket_orders', [EventController::class, 'purchaseTickets']);
        Route::post('/ticket/scan', [EventController::class, 'scanTicket']);
        
        // (duplicate chat routes removed - defined above)
        
        // Orders & Payments
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::post('/orders/listings', [OrderController::class, 'createListingOrder']);
        Route::post('/orders/sticky', [OrderController::class, 'createStickyOrder']);
        Route::post('/orders/tickets', [OrderController::class, 'createTicketOrder']);
        Route::post('/orders/{id}/refund', [OrderController::class, 'refund']);
        
        // PayPal Checkout (authenticated users)
        Route::post('/paypal/checkout', [\App\Http\Controllers\Api\PayPalController::class, 'createCheckout']);
        
        // Invoices
        Route::get('/invoices/{id}', [OrderController::class, 'invoice']);
        Route::get('/invoices/{id}/download', [OrderController::class, 'downloadInvoice']);
        
        // AI Helpers
        Route::post('/ai/listing_helper', [AIController::class, 'listingHelper']);
        Route::post('/ai/classify', [AIController::class, 'classify']);
        Route::post('/ai/moderate', [AIController::class, 'moderate']);
        
        // Reports
        Route::post('/reports', [ListingController::class, 'report']);
        
        // Reviews
        Route::get('/reviews/user/{userId}', [\App\Http\Controllers\Api\ReviewController::class, 'getUserReviews']);
        Route::post('/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'store']);
        
        // Favorites
        Route::get('/favorites', [\App\Http\Controllers\Api\FavoriteController::class, 'index']);
        Route::post('/favorites', [\App\Http\Controllers\Api\FavoriteController::class, 'store']);
        Route::delete('/favorites/{id}', [\App\Http\Controllers\Api\FavoriteController::class, 'destroy']);
        Route::post('/favorites/check', [\App\Http\Controllers\Api\FavoriteController::class, 'check']);
        
        // Saved Searches
        Route::get('/saved-searches', [\App\Http\Controllers\Api\SavedSearchController::class, 'index']);
        Route::post('/saved-searches', [\App\Http\Controllers\Api\SavedSearchController::class, 'store']);
        Route::patch('/saved-searches/{id}', [\App\Http\Controllers\Api\SavedSearchController::class, 'update']);
        Route::delete('/saved-searches/{id}', [\App\Http\Controllers\Api\SavedSearchController::class, 'destroy']);
        
        // Offers
        Route::get('/offers/my', [\App\Http\Controllers\Api\OfferController::class, 'getMyOffers']);
        Route::get('/offers/listing/{listingId}', [\App\Http\Controllers\Api\OfferController::class, 'getListingOffers']);
        Route::post('/offers', [\App\Http\Controllers\Api\OfferController::class, 'store']);
        Route::post('/offers/{id}/accept', [\App\Http\Controllers\Api\OfferController::class, 'accept']);
        Route::post('/offers/{id}/reject', [\App\Http\Controllers\Api\OfferController::class, 'reject']);
        Route::post('/offers/{id}/counter', [\App\Http\Controllers\Api\OfferController::class, 'counter']);
        
        // Price Alerts
        Route::get('/price-alerts', [\App\Http\Controllers\Api\PriceAlertController::class, 'index']);
        Route::post('/price-alerts', [\App\Http\Controllers\Api\PriceAlertController::class, 'store']);
        Route::delete('/price-alerts/{id}', [\App\Http\Controllers\Api\PriceAlertController::class, 'destroy']);
        
        // Seller Verification
        Route::post('/verification/request', [\App\Http\Controllers\Api\VerificationController::class, 'requestVerification']);
        
        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
        
        // KB Article Feedback
        Route::post('/kb/{id}/feedback', [\App\Http\Controllers\Api\KnowledgeBaseController::class, 'feedback']);
        
        // Voucher generation (any authenticated user)
        Route::post('/vouchers', [\App\Http\Controllers\Api\VoucherController::class, 'store']);
        Route::get('/my-vouchers', [\App\Http\Controllers\Api\VoucherController::class, 'userVouchers']);
        
        // Partner routes (role: partner or staff)
        Route::middleware('role:partner,staff')->prefix('partner')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\Api\PartnerDashboardController::class, 'dashboard']);
            Route::get('/clicks', [\App\Http\Controllers\Api\PartnerDashboardController::class, 'clicks']);
            Route::get('/conversions', [\App\Http\Controllers\Api\PartnerDashboardController::class, 'conversions']);
            Route::post('/conversions', [\App\Http\Controllers\Api\PartnerDashboardController::class, 'storeConversion']);
            Route::patch('/conversions/{id}', [\App\Http\Controllers\Api\PartnerDashboardController::class, 'updateConversion']);
            Route::get('/offers', [\App\Http\Controllers\Api\PartnerOfferController::class, 'index']);
            Route::post('/offers', [\App\Http\Controllers\Api\PartnerOfferController::class, 'store']);
            Route::patch('/offers/{id}', [\App\Http\Controllers\Api\PartnerOfferController::class, 'update']);
            Route::delete('/offers/{id}', [\App\Http\Controllers\Api\PartnerOfferController::class, 'destroy']);
        });
        
        // Partner-only routes (staff management)
        Route::middleware('role:partner')->prefix('partner')->group(function () {
            Route::get('/staff', [\App\Http\Controllers\Api\PartnerStaffController::class, 'index']);
            Route::post('/staff', [\App\Http\Controllers\Api\PartnerStaffController::class, 'store']);
            Route::patch('/staff/{id}', [\App\Http\Controllers\Api\PartnerStaffController::class, 'update']);
            Route::delete('/staff/{id}', [\App\Http\Controllers\Api\PartnerStaffController::class, 'destroy']);
        });
        
        // Staff routes (voucher redeem)
        Route::middleware('role:partner,staff')->prefix('staff')->group(function () {
            Route::get('/vouchers/{code}', [\App\Http\Controllers\Api\VoucherController::class, 'staffShow']);
            Route::post('/vouchers/{code}/redeem', [\App\Http\Controllers\Api\VoucherController::class, 'redeem']);
            Route::get('/redemptions', [\App\Http\Controllers\Api\VoucherController::class, 'staffRedemptions']);
        });
        
        // Admin Routes (role-protected)
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\Api\AdminController::class, 'dashboard']);
            Route::get('/moderation', [\App\Http\Controllers\Api\AdminController::class, 'moderationQueue']);
            Route::post('/approve', [\App\Http\Controllers\Api\AdminController::class, 'approve']);
            Route::post('/reject', [\App\Http\Controllers\Api\AdminController::class, 'reject']);
            Route::get('/analytics', [\App\Http\Controllers\Api\AnalyticsController::class, 'getAnalytics']);
            Route::get('/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
            Route::post('/users/{id}/ban', [\App\Http\Controllers\Api\AdminController::class, 'banUser']);
            Route::post('/users/{id}/role', [\App\Http\Controllers\Api\AdminController::class, 'changeUserRole']);
            Route::post('/users/{id}/verify-email', [\App\Http\Controllers\Api\AdminController::class, 'verifyUserEmail']);
            Route::delete('/users/{id}', [\App\Http\Controllers\Api\AdminController::class, 'deleteUser']);
            
            // Platform Settings
            Route::get('/settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);
            Route::patch('/settings', [\App\Http\Controllers\Api\SettingController::class, 'update']);
            
            // Newsletter Management
            Route::get('/newsletter/subscribers', [\App\Http\Controllers\Api\NewsletterController::class, 'subscribers']);
            Route::delete('/newsletter/subscribers/{id}', [\App\Http\Controllers\Api\NewsletterController::class, 'deleteSubscriber']);
            Route::post('/newsletter/send', [\App\Http\Controllers\Api\NewsletterController::class, 'send']);
            Route::get('/newsletter/history', [\App\Http\Controllers\Api\NewsletterController::class, 'history']);
            
            // Partner Management
            Route::get('/partners', [\App\Http\Controllers\Api\PartnerController::class, 'index']);
            Route::get('/partners/{id}', [\App\Http\Controllers\Api\PartnerController::class, 'show']);
            Route::post('/partners', [\App\Http\Controllers\Api\PartnerController::class, 'store']);
            Route::patch('/partners/{id}', [\App\Http\Controllers\Api\PartnerController::class, 'update']);
            Route::delete('/partners/{id}', [\App\Http\Controllers\Api\PartnerController::class, 'destroy']);
            
            // Ad Banner Management
            Route::get('/banners', [\App\Http\Controllers\Api\AdBannerController::class, 'index']);
            Route::post('/banners', [\App\Http\Controllers\Api\AdBannerController::class, 'store']);
            Route::patch('/banners/{id}', [\App\Http\Controllers\Api\AdBannerController::class, 'update']);
            Route::delete('/banners/{id}', [\App\Http\Controllers\Api\AdBannerController::class, 'destroy']);
            
            // Seller Verification Management
            Route::get('/verification/pending', [\App\Http\Controllers\Api\VerificationController::class, 'pending']);
            Route::post('/verification/{userId}/approve', [\App\Http\Controllers\Api\VerificationController::class, 'approve']);
            Route::post('/verification/{userId}/reject', [\App\Http\Controllers\Api\VerificationController::class, 'reject']);
            
            // Blog Management
            Route::post('/blog', [\App\Http\Controllers\Api\BlogController::class, 'store']);
            Route::patch('/blog/{id}', [\App\Http\Controllers\Api\BlogController::class, 'update']);
            Route::delete('/blog/{id}', [\App\Http\Controllers\Api\BlogController::class, 'destroy']);
            
            // Blog Category Management
            Route::post('/blog/categories', [\App\Http\Controllers\Api\BlogController::class, 'storeCategory']);
            Route::patch('/blog/categories/{id}', [\App\Http\Controllers\Api\BlogController::class, 'updateCategory']);
            Route::delete('/blog/categories/{id}', [\App\Http\Controllers\Api\BlogController::class, 'destroyCategory']);
            
            // Knowledge Base Management
            Route::post('/kb/articles', [\App\Http\Controllers\Api\KnowledgeBaseController::class, 'store']);
            Route::patch('/kb/articles/{id}', [\App\Http\Controllers\Api\KnowledgeBaseController::class, 'update']);
            Route::delete('/kb/articles/{id}', [\App\Http\Controllers\Api\KnowledgeBaseController::class, 'destroy']);
            
            // Forum Category Management
            Route::post('/forum/categories', [ForumController::class, 'createCategory']);
            Route::patch('/forum/categories/{id}', [ForumController::class, 'updateCategory']);
            Route::delete('/forum/categories/{id}', [ForumController::class, 'deleteCategory']);
            
            // Forum Admin - Delete Topics & Posts
            Route::delete('/forum/topics/{id}', [ForumController::class, 'deleteTopic']);
            Route::delete('/forum/posts/{id}', [ForumController::class, 'deletePost']);
            
            // Forum Admin - Pin/Lock Topics
            Route::post('/forum/topics/{id}/pin', [ForumController::class, 'togglePin']);
            Route::post('/forum/topics/{id}/lock', [ForumController::class, 'toggleLock']);
            
            // Event Admin - Delete Events
            Route::delete('/events/{id}', [\App\Http\Controllers\Api\EventController::class, 'destroy']);
            
            // Listing Admin - Delete Listings
            Route::delete('/listings/{id}', [ListingController::class, 'destroy']);
            
            // Visitor Details - Real-time (unique by IP, last 5 min)
            Route::get('/visits', function(Request $request) {
                // Get unique visitors from last 5 minutes, grouped by IP
                $visits = \App\Models\PageVisit::with('user')
                    ->where('visited_at', '>=', now()->subMinutes(5))
                    ->orderBy('visited_at', 'desc')
                    ->get()
                    ->groupBy('ip_address')
                    ->map(function($group) {
                        // Return only the most recent visit for each IP
                        return $group->first();
                    })
                    ->values();
                
                return response()->json(['visits' => $visits]);
            });
            
            // Clean old visits (run periodically)
            Route::post('/visits/cleanup', function() {
                // Delete visits older than 5 minutes
                \App\Models\PageVisit::where('visited_at', '<', now()->subMinutes(5))->delete();
                return response()->json(['cleaned' => true]);
            });
        });
    });
    
    // Public banner endpoints
    Route::get('/banners/{position}', [\App\Http\Controllers\Api\AdBannerController::class, 'getByPosition']);
    Route::post('/banners/{id}/impression', [\App\Http\Controllers\Api\AdBannerController::class, 'trackImpression']);
    Route::post('/banners/{id}/click', [\App\Http\Controllers\Api\AdBannerController::class, 'trackClick']);
    
    // User profiles and reputation (public)
    // IMPORTANT: Static routes must come BEFORE dynamic routes!
    Route::get('/users/leaderboard', [UserController::class, 'leaderboard']);
    Route::get('/users/{id}', [UserController::class, 'show'])->where('id', '[0-9]+');
    
    // Plans (public)
    Route::get('/plans', [\App\Http\Controllers\Api\PlanController::class, 'index']);
    Route::get('/plans/category/{categoryId}', [\App\Http\Controllers\Api\PlanController::class, 'byCategory']);
    
    // Online users tracking
    Route::get('/online/count', [\App\Http\Controllers\Api\OnlineUsersController::class, 'count']);
    Route::post('/online/track', [\App\Http\Controllers\Api\OnlineUsersController::class, 'track']);
    
    // Blog (public)
    Route::get('/blog', [\App\Http\Controllers\Api\BlogController::class, 'index']);
    Route::get('/blog/categories', [\App\Http\Controllers\Api\BlogController::class, 'categories']);
    Route::get('/blog/{slug}', [\App\Http\Controllers\Api\BlogController::class, 'show']);
    
    // Knowledge Base (public)
    Route::get('/kb/categories', [\App\Http\Controllers\Api\KnowledgeBaseController::class, 'categories']);
    Route::get('/kb/search', [\App\Http\Controllers\Api\KnowledgeBaseController::class, 'search']);
    Route::get('/kb/{slug}', [\App\Http\Controllers\Api\KnowledgeBaseController::class, 'show']);
    Route::post('/kb/{id}/feedback', [\App\Http\Controllers\Api\KnowledgeBaseController::class, 'feedback']);
    
    // Webhooks (no auth, verified by signature)
    Route::post('/webhooks/stripe', [OrderController::class, 'stripeWebhook']);
    Route::post('/webhooks/checkout', [OrderController::class, 'checkoutWebhook']);
    Route::post('/webhooks/resend', [\App\Http\Controllers\Api\ResendWebhookController::class, 'handle']);
    
    // Test email endpoint (remove in production)
    Route::get('/test-email', function() {
        $apiKey = config('resend.api_key');
        
        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
            'from' => 'info@balkly.live',
            'to' => ['h.kravarevic@gmail.com'],
            'subject' => 'Test Email from Balkly',
            'html' => '<h1>Welcome to Balkly!</h1><p>Your email system is working perfectly!</p>',
        ]);
        
        return response()->json([
            'sent' => $response->successful(),
            'response' => $response->json(),
        ]);
    });
    
    // Contact form endpoint
    Route::post('/contact', function(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);
        
        $apiKey = config('resend.api_key');
        
        // Send to support team
        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
            'from' => 'noreply@balkly.live',
            'to' => ['h.kravarevic@gmail.com'],
            'reply_to' => $validated['email'],
            'subject' => '[Balkly Contact] ' . $validated['subject'],
            'html' => "
                <div style='background: #f3f4f6; padding: 20px;'>
                    <div style='background: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto;'>
                        <h2 style='color: #1E63FF; margin-bottom: 20px;'>📧 New Contact Form Submission</h2>
                        
                        <div style='background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;'>
                            <p style='margin: 5px 0;'><strong>From:</strong> {$validated['name']}</p>
                            <p style='margin: 5px 0;'><strong>Email:</strong> <a href='mailto:{$validated['email']}' style='color: #1E63FF;'>{$validated['email']}</a></p>
                            <p style='margin: 5px 0;'><strong>Subject:</strong> {$validated['subject']}</p>
                        </div>
                        
                        <div style='background: #fff; padding: 20px; border-left: 4px solid #1E63FF;'>
                            <p style='white-space: pre-wrap; color: #374151;'>{$validated['message']}</p>
                        </div>
                        
                        <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;'>
                            <p style='color: #9ca3af; font-size: 12px;'>
                                Sent via Balkly Contact Form | 
                                <a href='https://balkly.live' style='color: #1E63FF;'>balkly.live</a>
                            </p>
                        </div>
                    </div>
                </div>
            ",
        ]);
        
        // Send confirmation to user
        \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
            'from' => 'support@balkly.live',
            'to' => [$validated['email']],
            'subject' => 'We received your message - Balkly Support',
            'html' => "
                <div style='background: #f3f4f6; padding: 20px;'>
                    <div style='background: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto;'>
                        <h2 style='color: #1E63FF;'>Thank you for contacting Balkly!</h2>
                        <p style='color: #374151; line-height: 1.6;'>Hi {$validated['name']},</p>
                        <p style='color: #374151; line-height: 1.6;'>
                            We've received your message and our support team will respond within 24 hours.
                        </p>
                        <div style='background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                            <p style='margin: 0; color: #6b7280; font-size: 14px;'><strong>Your message:</strong></p>
                            <p style='margin: 10px 0 0 0; color: #374151; white-space: pre-wrap;'>{$validated['message']}</p>
                        </div>
                        <p style='color: #374151;'>Best regards,<br><strong>Balkly Support Team</strong></p>
                        <hr style='margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;'>
                        <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                            📧 support@balkly.live | 🌐 <a href='https://balkly.live' style='color: #1E63FF;'>balkly.live</a>
                        </p>
                    </div>
                </div>
            ",
        ]);
        
        return response()->json([
            'message' => 'Message sent successfully!',
        ]);
    });
});

