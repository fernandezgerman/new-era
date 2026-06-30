<?php

namespace App\Console\Commands;

use App\Models\Caja;
use App\Models\Compra;
use App\Services\Cajas\CajaManager;
use App\Mail\CajaCongruenceReport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;

class MercadoPagoFixMovimientosDuplicadosCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mercado-pago:fix-movimientos-duplicados';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Iterate mpmovimientosduplicados_aux and fix caja congruence';

    /**
     * Execute the console command.
     *
     * @param CajaManager $cajaManager
     * @return int
     */
    public function handle(CajaManager $cajaManager)
    {
        if (!Schema::hasTable('mpmovimientosduplicados_aux')) {
            $this->error("Table 'mpmovimientosduplicados_aux' does not exist.");
            return 1;
        }

        $records = DB::table('mpmovimientosduplicados_aux')->get();

        if ($records->isEmpty()) {
            $this->info("No records found in mpmovimientosduplicados_aux.");
            return 0;
        }

        $cajaKeys = [];
        foreach ($records as $record) {
            // Source caja
            if ($record->idsucursalcaja && $record->idusuariocaja && $record->numerocaja) {
                $key = "{$record->idsucursalcaja}-{$record->idusuariocaja}-{$record->numerocaja}";
                $cajaKeys[$key] = [
                    'idsucursal' => $record->idsucursalcaja,
                    'idusuario' => $record->idusuariocaja,
                    'numero' => $record->numerocaja
                ];
            }

            // Destination caja
            if ($record->idsucursalcajadestino && $record->idusuariocajadestino && $record->numerocajadestino) {
                $key = "{$record->idsucursalcajadestino}-{$record->idusuariocajadestino}-{$record->numerocajadestino}";
                $cajaKeys[$key] = [
                    'idsucursal' => $record->idsucursalcajadestino,
                    'idusuario' => $record->idusuariocajadestino,
                    'numero' => $record->numerocajadestino
                ];
            }
        }

        $totalCajas = count($cajaKeys);
        $this->info("Checking {$totalCajas} unique cajas...");

        $bar = $this->output->createProgressBar($totalCajas);
        $bar->start();

        $errorsCount = 0;
        $allErrorMessages = [];

        foreach ($cajaKeys as $key => $data) {
            $caja = Caja::where('idsucursal', $data['idsucursal'])
                ->where('idusuario', $data['idusuario'])
                ->where('numero', $data['numero'])
                ->first();

            if ($caja) {
                $messages = $cajaManager->CheckCajaCongruence($caja, true);

                if (!empty($messages)) {
                    $errorsCount++;
                    if ($errorsCount === 1) {
                        $this->newLine();
                    }
                    foreach ($messages as $issue) {
                        $this->error($issue['message']);
                        $allErrorMessages[] = $issue;
                    }
                }
            } else {
                $this->newLine();
                $this->warn("Caja not found for: " . json_encode($data));
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        if ($errorsCount === 0) {
            $this->info("All {$totalCajas} unique cajas checked are congruent.");
        } else {
            $this->warn("Checked {$totalCajas} unique cajas. Found and fixed issues in {$errorsCount} cajas.");

            $emailConfig = config('mail.emails.sistemas');
            if ($emailConfig && isset($emailConfig['email'])) {
                $this->info("Sending error report to {$emailConfig['email']}...");
                Mail::to($emailConfig['email'])->send(new CajaCongruenceReport($allErrorMessages, 'From Table', 'mpmovimientosduplicados_aux'));
                $this->info("Email sent.");
            } else {
                $this->warn("Could not send email: config('emails.sistemas.email') is not set.");
            }
        }

        return 0;
    }
}
