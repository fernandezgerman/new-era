<?php

namespace App\Console\Commands;

use App\Events\Events\MediosDeCobro\MediosDeCobroStatusChangeEvent;
use App\Models\MovimientoCajaVentaSucursalCobro;
use App\Models\VentaSucursalCobro;
use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Event;

class TriggerMediosDeCobroStatusChange extends Command
{
    /**
     * The name and signature of the console command.
     *
     * Options:
     *  --dry        Show what would be processed but do not dispatch events
     *  --limit=     Limit number of processed records
     *  --idsucursal=   Filter by a specific sucursal ID
     */
    protected $signature = 'medios:trigger-status-change '
        . '{--dry : Dry-run, do not dispatch events} '
        . '{--limit= : Limit how many records to process} '
        . '{--idsucursal= : Filter by sucursal ID}';

    /**
     * The console command description.
     */
    protected $description = 'Find VentaSucursalCobro without MovimientoCaja link where the related configuracion (by sucursal + modo) has transferirmonto and configuration_checked = 1, and dispatch MediosDeCobroStatusChangeEvent for each.';


    public function handle(): int
    {
        $dryRun = (bool)$this->option('dry');
        $limit = $this->option('limit');
        $idSucursalFilter = $this->option('idsucursal');

        $this->info('Starting scan for VentaSucursalCobro without MovimientoCaja link...');

        $baseQuery = VentaSucursalCobro::query();

        // Left join to MovimientoCajaVentaSucursalCobro to filter those without relation
        $baseQuery->leftJoin('movimientocajaventasucursalcobro as mcvsc', 'ventasucursalcobros.id', '=', 'mcvsc.idventasucursalcobro')
            ->whereNull('mcvsc.id');

        // Join with MedioDeCobroSucursalConfiguracion matching sucursal + modo
        $baseQuery->join('mediodecobrosucursalconfiguraciones as cfg', function ($join) {
            $join->on('cfg.idsucursal', '=', 'ventasucursalcobros.idsucursal')
                 ->on('cfg.idmododecobro', '=', 'ventasucursalcobros.idmododecobro');
        })
        ->where('cfg.transferirmonto', true)
        ->where('cfg.configuration_checked', true);

        if ($idSucursalFilter !== null) {
            $baseQuery->where('ventasucursalcobros.idsucursal', (int)$idSucursalFilter);
        }

        // Select the VentaSucursalCobro columns only
        $baseQuery->select('ventasucursalcobros.*');
        $baseQuery->where('ventasucursalcobros.estado', MedioDeCobroEstados::APROBADO->value );
        $baseQuery->where('ventasucursalcobros.created_at', '>=',Carbon::today()->subDays(1)->toDateTimeString() );

        // Apply limit if provided (will be applied per-chunk effectively)
        $processed = 0;
        $limitInt = $limit !== null ? (int)$limit : null;

        $baseQuery->orderBy('ventasucursalcobros.id');

        $baseQuery->chunk(500, function ($ventas) use (&$processed, $dryRun, $limitInt) {
            foreach ($ventas as $venta) {
                if ($limitInt !== null && $processed >= $limitInt) {
                    return false; // stop further chunking
                }

                $processed++;

                $this->line(sprintf('- VSC #%d sucursal=%d modo=%s importe=%s estado=%s',
                    $venta->id,
                    $venta->idsucursal,
                    (string)$venta->idmododecobro,
                    (string)$venta->importe,
                    (string)$venta->estado,
                ));

                if ($dryRun) {
                    continue;
                }

                // Double-check at runtime there is still no MovimientoCaja record to be safe
                $exists = MovimientoCajaVentaSucursalCobro::query()
                    ->where('idventasucursalcobro', $venta->id)
                    ->exists();

                if ($exists) {
                    $this->warn("  Skipped (MovimientoCaja link now exists)");
                    continue;
                }

                // Dispatch the event for this venta
                Event::dispatch(new MediosDeCobroStatusChangeEvent($venta));
                $this->info('  Event dispatched.');
            }
            return true;
        });

        $this->info("Completed. Processed: {$processed}" . ($dryRun ? ' (dry-run)' : ''));

        return self::SUCCESS;
    }
}
