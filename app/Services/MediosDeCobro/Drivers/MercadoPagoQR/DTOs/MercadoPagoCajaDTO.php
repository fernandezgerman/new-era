<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs;

class MercadoPagoCajaDTO
{
    public ?int $user_id = null;
    public ?string $name = null;
    public ?int $category = null;
    public ?int $store_id = null;
    public ?string $external_id = null;
    public ?int $id = null;

    /**
     * Raw QR data as provided by the API. Expected keys: image, template_document, template_image
     */
    public ?array $qr = null;

    public ?string $status = null;
    public ?bool $fixed_amount = null;
    public ?string $uuid = null;

    public ?string $date_created = null;
    public ?string $date_last_updated = null;
    public ?string $external_store_id = null;
}
