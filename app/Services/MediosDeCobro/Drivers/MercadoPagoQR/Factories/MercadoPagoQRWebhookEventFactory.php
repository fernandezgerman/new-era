<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\DTOs\WebhookEventDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoQRWebhookEventDTO;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class MercadoPagoQRWebhookEventFactory
{
    public static function fromWebhook(WebhookEventDTO $event): MercadoPagoQRWebhookEventDTO
    {
        // Normalize stdClass to associative array for safe access
        $payload = json_decode(json_encode($event->content ?? new \stdClass()), true) ?: [];

        $dto = new MercadoPagoQRWebhookEventDTO();

        $dto->action = Arr::get($payload, 'action');
        $dto->notification_type = Arr::get(explode('.', $dto->action), 0);
        $dto->api_version = Arr::get($payload, 'api_version');
        $dto->application_id = Arr::get($payload, 'application_id');
        $dto->date_created = Arr::get($payload, 'date_created');
        $dto->live_mode = (bool) Arr::get($payload, 'live_mode', false);
        // Top-level type of the event (e.g., "order")
        $dto->type = Arr::get($payload, 'type');
        $dto->user_id = Arr::get($payload, 'user_id');

        // Optional convenience duplicates from the webhook
        $dto->data_external_reference = Arr::get($payload, 'data_external_reference');
        $dto->data_id = Arr::get($payload, 'data_id');

        // Parse the nested Mercado Pago order data using the existing factory
        $dataArray = (array) Arr::get($payload, 'data', []);
        if (!empty($dataArray)) {
            $dto->data = MercadoPagoOrderResponseFactory::fromArray($dataArray);
        }

        return $dto;
    }
}
