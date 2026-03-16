<?php

namespace App\Console\Commands;

use App\Models\Caja;
use App\Services\Cajas\CajaManager;
use App\Mail\CajaCongruenceReport;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class CheckCajasCongruenceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'caja:check-congruence {from? : The start date (YYYY-MM-DD)} {to? : The end date (YYYY-MM-DD)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check congruence for cajas closed between two dates';

    /**
     * Execute the console command.
     *
     * @param CajaManager $cajaManager
     * @return int
     */
    public function handle(CajaManager $cajaManager)
    {
        $from = $this->argument('from');
        $to = $this->argument('to');

        $dateFrom = $from ? Carbon::parse($from)->startOfDay() : Carbon::now()->subDays(7)->startOfDay();
        $dateTo = $to ? Carbon::parse($to)->endOfDay() : Carbon::now()->endOfDay();

        $this->info("Checking cajas closed from {$dateFrom->toDateTimeString()} to {$dateTo->toDateTimeString()}...");

        $query = Caja::whereNotNull('fechacierre')
            ->whereBetween('fechacierre', [$dateFrom, $dateTo]);

        $cajas = $query->get();

        if ($cajas->isEmpty()) {
            $this->info("No closed cajas found in the specified range.");
            return 0;
        }

        $totalCajas = $cajas->count();
        $bar = $this->output->createProgressBar($totalCajas);
        $bar->start();

        $errorsCount = 0;
        $allErrorMessages = [];

        foreach ($cajas as $caja) {
            $messages = $cajaManager->CheckCajaCongruence($caja);

            if (!empty($messages)) {
                $errorsCount++;
                // Add a newline if it's the first error to avoid mixing with progress bar
                if ($errorsCount === 1) {
                    $this->newLine();
                }
                foreach ($messages as $message) {
                    $this->error($message);
                    $allErrorMessages[] = $message;
                }
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        if ($errorsCount === 0) {
            $this->info("All {$totalCajas} cajas checked are congruent.");
        } else {
            $this->warn("Checked {$totalCajas} cajas. Found issues in {$errorsCount} cajas.");

            $emailConfig = config('mail.emails.sistemas');
            if ($emailConfig && isset($emailConfig['email'])) {
                $this->info("Sending error report to {$emailConfig['email']}...");
                Mail::to($emailConfig['email'])->send(new CajaCongruenceReport($allErrorMessages, $dateFrom->toDateTimeString(), $dateTo->toDateTimeString()));
                $this->info("Email sent.");
            } else {
                $this->warn("Could not send email: config('emails.sistemas.email') is not set.");
            }
        }

        return 0;
    }
}
