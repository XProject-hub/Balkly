<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('blog_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('parent_slug')->nullable();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['parent_id', 'order']);
            $table->index('slug');
        });

        // Update blog_posts to use category_id instead of category string
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('author_id')->constrained('blog_categories')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
        
        Schema::dropIfExists('blog_categories');
    }
};

