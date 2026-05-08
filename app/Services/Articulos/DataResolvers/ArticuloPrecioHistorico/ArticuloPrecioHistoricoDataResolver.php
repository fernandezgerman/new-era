<?php

namespace App\Services\Articulos\DataResolvers\ArticuloPrecioHistorico;

use App\Models\ArticuloCostoHistorico;
use App\Models\ArticuloPrecioHistorico;

interface ArticuloPrecioHistoricoDataResolver
{
    public function resolve(ArticuloPrecioHistorico $articuloPrecioHistorico): array;

}
