<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('cascade');
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->json('schema_preset')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['parent_id', 'is_active', 'order']);
        });

        Schema::create('attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->enum('type', ['text', 'number', 'select', 'multiselect', 'boolean', 'date', 'range']);
            $table->json('options_json')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('is_required')->default(false);
            $table->boolean('is_searchable')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->index(['category_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attributes');
        Schema::dropIfExists('categories');
    }
};

