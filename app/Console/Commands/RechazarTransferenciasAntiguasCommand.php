<?php

namespace App\Console\Commands;

use App\Models\TransferenciaStock;
use App\Models\TransferenciaStockFirma;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\MovimientosDeCaja\Enums\MovimientoCajaEstados;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Exception;

class RechazarTransferenciasAntiguasCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'transferencias:rechazar-antiguas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Look for all transferenciastock where idestado != 3 or != 7 and fechahora < today minus 3 days and reject them.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(ActualizacionesManager $actualizacionesManager)
    {
        $this->info("Searching for old transferences to reject...");

        $dateThreshold = Carbon::now()->subDays(3);
        $rechazado = MovimientoCajaEstados::RECHAZADO->value;
        $recibido = MovimientoCajaEstados::RECIBIDO->value;

        $transferencias = TransferenciaStock::whereNotIn('idestado', [$rechazado, $recibido])
            ->where('fechahora', '<', $dateThreshold)
            ->get();

        $count = $transferencias->count();

        if ($count === 0) {
            $this->info("No transferences found to reject.");
            return 0;
        }

        $this->info("Found $count transferences to reject.");

        foreach ($transferencias as $transferencia) {
            $this->info("Rejecting transference ID: {$transferencia->id}");

            DB::transaction(function () use ($transferencia, $actualizacionesManager, $rechazado) {
                // 1 - Set idestado to 3 (RECHAZADO)
                $transferencia->idestado = $rechazado;
                $transferencia->save();

                // 2 - Add a new record to TransferenciaStockFirma
                TransferenciaStockFirma::create([
                    'idtransferenciastock' => $transferencia->id,
                    'idusuario' => 1, //SISTEMA INFORMATICO
                    'fechahora' => Carbon::now(),
                    'idestado' => $rechazado,
                    'observaciones' => 'Rechazado por sistemas',
                    'rol' => 'SISTEMAS',
                ]);

                // 3 - Call the method insertarActualizacion from the service ActualizacionesManager
                // for the rendicionstock->idsucursaldestino (which is transferencia->sucursalDestino)
                $sucursalDestino = $transferencia->sucursalDestino;
                if ($sucursalDestino) {
                    $actualizacionesManager->insertarActualizacion($transferencia, $sucursalDestino);
                } else {
                    $this->warn("No destination branch found for transference ID: {$transferencia->id}");
                }
            });
        }

        $this->info("Process completed successfully.");

        return 0;
    }
}
