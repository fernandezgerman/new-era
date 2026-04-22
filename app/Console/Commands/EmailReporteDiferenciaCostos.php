<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;
use clsEnvioEmail;

class EmailReporteDiferenciaCostos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:reporte-diferencia-costos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Runs a query for price differences and sends the result via email in CSV format.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $query = "
SELECT
	art.codigo, art.nombre,
	ifnull(cc.importe, art.costo) AS costocimp,
	max_precio.importe
FROM
	articulos as art LEFT JOIN
	costoscompra cc on art.idcompradetalle  = cc.iddetalle  and cc.idtipocosto = 1
	inner join (select idarticulo from existencias where cantidad > 0 group by idarticulo)as ex on art.id = ex.idarticulo
inner join (
	select
	    max(cc.importe)as importe,
	    idarticulo
	FROM
	    comprasdetalle as cd
	    INNER JOIN compras as cmp on cd.idcabecera = cmp.id
	    INNER JOIN costoscompra cc on cd.id  = cc.iddetalle  and cc.idtipocosto = 1
	    inner join articulos as art on cd.idarticulo  = art.id
	    LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idanulacion
	    LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idcompra
		LEFT JOIN comprasdudosas as duda ON cd.id = duda.idcompradetalle
	WHERE
		(duda.audicionresultado IS NULL OR audicionresultado =2 ) AND
	    cd.cantidad > 0 AND
	    ca.idanulacion is null AND
	    ca2.idanulacion is null  and
	    cd.id > art.idcompradetalle and
	    (art.escompuesto = 0 or art.escompuesto is null)
	group by idarticulo
) as max_precio  on art.id = max_precio.idarticulo
where art.activo = 1 and max_precio.importe > (ifnull(cc.importe, art.costo) + 10)
order by (max_precio.importe - costocimp) desc
        ";

        try {
            $this->info('Executing query...');
            $results = DB::select(DB::raw($query));
            $this->info('Query executed successfully. Found ' . count($results) . ' records.');

            if (count($results) === 0) {
                $this->info('No results to send.');
                return 0;
            }

            // Create CSV
            $fileName = 'reporte_diferencia_costos_' . date('Y-m-d_H-i-s') . '.csv';
            $filePath = storage_path('app/' . $fileName);

            $file = fopen($filePath, 'w');

            // CSV Header
            fputcsv($file, ['codigo', 'nombre', 'costocimp', 'importe']);

            // CSV Data
            foreach ($results as $row) {
                fputcsv($file, (array)$row);
            }

            fclose($file);
            $this->info('CSV file created at: ' . $filePath);

            // Send Email
            require_once(config('legacy.legacy_base_directory') . 'clases/log/clsEnvioEmail.php');

            $destEmail = config('mail.emails.sistemas.email');
            $destName = config('mail.emails.sistemas.name');

            if (!$destEmail) {
                throw new Exception('Email destination for systems not found in config/mail.php');
            }

            $this->info("Sending email to $destEmail ($destName)...");

            $objEmail = new clsEnvioEmail();
            $objEmail->agregarDestinatario($destEmail, $destName);
            $objEmail->addAdjunto($filePath, $fileName);

            $asunto = "Reporte de diferencia de costos - " . date('Y-m-d');
            $cuerpo = "<p>Se adjunta el reporte de diferencia de costos generado el " . date('Y-m-d H:i:s') . ".</p>";

            if ($objEmail->enviarEmail($asunto, $cuerpo)) {
                $this->info('Email sent successfully.');
            } else {
                $this->error('Failed to send email.');
            }

            // Clean up
            unlink($filePath);
            $this->info('Temporary file removed.');

        } catch (Exception $e) {
            $this->error('An error occurred: ' . $e->getMessage());
            Log::error('Error in EmailReporteDiferenciaCostos command: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
