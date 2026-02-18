<?php

namespace App\Console\Commands;

use App\Models\Voucher;
use Illuminate\Console\Command;

class ExpireVouchers extends Command
{
    protected $signature = 'vouchers:expire';
    protected $description = 'Mark expired vouchers as expired';

    public function handle(): int
    {
        $count = Voucher::where('status', 'issued')
            ->where('expires_at', '<', now())
            ->update(['status' => 'expired']);

        $this->info("Marked {$count} voucher(s) as expired.");

        return self::SUCCESS;
    }
}
