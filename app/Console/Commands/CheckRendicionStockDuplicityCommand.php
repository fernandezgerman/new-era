<?php

namespace App\Console\Commands;

use App\Mail\RendicionStockDuplicityReport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class CheckRendicionStockDuplicityCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'arreglos:check-duplicity-on-detalle';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for duplicates in rendicionstockdetalle table';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info("Checking for duplicates in rendicionstockdetalle table...");

        $duplicates = DB::table('rendicionstockdetalle')
            ->select('fechahora', 'idrendicion', 'idarticulo', DB::raw('count(1)'))
            ->where('id', '>', 22507394)
            ->groupBy('fechahora', 'idrendicion', 'idarticulo')
            ->having(DB::raw('count(1)'), '>', 1)
            ->get();

        if ($duplicates->isNotEmpty()) {
            $this->warn("Found " . $duplicates->count() . " duplicates.");

            $emailConfig = config('mail.emails.sistemas');
            if ($emailConfig && isset($emailConfig['email'])) {
                $this->info("Sending report to " . $emailConfig['email'] . "...");
                Mail::to($emailConfig['email'])->send(new RendicionStockDuplicityReport($duplicates));
                $this->info("Email sent.");
            } else {
                $this->warn("Could not send email: config('mail.emails.sistemas.email') is not set.");
            }
        } else {
            $this->info("No duplicates found.");
        }

        return 0;
    }
}
