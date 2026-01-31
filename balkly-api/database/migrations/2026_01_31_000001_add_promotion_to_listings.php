<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            if (!Schema::hasColumn('listings', 'is_promoted')) {
                $table->boolean('is_promoted')->default(false)->after('status');
            }
            if (!Schema::hasColumn('listings', 'promotion_type')) {
                $table->enum('promotion_type', ['none', 'standard', 'featured', 'boosted'])->default('none')->after('is_promoted');
            }
            if (!Schema::hasColumn('listings', 'promotion_expires_at')) {
                $table->timestamp('promotion_expires_at')->nullable()->after('promotion_type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['is_promoted', 'promotion_type', 'promotion_expires_at']);
        });
    }
};
