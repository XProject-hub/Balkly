<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Physical check-ins via partner QR code
        Schema::create('partner_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['partner_id', 'created_at']);
        });

        // Add description (what was booked/purchased) and user_id to conversions
        Schema::table('partner_conversions', function (Blueprint $table) {
            $table->string('description', 500)->nullable()->after('notes');
            $table->unsignedBigInteger('user_id')->nullable()->after('partner_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_visits');
        Schema::table('partner_conversions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['description', 'user_id']);
        });
    }
};
