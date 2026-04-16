<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Alerta;
use App\Models\AlertaDestinatario;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CleanupOldAlertasCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alertas:cleanup-old {--all : Delete all alerts of type 2 regardless of age}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete alerts with idalertatipo = 2 (older than 30 days by default)';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info("Starting cleanup of old alerts...");

        $all = $this->option('all');
        $dateThreshold = Carbon::now()->subDays(30);
        $idTipoAlerta = 2;

        $oldAlertsQuery = Alerta::where('idalertatipo', $idTipoAlerta);

        if (!$all) {
            $oldAlertsQuery->where('fechahora', '<', $dateThreshold);
        }

        $count = $oldAlertsQuery->count();

        if ($count === 0) {
            $this->info("No alerts found to delete.");
            return 0;
        }

        $this->info("Found $count alerts to delete.");

        DB::transaction(function () use ($dateThreshold, $idTipoAlerta, $all) {
            // Get IDs of alerts to be deleted to also clean up destinatarios
            $alertIdsQuery = Alerta::where('idalertatipo', $idTipoAlerta);

            if (!$all) {
                $alertIdsQuery->where('fechahora', '<', $dateThreshold);
            }

            $alertIds = $alertIdsQuery->pluck('id');

            // Get IDs from alertasinformes to clean up alertasinformesparametros
            $alertaInformeIds = DB::table('alertasinformes')
                ->whereIn('idalerta', $alertIds)
                ->pluck('id');

            // Delete from alertasinformesparametros
            DB::table('alertasinformesparametros')->whereIn('idalertainforme', $alertaInformeIds)->delete();

            // Delete from alertasinformes
            DB::table('alertasinformes')->whereIn('id', $alertaInformeIds)->delete();

            // Delete from destinatarios
            DB::table('alertasdestinatarios')->whereIn('idalerta', $alertIds)->delete();

            // Delete from alertas
            DB::table('alertas')->whereIn('id', $alertIds)->delete();
        });

        $this->info("Cleanup completed successfully.");

        return 0;
    }
}
