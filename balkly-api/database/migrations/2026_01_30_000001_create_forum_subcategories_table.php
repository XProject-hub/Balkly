<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('forum_subcategories')) {
            Schema::create('forum_subcategories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('forum_category_id')->constrained('forum_categories')->onDelete('cascade');
                $table->string('name');
                $table->string('slug');
                $table->text('description')->nullable();
                $table->integer('order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();

                $table->index(['forum_category_id', 'order']);
                $table->unique(['forum_category_id', 'slug']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_subcategories');
    }
};
