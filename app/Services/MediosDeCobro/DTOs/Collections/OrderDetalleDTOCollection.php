<?php

namespace App\Services\MediosDeCobro\DTOs\Collections;

use App\Services\MediosDeCobro\DTOs\OrderDetalleDTO;
use Illuminate\Support\Collection;

class OrderDetalleDTOCollection extends Collection
{
    protected mixed $allowedType = OrderDetalleDTO::class;
}

