<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add columns to forum_topics
        Schema::table('forum_topics', function (Blueprint $table) {
            $table->string('prefix', 50)->nullable()->after('title'); // [Question], [Sale], etc.
            $table->json('tags')->nullable()->after('prefix');
            $table->boolean('is_locked')->default(false)->after('is_sticky');
            $table->boolean('is_solved')->default(false)->after('is_locked');
            $table->foreignId('best_answer_id')->nullable()->constrained('forum_posts')->onDelete('set null');
            $table->integer('watchers_count')->default(0);
        });

        // Add columns to forum_posts
        Schema::table('forum_posts', function (Blueprint $table) {
            $table->integer('quote_post_id')->nullable()->after('parent_id');
            $table->boolean('is_best_answer')->default(false)->after('is_solution');
        });

        // Thread watchers table
        Schema::create('forum_thread_watchers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('topic_id')->constrained('forum_topics')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['user_id', 'topic_id']);
        });

        // Reactions table (replace simple likes)
        Schema::create('forum_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('reactable_type'); // ForumTopic or ForumPost
            $table->unsignedBigInteger('reactable_id');
            $table->enum('type', ['like', 'love', 'haha', 'wow', 'sad', 'angry']);
            $table->timestamps();
            
            $table->index(['reactable_type', 'reactable_id']);
            $table->unique(['user_id', 'reactable_type', 'reactable_id']);
        });

        // Mentions table
        Schema::create('forum_mentions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('forum_posts')->onDelete('cascade');
            $table->foreignId('mentioned_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
            
            $table->index(['mentioned_user_id', 'is_read']);
        });

        // User reputation table
        Schema::create('user_reputation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('points')->default(0);
            $table->integer('posts_count')->default(0);
            $table->integer('topics_count')->default(0);
            $table->integer('solutions_count')->default(0);
            $table->integer('helpful_count')->default(0); // best answers given
            $table->timestamps();
            
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_reputation');
        Schema::dropIfExists('forum_mentions');
        Schema::dropIfExists('forum_reactions');
        Schema::dropIfExists('forum_thread_watchers');
        
        Schema::table('forum_posts', function (Blueprint $table) {
            $table->dropColumn(['quote_post_id', 'is_best_answer']);
        });
        
        Schema::table('forum_topics', function (Blueprint $table) {
            $table->dropForeign(['best_answer_id']);
            $table->dropColumn(['prefix', 'tags', 'is_locked', 'is_solved', 'best_answer_id', 'watchers_count']);
        });
    }
};

