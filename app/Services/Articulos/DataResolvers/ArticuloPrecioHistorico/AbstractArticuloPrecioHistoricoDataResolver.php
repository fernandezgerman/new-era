<?php

namespace App\Services\Articulos\DataResolvers\ArticuloPrecioHistorico;

use App\Models\ArticuloCostoHistorico;
use App\Models\ArticuloPrecioHistorico;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags\ArticuloCostoHistoricoTagsPorCompraDataResolver;


class AbstractArticuloPrecioHistoricoDataResolver implements ArticuloPrecioHistoricoDataResolver
{
    public function resolve(ArticuloPrecioHistorico $articuloPrecioHistorico): array
    {
        return [
            'id' => $articuloPrecioHistorico->id,
            'idcabecera' => $articuloPrecioHistorico->idcabecera,
            'tipo' => $articuloPrecioHistorico->tipo,
            'articulo' => $articuloPrecioHistorico->articulo,
            'lista' => $articuloPrecioHistorico->lista,
            'oldvalues' => $articuloPrecioHistorico->oldvalues,
            'newvalues' => $articuloPrecioHistorico->newvalues,
        ];
    }
}
