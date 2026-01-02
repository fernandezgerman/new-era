<?php

namespace App\Services\MediosDeCobro\DTOs;

use App\Models\ModoDeCobro;
use App\Models\Sucursal;
use App\Models\User;
use App\Services\MediosDeCobro\DTOs\Collections\OrderDetalleDTOCollection;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoOrderResponseDTO;
use App\Services\MediosDeCobro\Enums\OrderPaymentChargeDetailTypeEnum;

class OrderPaymentChargeDetailDTO
{
    public ?string $externalId; //id
    public float $baseAmount;
    public string $name;
    public float $rate;
    public bool $payedByCustomer = false;
    public float $amount; //amounts.original
    public OrderPaymentChargeDetailTypeEnum $type;

}
