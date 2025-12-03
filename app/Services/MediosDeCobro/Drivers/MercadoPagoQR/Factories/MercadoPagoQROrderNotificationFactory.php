<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\DTOs\WebhookEventDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQROrderNotification;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQROrderSql;
use Illuminate\Support\Arr;

class MercadoPagoQROrderNotificationFactory
{
    /**
     * Crea un modelo MercadoPagoQROrderNotification (no persistido) a partir
     * de la orden local y el evento webhook recibido.
     */
    public static function fromOrderAndWebhook(
        MercadoPagoQROrderSql $order,
        WebhookEventDTO $event
    ): MercadoPagoQROrderNotification {
        // Normalizar el contenido del webhook a array
        $payload = json_decode(json_encode($event->content ?? new \stdClass()), true) ?: [];

        // Determinar el estado de la notificación
        // Preferimos data.status; si no existe, intentamos con data.status_detail; como último recurso, el prefijo de action
        $status = Arr::get($payload, 'data.status')
            ?? Arr::get($payload, 'data.status_detail')
            ?? (function () use ($payload) {
                $action = Arr::get($payload, 'action');
                return $action ? explode('.', $action)[1] : null;
            })();

        $model = new MercadoPagoQROrderNotification();
        $model->mercadopagoqrorderid = $order->id;
        $model->estado = $status;
        $model->notificationdata = $payload; // se castea a array en el modelo

        return $model;
    }
}
