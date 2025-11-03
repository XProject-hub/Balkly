<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Blog posts
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->string('category')->default('news'); // news, tutorial, update, guide
            $table->json('tags')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('views_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            $table->fullText(['title', 'content']);
            $table->index(['status', 'published_at']);
            $table->index('category');
        });

        // Knowledge base articles
        Schema::create('kb_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('kb_categories')->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->string('video_url')->nullable(); // YouTube, Vimeo, etc.
            $table->integer('video_duration')->nullable(); // seconds
            $table->json('related_articles')->nullable();
            $table->integer('helpful_count')->default(0);
            $table->integer('not_helpful_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->integer('display_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            
            $table->fullText(['title', 'content']);
            $table->index(['category_id', 'is_published', 'display_order']);
        });

        // Knowledge base categories
        Schema::create('kb_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
            
            $table->index('display_order');
        });

        // Article feedback
        Schema::create('kb_article_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('kb_articles')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_helpful');
            $table->text('comment')->nullable();
            $table->string('ip_address', 45);
            $table->timestamps();
            
            $table->index('article_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kb_article_feedback');
        Schema::dropIfExists('kb_articles');
        Schema::dropIfExists('kb_categories');
        Schema::dropIfExists('blog_posts');
    }
};

