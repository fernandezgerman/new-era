<?php

namespace App\Console\Commands;

use App\Models\CobroSucursalGasto;
use App\Models\Compra;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQROrderSql;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Exception;

class AsociateGastoMercadoPago extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mercado-pago:asociate-gasto';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Associate compras to ventasucursalid for Mercado Pago QR orders';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting association process...');

        $query = MercadoPagoQROrderSql::query()
            ->select('mercadopagoqrorders.*')
            ->leftJoin('cobrosucursalgastos as csg', 'mercadopagoqrorders.ventasucursalcobroid', '=', 'csg.idventasucursalcobro')
            ->whereNull('csg.id')
            ->where('estado', 'processed')
        ;

        $total = $query->count('mercadopagoqrorders.id');
        $this->info("Found {$total} orders to process.");

        if ($total === 0) {
            return;
        }

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $errors = [];
        $notFound = [];

        $query->chunkById(250, function ($orders) use ($bar, &$errors, &$notFound) {
            foreach ($orders as $order) {
                try {
                    // 2 - Look for each compra where compra.numero is equal to the externalorderid
                    $compra = Compra::where('numero', $order->externalorderid)
                        ->where('id' ,'>', 659552) // año 2026
                        ->first();

                    if (!$compra) {
                        $notFound[] = "No Compra found for Order ID: {$order->id} (External Order ID: {$order->externalorderid}) F: {$order->created_at}";
                        $bar->advance();
                        continue;
                    }

                    // 3 - Add a new record into cobrosucursalgastos to associate the compra to the ventasucursalcobroid
                    // Check if already exists to avoid duplicates (though the query should handle it)
                    $exists = CobroSucursalGasto::where('idcompra', $compra->id)
                        ->exists();
                    if ($exists) {
                        $bar->advance();
                        continue;
                    }

                    CobroSucursalGasto::create([
                        'idcompra' => $compra->id,
                        'idventasucursalcobro' => $order->ventasucursalcobroid,
                    ]);

                } catch (Exception $e) {
                    // 4 - Collect the exception to show at the end
                    $errors[] = "Error processing Order ID: {$order->id}: " . $e->getMessage();
                }
                $bar->advance();
            }
        }, 'mercadopagoqrorders.id', 'id');

        $bar->finish();
        $this->newLine(2);

        if (!empty($notFound)) {
            $this->warn("Purchases not found:");
            foreach ($notFound as $item) {
                $this->line(" - $item");
            }
        }

        if (!empty($errors)) {
            $this->error("Errors encountered during processing:");
            foreach ($errors as $error) {
                $this->line(" - $error");
            }
        }

        $this->info('Process completed.');
    }
}
