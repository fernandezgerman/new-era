<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs;

class MPOrderItemDTO
{
    public ?string $title = null;
    public ?string $unit_price = null;
    public ?int $quantity = null;
    public ?string $unit_measure = null;
    public ?string $external_code = null;
    /** @var array<int, array{id:string}>|null */
    public ?array $external_categories = null;
}
