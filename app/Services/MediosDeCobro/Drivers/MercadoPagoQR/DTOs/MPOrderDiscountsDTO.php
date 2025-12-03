<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs;

class MPOrderDiscountsDTO
{
    /** @var array<int, array{new_total_amount:string,type:string}> */
    public array $payment_methods = [];
}
