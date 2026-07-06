<?php

namespace App\Console\Commands;

use App\Models\Caja;
use App\Models\Compra;
use App\Services\Cajas\CajaManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MercadoPagoFixGastosMpIdUnicoCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix-gastos-mp-idunico';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix numerocaja for duplicate compras and update caja congruence';

    /**
     * Execute the console command.
     */
/*
    public function error($string, $verbosity = null)
    {
        echo $string;
    }
    public function warn($string, $verbosity = null)
    {
        echo $string;
    }
    public function info($string, $verbosity = null)
    {
        echo $string;
    }*/
    public function handle(CajaManager $cajaManager)
    {
        return;
        $this->info('Starting fix-gastos-mp-idunico command...');

       // return;
        // 1 - Iterate the following compras

        DB::beginTransaction();
        $query = "
            select
            compras.*
            from compras
            inner join (
            select idunico, max(id) as maxid from compras as cmp where cmp.id >= 825643 and cmp.id <= 873666 group by idunico having count(1) > 1
            ) as t on compras.idunico = t.idunico
        ";

        $comprasData = DB::select($query);

        if (empty($comprasData)) {
            $this->info('No duplicate compras found in the specified range.');
            return 0;
        }

        $this->info('Found ' . count($comprasData) . ' duplicate compras to check.');

        $affectedCajas = [];

        foreach ($comprasData as $compraData) {
            $compra = Compra::find($compraData->id);
            if (!$compra) {
                $this->warn("Compra ID {$compraData->id} not found.");
                continue;
            }

            // 2 - check that the numerocaja is the correct
            // Check that the fechahora is between the fechaapertura and fechacierre from the caja.
            $currentCaja = DB::table('cajas')
                ->where('idusuario', $compra->idusuariocaja)
                ->where('idsucursal', $compra->idsucursalcaja)
                ->where('numero', $compra->numerocaja)
                ->first();

            $isCorrect = false;
            if ($currentCaja) {
                $fechahora = $compra->fechahora;
                $apertura = $currentCaja->fechaapertura;
                $cierre = $currentCaja->fechacierre;

                if ($fechahora >= $apertura && ($currentCaja->idestado === 0 || $fechahora <= $cierre)) {
                    $isCorrect = true;
                }else{
                    // Track old caja
                    if ($compra->numerocaja !== null) {
                        $cajaKey = "{$compra->idusuariocaja}-{$compra->idsucursalcaja}-{$compra->numerocaja}";
                        $affectedCajas[$cajaKey] = [
                            'idusuario' => $compra->idusuariocaja,
                            'idsucursal' => $compra->idsucursalcaja,
                            'numero' => $compra->numerocaja
                        ];
                    }
                }
            }

            // 3 - If the number is not the correct, update the number with the correct caja
            if (!$isCorrect) {
                $this->info("Compra ID {$compra->id} has incorrect numerocaja {$compra->numerocaja}. Looking for correct caja...");

                // where fechahora is between fechaapertura and fechacierre.
                // if the caja is open, the fechaapertura is setted but fechacierre is null
                // (always the open caja is idestado != 1 and is the latest for the iduser and idsucursal given)
                $correctCaja = DB::table('cajas')
                    ->where('idusuario', $compra->idusuario) // Check against compra's idusuario/idsucursal
                    ->where('idsucursal', $compra->idsucursal)
                    ->where('fechaapertura', '<=', $compra->fechahora)
                    ->where(function ($query) use ($compra) {
                        $query->where('idestado', '<>', 1)
                              ->orWhere('fechacierre', '>=', $compra->fechahora);
                    })
                    ->orderBy('fechaapertura', 'desc')
                    ->first();

                if ($correctCaja) {
                    $this->info("Found correct caja: {$correctCaja->numero} for Usuario: {$correctCaja->idusuario}, Sucursal: {$correctCaja->idsucursal}");

                    $compra->update([
                        'numerocaja' => $correctCaja->numero,
                        'idusuariocaja' => $correctCaja->idusuario,
                        'idsucursalcaja' => $correctCaja->idsucursal,
                    ]);

                    // Track new caja
                    $newCajaKey = "{$correctCaja->idusuario}-{$correctCaja->idsucursal}-{$correctCaja->numero}";
                    $affectedCajas[$newCajaKey] = [
                        'idusuario' => $correctCaja->idusuario,
                        'idsucursal' => $correctCaja->idsucursal,
                        'numero' => $correctCaja->numero
                    ];
                } else {
                    $this->error("Correct caja not found for Compra ID {$compra->id} at {$compra->fechahora}");
                }
            }
        }


        // 4 - when all compras are updated, iterate all the cajas changed (the wrong and the right)
        // and execute CajaManager->CheckCajaCongruence for the caja with $update = true
        $this->info('Checking congruence for ' . count($affectedCajas) . ' affected cajas...');
        foreach ($affectedCajas as $cajaInfo) {
            $caja = Caja::where('idusuario', $cajaInfo['idusuario'])
                ->where('idsucursal', $cajaInfo['idsucursal'])
                ->where('numero', $cajaInfo['numero'])
                ->first();

            if ($caja) {
                $this->info("Checking congruence for Caja {$caja->numero} (User: {$caja->idusuario}, Sucursal: {$caja->idsucursal})...");
                $messages = $cajaManager->CheckCajaCongruence($caja, true);
                foreach ($messages as $issue) {
                    $this->line("  - {$issue['message']}");
                }
            } else {
                $this->warn("Caja (Nro: {$cajaInfo['numero']}, Usuario: {$cajaInfo['idusuario']}, Sucursal: {$cajaInfo['idsucursal']}) not found during congruence check.");
            }
        }

        $this->info('Done.');

        DB::commit();
        return 0;
    }
}
