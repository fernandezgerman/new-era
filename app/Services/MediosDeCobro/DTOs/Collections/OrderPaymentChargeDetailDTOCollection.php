<?php

namespace App\Services\MediosDeCobro\DTOs\Collections;

use App\Services\MediosDeCobro\DTOs\OrderDetalleDTO;
use App\Services\MediosDeCobro\DTOs\OrderPaymentChargeDetailDTO;
use Illuminate\Support\Collection;

class OrderPaymentChargeDetailDTOCollection extends Collection
{
    protected mixed $allowedType = OrderPaymentChargeDetailDTO::class;
}

