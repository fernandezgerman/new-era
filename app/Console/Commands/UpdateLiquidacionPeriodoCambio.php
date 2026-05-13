<?php

namespace App\Console\Commands;

use App\Models\LiquidacionPeriodo;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UpdateLiquidacionPeriodoCambio extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'liquidacion:update-cambio';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates the "cambio" column in liquidacionesperiodo using historical blue dollar values';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $periodos = LiquidacionPeriodo::whereNull('cambio')
            ->whereNotNull('fechahoracierre')
            ->get();

        if ($periodos->isEmpty()) {
            $this->info('No periods to update.');
            return 0;
        }

        foreach ($periodos as $periodo) {
            $date = $periodo->fechahoracierre->format('Y-m-d');
            $this->info("Fetching exchange rate for period ID: {$periodo->id} on date: {$date}");

            try {
                $response = Http::get("https://api.bluelytics.com.ar/v2/historical?day={$date}");

                if ($response->successful()) {
                    $data = $response->json();
                    $blueValueSell = $data['blue']['value_sell'] ?? null;

                    if ($blueValueSell) {
                        $periodo->cambio = $blueValueSell;
                        $periodo->save();
                        $this->info("Updated period ID: {$periodo->id} with cambio: {$blueValueSell}");
                    } else {
                        $this->warn("Blue value sell not found in response for date: {$date}");
                    }
                } else {
                    $this->error("Failed to fetch data for date: {$date}. Status: " . $response->status());
                }
            } catch (\Exception $e) {
                Log::error("Error updating cambio for period ID: {$periodo->id} on date: {$date}: " . $e->getMessage());
                $this->error("Error for date: {$date}. Check logs.");
            }

            // Optional: avoid rate limiting if iterating many records
            usleep(200000); // 0.2 seconds
        }

        return 0;
    }
}
