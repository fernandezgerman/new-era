<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs;

class MPOrderPaymentDTO
{
    public ?string $id = null;
    public ?string $amount = null;
    public ?string $status = null;
    public ?string $reference_id = null;
    public ?string $status_detail = null;
}
