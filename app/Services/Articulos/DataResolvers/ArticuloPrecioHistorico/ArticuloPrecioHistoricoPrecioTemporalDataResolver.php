<?php

namespace App\Services\Articulos\DataResolvers\ArticuloPrecioHistorico;

use App\Models\ArticuloCostoHistorico;
use App\Models\ArticuloPrecioHistorico;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags\ArticuloCostoHistoricoTagsPorCompraDataResolver;
use Illuminate\Support\Arr;


class ArticuloPrecioHistoricoPrecioTemporalDataResolver extends AbstractArticuloPrecioHistoricoDataResolver implements ArticuloPrecioHistoricoDataResolver
{

    public function resolve(ArticuloPrecioHistorico $articuloPrecioHistorico): array
    {
        $nuevaSucursal = get_entity_or_fail('Sucursal', Arr::get($articuloPrecioHistorico->newvalues,'idsucursal'), true);
        $viejaSucursal = get_entity_or_fail('Sucursal', Arr::get($articuloPrecioHistorico->oldvalues,'idsucursal'), true);

        $nuevaListaDePrecios = get_entity_or_fail('Lista', Arr::get($articuloPrecioHistorico->newvalues,'idlistaprecio'), true);
        $viejaListaDePrecios = get_entity_or_fail('Lista', Arr::get($articuloPrecioHistorico->oldvalues,'idlistaprecio'), true);

        return [
            ...parent::resolve($articuloPrecioHistorico),
            'accion' => Arr::get($articuloPrecioHistorico->newvalues, 'id') > 0 ? 'Edito' : 'Agrego',
            'nuevaSucursal' => $nuevaSucursal,
            'viejaSucursal' => $viejaSucursal,
            'nuevaListaDePrecios' => $nuevaListaDePrecios,
            'viejaListaDePrecios' => $viejaListaDePrecios,
        ];
    }
}
