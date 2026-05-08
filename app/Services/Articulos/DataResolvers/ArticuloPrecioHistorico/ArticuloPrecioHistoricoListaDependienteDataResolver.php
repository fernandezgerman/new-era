<?php

namespace App\Services\Articulos\DataResolvers\ArticuloPrecioHistorico;

use App\Models\ArticuloCostoHistorico;
use App\Models\ArticuloPrecioHistorico;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags\ArticuloCostoHistoricoTagsPorCompraDataResolver;


class ArticuloPrecioHistoricoListaDependienteDataResolver  extends AbstractArticuloPrecioHistoricoDataResolver implements ArticuloPrecioHistoricoDataResolver
{

    public function resolve(ArticuloPrecioHistorico $articuloPrecioHistorico): array
    {
        return [
            ...parent::resolve($articuloPrecioHistorico),
        ];
    }
}
