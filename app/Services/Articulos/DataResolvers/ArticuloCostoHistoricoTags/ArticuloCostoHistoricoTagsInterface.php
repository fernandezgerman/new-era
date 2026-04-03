<?php

namespace App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags;

use App\Models\ArticuloCostoHistorico;

interface ArticuloCostoHistoricoTagsInterface
{
    public function resolve(ArticuloCostoHistorico $articuloCostoHistorico): array;

}
