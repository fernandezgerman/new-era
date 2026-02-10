<?php
namespace App\Services\RendicionesStock\Collections;

use App\Services\MediosDeCobro\DTOs\OrderDetalleDTO;
use Illuminate\Support\Collection;

class RendicionStockDetalleCollection extends Collection
{
    protected mixed $allowedType = RendicionStockDetalle::class;
}

