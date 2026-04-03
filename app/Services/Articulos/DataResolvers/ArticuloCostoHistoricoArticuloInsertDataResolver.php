<?php

namespace App\Services\Articulos\DataResolvers;

use App\Models\ArticuloCostoHistorico;

class ArticuloCostoHistoricoArticuloInsertDataResolver extends ArticuloCostoHistoricoArticuloUpdateDataResolver
{
    public function resolve(ArticuloCostoHistorico $articuloCostoHistorico): array
    {
        return [
            ...parent::resolve($articuloCostoHistorico),
            'links' => null,
            'descripcion' => 'Definicion del costo al agregar el articulo'
        ];

    }

}
