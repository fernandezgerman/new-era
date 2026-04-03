<?php

namespace App\Services\Articulos;

use App\Models\Articulo;
use App\Models\ArticuloCostoHistorico;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoArticuloInsertDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoArticuloUpdateDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoCompraDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoConfiguracionDePreciosDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoRecalculoDataResolver;
use App\Services\Articulos\Enums\ArticulosCostoHistoricoMotivos;
use Aws\Panorama\Exception\PanoramaException;
use Exception;
use Illuminate\Support\Facades\DB;

class ArticulosManager
{

    public function getArticuloHistoricoCostos(Articulo $articulo): array
    {
        $historico = ArticuloCostoHistorico::where('idarticulo', $articulo->id)
            ->orderBy('id', 'desc')
            ->limit(15)
            ->get();

        $response = [];
        foreach($historico as $item)
        {
            $dataResolver = match ($item->medio) {
                ArticulosCostoHistoricoMotivos::ARTICULOS_UPDATE->value => ArticuloCostoHistoricoArticuloUpdateDataResolver::class,
                ArticulosCostoHistoricoMotivos::ARTICULOS_INSERT->value => ArticuloCostoHistoricoArticuloInsertDataResolver::class,
                ArticulosCostoHistoricoMotivos::RECALCULO->value => ArticuloCostoHistoricoRecalculoDataResolver::class,
                ArticulosCostoHistoricoMotivos::COMPRA->value => ArticuloCostoHistoricoCompraDataResolver::class,
                ArticulosCostoHistoricoMotivos::CONF_PRECIOS->value => ArticuloCostoHistoricoConfiguracionDePreciosDataResolver::class,
                default => throw new Exception('EL medio del historico de costos no fue definido'),
            };

            $response[] = app($dataResolver)->resolve($item);
        }
        return $response;
    }
}
