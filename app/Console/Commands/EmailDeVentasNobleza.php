<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use phpDocumentor\Parser\Exception;

class EmailDeVentasNobleza extends Command
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
    protected $signature = 'email:nobleza-ventas {--date=} {--to=}';

    public function handle()
    {
        // Include legacy classes used by the original script
        include_once(config('legacy.legacy_base_directory') . 'clases/log/clsEnvioEmail.php'); // kept for BC if needed elsewhere
        include_once(config('legacy.get_directorio_abm') . 'clsGETVentasNobleza.php');
        include_once(config('legacy.get_directorio') . 'clsIni.php');
        include_once(config('legacy.get_directorio_coneccion') . 'clsConnection.php');

        try {
            // 1) Determine date range (last Sun-Sat week ending on last Sunday before/at base date)
            $baseDateOpt = $this->option('date');
            $fecha = $baseDateOpt ? date('Y-m-j', strtotime($baseDateOpt)) : date('Y-m-j');

            // emulate legacy loop to find last Sunday
            for ($i = 0; $i < 8; $i++) {
                $fecha = date('Y-m-j', strtotime('-1 day', strtotime($fecha)));
                $x = strtotime($fecha);
                if (date('D', $x) === 'Sun') {
                    $fechaHasta = $x;
                    $fechaDesde = strtotime('-6 day', $x);
                    break;
                }
            }

            if (!isset($fechaDesde) || !isset($fechaHasta)) {
                throw new \RuntimeException('No se pudo calcular el rango de fechas (desde/hasta).');
            }

            // 2) Prepare file paths and names
            $dirBase = rtrim(config('legacy.get_dir'), '/');
            $directorio = $dirBase . '/info/csv/';
            if (!is_dir($directorio)) {
                @mkdir($directorio, 0775, true);
            }
            $archivoNombre = 'vts_nobleza_del_' . date('Y-m-j', $fechaDesde) . '_al_' . date('Y-m-j', $fechaHasta);
            $archivoRuta = $directorio . $archivoNombre;

            // 3) Fetch data via legacy SP classes
            $sp = new \clsGETVentasNobleza();
            $sp->definirParametros(date('Y-m-j', $fechaDesde), date('Y-m-j', $fechaHasta));

            $objCon = new \clsConnection();
            $res = $objCon->execute($sp);

            // 4) Write CSV
            $fp = fopen($archivoRuta, 'w+');
            if ($fp === false) {
                throw new \RuntimeException('No se pudo crear el archivo CSV en: ' . $archivoRuta);
            }
            $valores = $sp->getArrayResultado();
            $cabecera = ['Sucursal', 'Codigo', 'Descripcion', 'cantidad', 'mes'];
            fputcsv($fp, $cabecera);
            for ($i = 0; $i < $res->size(); $i++) {
                fputcsv($fp, $valores[$i]);
            }
            fclose($fp);

            // 5) Prepare email data and recipients
            $fechaDesdeStr = date('Y-m-j', $fechaDesde);
            $fechaHastaStr = date('Y-m-j', $fechaHasta);
            $subject = 'Ventas de nobleza y massalin desde el ' . $fechaDesdeStr . ' al ' . $fechaHastaStr;

            $toOption = $this->option('to');
            $recipients = [];
            if ($toOption) {
                // allow comma-separated list; names unknown, only emails
                foreach (explode(',', $toOption) as $email) {
                    $email = trim($email);
                    if ($email !== '') {
                        $recipients[] = ['email' => $email, 'name' => explode('@', $email)[0]];
                    }
                }
            } else {
                foreach ((array)config('mail.destinatarios.ventas_nobleza', []) as $destinatario) {
                    $cfg = config('mail.emails.' . $destinatario);
                    if ($cfg) {
                        $recipients[] = ['email' => Arr::get($cfg, 'email'), 'name' => Arr::get($cfg, 'name')];
                    }
                }
            }

            if (empty($recipients)) {
                throw new \RuntimeException('No hay destinatarios configurados para el envío.');
            }

            // 6) Send email using Laravel Mail and Blade template
            Mail::send('emails.ventas_nobleza', [
                'fechaDesde' => $fechaDesdeStr,
                'fechaHasta' => $fechaHastaStr,
            ], function ($message) use ($recipients, $subject, $archivoRuta, $archivoNombre) {
                foreach ($recipients as $rcp) {
                    if (!empty($rcp['email'])) {
                        if (!empty($rcp['name'])) {
                            $message->to($rcp['email'], $rcp['name']);
                        } else {
                            $message->to($rcp['email']);
                        }
                    }
                }
                $message->subject($subject);
                $message->attach($archivoRuta, ['as' => $archivoNombre]);
            });

            $this->info('Email enviado correctamente: ' . $subject);
            $this->info('Archivo generado: ' . $archivoRuta);
            return self::SUCCESS;
        } catch (\Throwable $e) {
            // On error: notify technical recipient as legacy script did
            try {
                $techEmail = config('legacy.get_correo_destinatario_tecnico');
                $techName = optional(config('mail.emails.sistemas'))['name'] ?? 'Soporte Sistemas';
                $html = '<p>Error al ejecutar el cron semanal de Nobleza.</p>'
                    . '<p>Fecha: ' . date('F j, Y, g:i a') . '</p>'
                    . '<p>Descripción error:<br/>' . e($e->getMessage()) . '</p>';
                Mail::send([], [], function ($message) use ($techEmail, $techName, $html) {
                    $message->to($techEmail, $techName)
                        ->subject('Error al notificar ventas de nobleza.')
                        ->setBody($html, 'text/html');
                });
            } catch (\Throwable $inner) {
                // ignore secondary failures
            }
            Log::error('EmailDeVentasNobleza failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            $this->error('Fallo el envío: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
