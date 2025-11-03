<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Page visits tracking
        Schema::create('page_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('page_url');
            $table->string('page_title')->nullable();
            $table->string('referrer')->nullable();
            $table->string('ip_address', 45);
            $table->text('user_agent')->nullable();
            $table->string('device_type', 20)->nullable(); // desktop, mobile, tablet
            $table->string('browser', 50)->nullable();
            $table->integer('time_on_page')->default(0); // seconds
            $table->timestamp('visited_at');
            $table->timestamps();
            
            $table->index(['visited_at', 'page_url']);
            $table->index('user_id');
        });

        // Ad banners
        Schema::create('ad_banners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position'); // homepage_top, homepage_sidebar, listings_top, etc.
            $table->string('type')->default('image'); // image, html, video
            $table->string('image_url')->nullable();
            $table->text('html_content')->nullable();
            $table->string('link_url')->nullable();
            $table->boolean('open_new_tab')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('impressions')->default(0);
            $table->integer('clicks')->default(0);
            $table->json('targeting')->nullable(); // category, location, etc.
            $table->timestamps();
            
            $table->index(['position', 'is_active', 'display_order']);
        });

        // User reviews/ratings
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reviewed_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('listing_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('rating'); // 1-5
            $table->text('comment')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
            
            $table->unique(['reviewer_id', 'reviewed_user_id', 'listing_id']);
            $table->index(['reviewed_user_id', 'status']);
        });

        // Saved favorites
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('favoritable_type');
            $table->unsignedBigInteger('favoritable_id');
            $table->timestamps();
            
            $table->unique(['user_id', 'favoritable_type', 'favoritable_id']);
            $table->index(['favoritable_type', 'favoritable_id']);
        });

        // Saved searches
        Schema::create('saved_searches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->json('search_params');
            $table->boolean('alert_enabled')->default(false);
            $table->string('alert_frequency')->default('daily'); // daily, weekly
            $table->timestamp('last_alerted_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'alert_enabled']);
        });

        // Offers/counteroffers
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('EUR');
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'countered', 'expired'])->default('pending');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->index(['listing_id', 'status']);
            $table->index(['buyer_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
        Schema::dropIfExists('saved_searches');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('ad_banners');
        Schema::dropIfExists('page_visits');
    }
};

