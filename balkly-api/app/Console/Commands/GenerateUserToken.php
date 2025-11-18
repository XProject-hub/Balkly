<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateUserToken extends Command
{
    protected $signature = 'user:token {email}';
    protected $description = 'Generate authentication token for a user';

    public function handle()
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email {$email} not found!");
            return 1;
        }

        // Revoke old tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->info("✅ Token generated for: {$user->name} ({$user->email})");
        $this->line("");
        $this->line("═══════════════════════════════════════════");
        $this->line($token);
        $this->line("═══════════════════════════════════════════");
        $this->line("");
        $this->info("Copy this token and in browser console run:");
        $this->line("localStorage.setItem('auth_token', '{$token}')");
        $this->line("Then refresh the page!");

        return 0;
    }
}

