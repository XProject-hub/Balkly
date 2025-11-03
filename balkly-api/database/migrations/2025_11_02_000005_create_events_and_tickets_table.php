<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->enum('type', ['affiliate', 'own'])->default('own');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('venue')->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('country', 2)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamp('start_at');
            $table->timestamp('end_at')->nullable();
            $table->string('partner_ref')->nullable();
            $table->string('partner_url')->nullable();
            $table->string('image_url')->nullable();
            $table->enum('status', ['draft', 'published', 'cancelled', 'completed'])->default('draft');
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['latitude', 'longitude']);
            $table->index(['type', 'status', 'start_at']);
            $table->index(['city', 'country', 'start_at']);
            $table->index('organizer_id');
        });

        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('currency', 3)->default('EUR');
            $table->integer('capacity')->nullable();
            $table->integer('sold')->default(0);
            $table->integer('reserved')->default(0);
            $table->timestamp('sale_starts_at')->nullable();
            $table->timestamp('sale_ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['event_id', 'is_active']);
        });

        Schema::create('ticket_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->decimal('total', 12, 2);
            $table->string('currency', 3)->default('EUR');
            $table->enum('status', ['pending', 'paid', 'cancelled', 'refunded'])->default('pending');
            $table->string('buyer_name');
            $table->string('buyer_email');
            $table->string('buyer_phone')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['buyer_id', 'status']);
            $table->index(['event_id', 'status']);
        });

        Schema::create('ticket_qr_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_order_id')->constrained()->onDelete('cascade');
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->string('code')->unique();
            $table->string('qr_url')->nullable();
            $table->enum('status', ['valid', 'used', 'void', 'refunded'])->default('valid');
            $table->timestamp('issued_at');
            $table->timestamp('used_at')->nullable();
            $table->foreignId('scanned_by')->nullable()->constrained('users');
            $table->timestamps();
            
            $table->index(['ticket_order_id', 'status']);
            $table->index(['code', 'status']);
        });

        Schema::create('affiliates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('contact_email')->nullable();
            $table->json('tracking_params_json')->nullable();
            $table->json('payout_terms_json')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('affiliate_clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained()->onDelete('cascade');
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('utm_json')->nullable();
            $table->timestamp('clicked_at');
            $table->timestamps();
            
            $table->index(['affiliate_id', 'event_id', 'clicked_at']);
        });

        Schema::create('affiliate_conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained()->onDelete('cascade');
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->string('order_ref')->nullable();
            $table->decimal('amount', 12, 2);
            $table->decimal('commission', 10, 2);
            $table->string('currency', 3)->default('EUR');
            $table->enum('status', ['pending', 'approved', 'rejected', 'paid'])->default('pending');
            $table->timestamp('reported_at');
            $table->timestamps();
            
            $table->index(['affiliate_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliate_conversions');
        Schema::dropIfExists('affiliate_clicks');
        Schema::dropIfExists('affiliates');
        Schema::dropIfExists('ticket_qr_codes');
        Schema::dropIfExists('ticket_orders');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('events');
    }
};

