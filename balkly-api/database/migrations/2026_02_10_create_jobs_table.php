<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique()->comment('Adzuna job ID');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('company')->nullable();
            $table->string('location')->nullable();
            $table->string('city')->nullable();
            $table->string('country', 2)->default('AE');
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->string('salary_currency', 3)->default('AED');
            $table->string('category')->nullable();
            $table->string('contract_type')->nullable()->comment('permanent, contract, etc.');
            $table->string('contract_time')->nullable()->comment('full_time, part_time');
            $table->string('redirect_url', 1000);
            $table->string('source')->default('jsearch');
            $table->string('employer_logo', 500)->nullable();
            $table->timestamp('created_date')->nullable();
            $table->string('status')->default('active');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['country', 'status']);
            $table->index(['city', 'status']);
            $table->index('category');
            $table->index('created_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
