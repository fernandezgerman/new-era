<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Throwable;

class AnularComprasDuglenisCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'compras:anular-duglenis';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Iterate through specific cancelled purchases and call setAnularComprasDuglenis stored procedure, with rollback option.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $this->info("Starting the process of cancelling purchases...");

        try {
            $query = "
                SELECT cmp.id, cmp.totalfactura
                FROM compras AS cmp
                INNER JOIN comprasanuladas AS ca ON cmp.id = ca.idanulacion
                INNER JOIN usuarios usr ON cmp.idusuario = usr.id
                INNER JOIN sucursales suc ON cmp.idsucursal = suc.id
                WHERE ca.idusuarioanulo = 640 AND DATE(ca.fechacreacion) > '2026-03-01'
            ";

            $results = DB::select($query);

            if (empty($results)) {
                $this->info("No purchases found for the given criteria.");
                return self::SUCCESS;
            }

            $total = count($results);
            $this->info("Found {$total} purchases to process.");

            DB::beginTransaction();

            $totalFactura = 0;
            $successCount = 0;
            $errorCount = 0;

            foreach ($results as $row) {
                $id = $row->id;
                $totalFactura = $totalFactura + $row->totalfactura * -1;
                try {
                    // Executing the stored procedure
                    // The procedure is: CALL setAnularComprasDuglenis(IN p_idcompra BIGINT(20), IN p_idusuarioanulo BIGINT(20))
                    DB::statement("CALL setAnularComprasDuglenis(?, 1)", [$id]);

                    $this->line("Processed cmp.id: {$id} - SUCCESS");
                    $successCount++;
                } catch (Throwable $e) {
                    $this->error("Processed cmp.id: {$id} - ERROR: " . $e->getMessage());
                    $errorCount++;
                }
            }

            $this->info("Finished processing.");
            $this->info("Successes: {$successCount}, Errors: {$errorCount}");
            $this->info("Total corregido: {$totalFactura}");

            if ($this->confirm('Do you want to commit these changes?', true)) {
                DB::commit();
                $this->info("Changes committed successfully.");
                return self::SUCCESS;
            } else {
                DB::rollBack();
                $this->info("Process rolled back by user.");
                return self::SUCCESS;
            }
        } catch (Throwable $e) {
            DB::rollBack();
            $this->error("Critical error: " . $e->getMessage());
            return self::FAILURE;
        }
    }
}
