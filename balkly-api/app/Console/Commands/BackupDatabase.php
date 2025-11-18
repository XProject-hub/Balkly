<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Create MySQL database backup and keep only 5 most recent';

    public function handle()
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $filename = "backup_{$timestamp}.sql";
        $backupPath = storage_path("backups/{$filename}");
        
        // Create backups directory
        if (!is_dir(storage_path('backups'))) {
            mkdir(storage_path('backups'), 0755, true);
        }

        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');

        // Execute mysqldump in MySQL container (Docker-aware)
        $command = "docker exec balkly_mysql mysqldump -u {$username} -p{$password} {$database} > {$backupPath} 2>&1";
        exec($command, $output, $returnCode);

        if ($returnCode === 0) {
            $this->info("✅ Backup created: {$filename}");
            
            // Keep only 5 most recent backups
            $this->cleanOldBackups();
            
            return 0;
        } else {
            $this->error("❌ Backup failed!");
            $this->error(implode("\n", $output));
            return 1;
        }
    }

    private function cleanOldBackups()
    {
        $backupDir = storage_path('backups');
        $files = glob("{$backupDir}/backup_*.sql");
        
        // Sort by modification time (newest first)
        usort($files, function($a, $b) {
            return filemtime($b) - filemtime($a);
        });

        // Keep only 5, delete the rest
        $filesToDelete = array_slice($files, 5);
        
        foreach ($filesToDelete as $file) {
            unlink($file);
            $this->info("🗑️  Deleted old backup: " . basename($file));
        }

        $this->info("📦 Total backups: " . min(count($files), 5));
    }
}

