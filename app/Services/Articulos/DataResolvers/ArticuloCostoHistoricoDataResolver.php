<?php

namespace App\Services\Articulos\DataResolvers;

use App\Models\ArticuloCostoHistorico;

interface ArticuloCostoHistoricoDataResolver
{
    public function resolve(ArticuloCostoHistorico $articuloCostoHistorico): array;

}
