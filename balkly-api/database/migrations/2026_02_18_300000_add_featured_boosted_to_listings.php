<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            if (!Schema::hasColumn('listings', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('is_promoted');
            }
            if (!Schema::hasColumn('listings', 'is_boosted')) {
                $table->boolean('is_boosted')->default(false)->after('is_featured');
            }
            if (!Schema::hasColumn('listings', 'featured_until')) {
                $table->timestamp('featured_until')->nullable()->after('is_boosted');
            }
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['is_featured', 'is_boosted', 'featured_until']);
        });
    }
};
