<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Exception;
use clsGETComparativoDiario;
use clsConnection;
use emailPorHoraVentasGanancias;
use clsEnvioEmail;

class ReporteGananciasPorHoraCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reporte:ganancias-por-hora';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrated command from mtihweb/cronNotificacionesGanancias.php. Generates and sends hourly profit reports.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting ReporteGananciasPorHoraCommand...');

        // Load legacy environment if not already loaded (though Laravel should handle the includes)
        // We replicate the logic from the original cron script

        try {
            $this->loadLegacyDependencies();

            set_time_limit(10000);

            // traigo los datos
            $fecha = date('Y-m-d', strtotime("+1 seconds"));
            $hora = (int)date('H', strtotime("+1 seconds")) - 1;

            $this->info("Processing data for date: $fecha, hour: $hora");

            $sp = new clsGETComparativoDiario();
            $sp->definirParametros($fecha, $hora);

            $objCon = new clsConnection();
            $objCon->execute($sp);

            $data = $sp->getArrayResultado();

            // envio el email
            $email = new emailPorHoraVentasGanancias();
            // Defino destinatarios
            $email->send($data, array(), $fecha, $hora);

            $this->info('Report sent successfully.');

        } catch (Exception $e) {
            $this->error('Error executing report: ' . $e->getMessage());

            // Replicate error handling from original script
            try {
                if (class_exists('clsEnvioEmail')) {
                    $objEmail = new clsEnvioEmail();
                    $objEmail->agregarDestinatario(config('legacy.get_correo_destinatario_tecnico'), config('mail.emails.sistemas.name'));

                    $hora = $hora ?? date('H');
                    $mensaje = "
                         <p>Error al ejecutar el cron de ganancias a las " . $hora . "hs!!</p>
                         <p>Fecha: " . date("F j, Y, g:i a") . "</p>
                         <p>Descripci&oacute;n error: </br>
                         " . $e->getMessage() . "
                         </p>
                         ";
                    $objEmail->enviarEmail("Error al reporte GANANCIAS/CANTIDADES por hora.", $mensaje);
                }
            } catch (Exception $e2) {
                $this->error('Failed to send error notification email: ' . $e2->getMessage());
            }

            Log::info($e->getMessage(), $e->getTrace());
            return 1;
        }

        return 0;
    }

    /**
     * Loads legacy dependencies as done in the original script.
     */
    private function loadLegacyDependencies()
    {
        // These constants/configs should be defined in Laravel's config/legacy.php
        $legacyDir = config('legacy.get_directorio');
        $legacyConn = config('legacy.get_directorio_coneccion');
        $legacyUtiles = config('legacy.get_directorio_utiles');
        $legacyAbm = config('legacy.get_directorio_abm');

        require_once($legacyDir . 'clases/emails/emailPorHoraVentasGanancias.php');
        require_once($legacyDir . 'clsIndicePaginas.php');
        require_once($legacyDir . 'clsIni.php');
        require_once($legacyConn . 'clsConnection.php');
        require_once($legacyUtiles . 'clsNumeraciones.php');
        require_once($legacyAbm . 'clsGETComparativoDiario.php');
        require_once($legacyAbm . 'clsGETComparativoDiarioWarning.php');
        require_once(config('legacy.legacy_base_directory') . 'clases/log/clsEnvioEmail.php');
    }
}
