<?php

namespace App\Services\Liquidaciones\Collections;

use App\Services\Liquidaciones\DTOs\LiquidacionDetalleConceptoDTO;
use Illuminate\Support\Collection;

class LiquidacionDetalleConceptosCollection extends Collection
{
    protected mixed $allowedType = LiquidacionDetalleConceptoDTO::class;
}
