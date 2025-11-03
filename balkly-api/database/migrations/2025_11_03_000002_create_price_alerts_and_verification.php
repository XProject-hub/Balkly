<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Price drop alerts
        Schema::create('price_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('listing_id')->constrained()->onDelete('cascade');
            $table->decimal('target_price', 12, 2);
            $table->string('currency', 3)->default('EUR');
            $table->boolean('is_active')->default(true);
            $table->timestamp('alerted_at')->nullable();
            $table->timestamps();
            
            $table->index(['listing_id', 'is_active']);
            $table->index('user_id');
        });

        // Seller verification
        Schema::create('seller_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->string('document_type')->nullable(); // id, business_license, etc.
            $table->string('document_url')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            
            $table->unique('user_id');
        });

        // Escrow transactions
        Schema::create('escrow_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('EUR');
            $table->enum('status', ['pending', 'funded', 'released', 'disputed', 'refunded', 'cancelled'])->default('pending');
            $table->string('stripe_payment_intent_id')->nullable();
            $table->text('terms')->nullable();
            $table->timestamp('funded_at')->nullable();
            $table->timestamp('released_at')->nullable();
            $table->timestamps();
            
            $table->index(['listing_id', 'status']);
            $table->index(['buyer_id', 'status']);
            $table->index('seller_id');
        });

        // Add verified badge field to users
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_verified_seller')->default(false)->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_verified_seller');
        });
        
        Schema::dropIfExists('escrow_transactions');
        Schema::dropIfExists('seller_verifications');
        Schema::dropIfExists('price_alerts');
    }
};

