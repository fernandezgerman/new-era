<?php

namespace App\Console\Commands;

use clsEnvioEmail;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use mtihweb\clases\emails\emailSemanalComparativoExcel;


class EmailSemanalComparativo extends Command
{
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envía por email el reporte semanal de ventas de Nobleza y Massalin';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:comparativo-semanal {--date=}';

    public function handle()
    {

        include_once(config('legacy.legacy_base_directory') . 'clases/log/clsEnvioEmail.php');
        include_once(config('legacy.get_directorio') . 'clsIndicePaginas.php');
        include_once(config('legacy.get_directorio') . 'clsIni.php');
        include_once(config('legacy.get_directorio_coneccion') . 'clsConnection.php');
        include_once(config('legacy.get_directorio_utiles') . 'clsNumeraciones.php');

        include_once(config('legacy.get_directorio') . 'clases/emails/emailSemanalComparativoExcel.php');

        try {

            $hoy = getdate();
            if($this->option('date'))
            {
                $hoy = [];
                $aux = explode("-",$this->option('date'));
                $hoy['year'] = (int)$aux[0];
                $hoy['mon'] = (int)$aux[1];
                $hoy['mday'] = (int)$aux[2];
            }

            $em = new emailSemanalComparativoExcel(Arr::get($hoy, 'year') . '-' . Arr::get($hoy, 'mon') . '-' . Arr::get($hoy, 'mday'), false);
            $em->send();

        } catch (Exception $e) {
            $objEmail = new clsEnvioEmail();
            $objEmail->agregarDestinatario(config('legacy.get_correo_destinatario_tecnico'), config('mail.emails.sistemas.name'));
            $mensaje = "
                     <p>Error al ejecutar el cron 8AM!! (Exportacion excel comparativo)</p>
                     <p>Fecha: " . date("F j, Y, g:i a") . "</p>
                     <p>Descripci&oacute;n error: </br>
                     " . $e->getMessage() . "
                     </p>
                     ";
            $objEmail->enviarEmail("Error al exportar el excel comparativo.", $mensaje);
            Log::info($e->getMessage(), $e->getTrace());
        }
    }
}
