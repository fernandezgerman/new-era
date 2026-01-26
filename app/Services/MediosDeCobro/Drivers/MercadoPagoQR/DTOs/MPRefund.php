<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs;

class MPRefund
{
    public ?string $id = null;
    public ?string $transaction_id = null;
    public ?string $amount = null;
    public ?string $status = null;
    public ?string $reference_id = null;
}
