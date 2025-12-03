<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs;

class MercadoPagoQRWebhookEventDTO
{
    const NOTIFICATION_TYPE_ORDER = "order";

    public ?string $action = null;

    public ?string $notification_type = null;
    public ?string $api_version = null;
    public ?string $application_id = null;

    public ?MercadoPagoOrderResponseDTO $data = null;

    public ?string $date_created = null;
    public bool $live_mode = false;
    /** Top-level type for the webhook event (e.g., "order") */
    public ?string $type = null;
    public ?string $user_id = null;

    // Convenience duplication from the webhook payload
    public ?string $data_external_reference = null;
    public ?string $data_id = null;
}
