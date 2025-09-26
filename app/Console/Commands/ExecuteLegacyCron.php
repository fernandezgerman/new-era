<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ExecuteLegacyCron extends Command
{
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Execute a legacy cron ';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'legacy:cron';

    public function handle()
    {
        include_once (config('legacy.legacy_base_directory').'cronPorHora.php');
    }
}
