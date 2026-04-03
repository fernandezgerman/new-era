<?php

namespace App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags;

use App\Models\ArticuloCostoHistorico;
class ArticuloCostoHistoricoTagsPorArticulosDataResolver implements ArticuloCostoHistoricoTagsInterface
{

    public function resolve(ArticuloCostoHistorico $articuloCostoHistorico): array
    {
        $usuario = $articuloCostoHistorico?->usuario?->nombre_completo;

        return [
            'usuario' => $usuario,
        ];
    }
}

