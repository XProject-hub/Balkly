<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 12, 2)->nullable();
            $table->string('currency', 3)->default('EUR');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('country', 2)->nullable();
            $table->enum('status', ['draft', 'pending_review', 'active', 'paused', 'rejected', 'expired', 'sold'])->default('draft');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->integer('views_count')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->fullText(['title', 'description']);
            $table->index(['latitude', 'longitude']);
            $table->index(['user_id', 'status', 'published_at']);
            $table->index(['category_id', 'status', 'published_at']);
            $table->index(['city', 'country', 'status']);
        });

        Schema::create('listing_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('attribute_id')->constrained()->onDelete('cascade');
            $table->text('value');
            $table->timestamps();
            
            $table->unique(['listing_id', 'attribute_id']);
            $table->index('attribute_id');
        });

        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('owner_type');
            $table->unsignedBigInteger('owner_id');
            $table->string('url');
            $table->enum('type', ['image', 'video', 'document'])->default('image');
            $table->string('mime_type', 100)->nullable();
            $table->integer('size')->nullable();
            $table->integer('order')->default(0);
            $table->json('ai_tags_json')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['owner_type', 'owner_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
        Schema::dropIfExists('listing_attributes');
        Schema::dropIfExists('listings');
    }
};

