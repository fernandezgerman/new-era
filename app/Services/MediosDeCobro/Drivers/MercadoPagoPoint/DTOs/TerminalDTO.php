<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\DTOs;

class TerminalDTO
{
    public ?string $id = null;
    public ?int $pos_id = null;
    public ?string $store_id = null;
    public ?string $external_pos_id = null;
    public ?string $operating_mode = null;
}
