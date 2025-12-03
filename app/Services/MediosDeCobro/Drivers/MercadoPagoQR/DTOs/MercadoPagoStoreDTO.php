<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs;

class MercadoPagoStoreDTO
{
    public string $id;
    public string $name;
    public ?string $date_creation = null;

    public ?string $address_line = null;
    public ?string $reference = null;
    public ?float $latitude = null;
    public ?float $longitude = null;

    public ?string $external_id = null;
}
