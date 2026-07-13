<?php

namespace App\Console\Commands;

use App\Models\Sucursal;
use App\Services\Alertas\AlertasManager;
use App\Services\Alertas\CacheHandlers\AlertaSucursalInicioLiquidacionCacheHandler;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class AlertaSucursalInicioLiquidacionSetCacheValue extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alertas:sucursal-inicio-liquidacion-set-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sets the cache value for AlertaSucursalInicioLiquidacion for all active sucursales';

    /**
     * Execute the console command.
     */
    public function handle(AlertasManager $alertasManager): int
    {
        $this->info("Starting AlertaSucursalInicioLiquidacionSetCacheValue...");

        Log::info('procesando sucursales para inicio');
        $sucursales = Sucursal::where('activo', 1)
            ->get();

        foreach ($sucursales as $sucursal) {
            $this->info("Processing sucursal: {$sucursal->nombre} (ID: {$sucursal->id})");

            $result = $alertasManager->AlertasPreLiquidacion($sucursal);

            $cacheHandler = new AlertaSucursalInicioLiquidacionCacheHandler($sucursal);
            $cacheHandler->setValue($result);

            $this->info(json_encode($result));
        }

        $this->info("Completed successfully.");

        return 0;
    }
}
