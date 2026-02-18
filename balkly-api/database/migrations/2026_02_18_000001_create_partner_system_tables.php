<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('company_name');
            $table->string('company_logo')->nullable();
            $table->text('company_description')->nullable();
            $table->string('website_url')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->enum('commission_type', ['percent_of_bill', 'fixed_per_client', 'digital_referral_percent'])->default('percent_of_bill');
            $table->decimal('commission_rate', 8, 2)->default(0);
            $table->integer('default_voucher_duration_hours')->default(2);
            $table->string('tracking_code', 32)->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('user_id');
            $table->index('tracking_code');
        });

        Schema::create('partner_staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['staff', 'manager', 'owner'])->default('staff');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['partner_id', 'user_id']);
        });

        Schema::create('partner_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('benefit_type', ['free_item', 'percent_off', 'fixed_off'])->default('percent_off');
            $table->decimal('benefit_value', 8, 2)->default(0);
            $table->decimal('min_purchase', 8, 2)->nullable();
            $table->text('terms')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('partner_id');
        });

        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 16)->unique();
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->foreignId('offer_id')->nullable()->constrained('partner_offers')->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['issued', 'viewed', 'redeemed', 'expired', 'cancelled'])->default('issued');
            $table->timestamp('expires_at');
            $table->timestamp('redeemed_at')->nullable();
            $table->unsignedBigInteger('redeemed_by')->nullable();
            $table->timestamps();

            $table->foreign('redeemed_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['partner_id', 'status']);
            $table->index('code');
            $table->index('user_id');
        });

        Schema::create('redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voucher_id')->unique()->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('staff_id');
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('benefit_type')->nullable();
            $table->string('benefit_applied')->nullable();
            $table->text('notes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->foreign('staff_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['partner_id', 'created_at']);
        });

        Schema::create('partner_clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('referrer_url')->nullable();
            $table->string('landing_url')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['partner_id', 'created_at']);
        });

        Schema::create('partner_conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('voucher_id')->nullable();
            $table->unsignedBigInteger('click_id')->nullable();
            $table->enum('type', ['digital', 'physical'])->default('physical');
            $table->decimal('amount', 10, 2)->default(0);
            $table->decimal('commission_rate', 8, 2)->default(0);
            $table->decimal('commission_amount', 10, 2)->default(0);
            $table->enum('status', ['pending', 'confirmed', 'paid'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->unsignedBigInteger('confirmed_by')->nullable();
            $table->timestamps();

            $table->foreign('voucher_id')->references('id')->on('vouchers')->onDelete('set null');
            $table->foreign('click_id')->references('id')->on('partner_clicks')->onDelete('set null');
            $table->foreign('confirmed_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['partner_id', 'status']);
            $table->index(['partner_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_conversions');
        Schema::dropIfExists('partner_clicks');
        Schema::dropIfExists('redemptions');
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('partner_offers');
        Schema::dropIfExists('partner_staff');
        Schema::dropIfExists('partners');
    }
};
