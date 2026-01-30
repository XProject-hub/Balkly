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
            if (!Schema::hasColumn('forum_topics', 'prefix')) {
                $table->string('prefix', 50)->nullable()->after('title');
            }
            if (!Schema::hasColumn('forum_topics', 'tags')) {
                $table->json('tags')->nullable()->after('prefix');
            }
            if (!Schema::hasColumn('forum_topics', 'is_locked')) {
                $table->boolean('is_locked')->default(false)->after('is_sticky');
            }
            if (!Schema::hasColumn('forum_topics', 'is_solved')) {
                $table->boolean('is_solved')->default(false)->after('is_locked');
            }
            if (!Schema::hasColumn('forum_topics', 'best_answer_id')) {
                $table->foreignId('best_answer_id')->nullable()->constrained('forum_posts')->onDelete('set null');
            }
            if (!Schema::hasColumn('forum_topics', 'watchers_count')) {
                $table->integer('watchers_count')->default(0);
            }
        });

        // Add columns to forum_posts
        Schema::table('forum_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('forum_posts', 'quote_post_id')) {
                $table->integer('quote_post_id')->nullable()->after('parent_id');
            }
            if (!Schema::hasColumn('forum_posts', 'is_best_answer')) {
                $table->boolean('is_best_answer')->default(false)->after('is_solution');
            }
        });

        // Thread watchers table
        if (!Schema::hasTable('forum_thread_watchers')) {
            Schema::create('forum_thread_watchers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('topic_id')->constrained('forum_topics')->onDelete('cascade');
                $table->timestamps();
                
                $table->unique(['user_id', 'topic_id']);
            });
        }

        // Reactions table (replace simple likes)
        if (!Schema::hasTable('forum_reactions')) {
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
        }

        // Mentions table
        if (!Schema::hasTable('forum_mentions')) {
            Schema::create('forum_mentions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('post_id')->constrained('forum_posts')->onDelete('cascade');
                $table->foreignId('mentioned_user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
                $table->boolean('is_read')->default(false);
                $table->timestamps();
                
                $table->index(['mentioned_user_id', 'is_read']);
            });
        }

        // User reputation table
        if (!Schema::hasTable('user_reputation')) {
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

