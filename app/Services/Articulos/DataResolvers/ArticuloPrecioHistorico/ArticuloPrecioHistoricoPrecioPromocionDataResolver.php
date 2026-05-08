<?php

namespace App\Services\Articulos\DataResolvers\ArticuloPrecioHistorico;

use App\Models\ArticuloCostoHistorico;
use App\Models\ArticuloPrecioHistorico;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags\ArticuloCostoHistoricoTagsPorCompraDataResolver;
use Illuminate\Support\Arr;


class ArticuloPrecioHistoricoPrecioPromocionDataResolver extends AbstractArticuloPrecioHistoricoDataResolver implements ArticuloPrecioHistoricoDataResolver
{

    public function resolve(ArticuloPrecioHistorico $articuloPrecioHistorico): array
    {

        $nuevaPromocion = get_entity_or_fail('Promocion', Arr::get($articuloPrecioHistorico->newvalues, 'promocion'), true);
        $viejaPromocion = get_entity_or_fail('Promocion', Arr::get($articuloPrecioHistorico->oldvalues, 'promocion'), true);

        return [
            ...parent::resolve($articuloPrecioHistorico),
            'accion' => Arr::get($articuloPrecioHistorico->newvalues, 'id') > 0 ? 'Edito' : 'Agrego',
            'nuevaPromocion' => $nuevaPromocion,
            'viejaPromocion' => $viejaPromocion,
        ];
    }
}
