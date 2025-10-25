<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs;

class MPOrderTransactionsDTO
{
    /** @var MPOrderPaymentDTO[] */
    public array $payments = [];
}
