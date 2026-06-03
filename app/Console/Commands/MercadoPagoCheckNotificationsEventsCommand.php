<?php

namespace App\Console\Commands;

use App\Mail\MercadoPagoNotificationEventsReport;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQROrderSql;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class MercadoPagoCheckNotificationsEventsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mercado-pago:check-notifications-events';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks for Mercado Pago QR orders with processed status but not approved in sales and sends an email if found.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Checking Mercado Pago notification events...');

        $records = MercadoPagoQROrderSql::query()
            ->join('ventasucursalcobros as vsc', 'mercadopagoqrorders.ventasucursalcobroid', '=', 'vsc.id')
            ->leftJoin('movimientocajaventasucursalcobro as mcv', 'vsc.id', '=', 'mcv.idventasucursalcobro')
            ->where('vsc.estado', '!=', 'aprobado')
            ->where('mercadopagoqrorders.estado', '=', 'processed')
            ->select([
                'mercadopagoqrorders.id',
                'vsc.id as vsc_id',
                'vsc.estado',
                'vsc.idsucursal',
                'mcv.id as mcv_id'
            ])
            ->limit(100)
            ->get();

        if ($records->isNotEmpty()) {
            $this->warn('Found ' . $records->count() . ' records. Sending email...');

            $emailConfig = config('mail.emails.sistemas');
            if ($emailConfig && isset($emailConfig['email'])) {
                Mail::to($emailConfig['email'])->send(new MercadoPagoNotificationEventsReport($records));
                $this->info('Email sent successfully to ' . $emailConfig['email']);
            } else {
                $this->error('Email configuration for "sistemas" not found.');
            }
        } else {
            $this->info('No records found.');
        }

        return 0;
    }
}
