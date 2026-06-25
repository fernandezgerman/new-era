<?php

namespace App\Services\QueryResolvers\Queries\LimpiezaDeArticulos;

use App\Models\Articulo;
use App\Models\Compra;
use App\Models\RendicionStock;
use App\Models\VentaSucursal;

use App\Services\QueryResolvers\Contracts\QueryResolverAbstractClass;
use App\Services\QueryResolvers\Queries\LimpiezaDeArticulos\DTOs\LimpiezaDeArticulosQueryResolverFilters;
use App\Services\QueryResolvers\Queries\LimpiezaDeArticulos\Enums\LimpiezaDeArticulosQueryResolverTipoDeReporte;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class LimpiezaDeArticulosQueryResolver extends QueryResolverAbstractClass
{

    private Builder $queryBuilder;

    public function __construct(private LimpiezaDeArticulosQueryResolverFilters $filters)
    {
        if (
            $this->filters->tipoDeReporte === LimpiezaDeArticulosQueryResolverTipoDeReporte::ARTICULOS_COMPRADOS_HACE_X) {


            $subQuery = Compra::query()
                ->select(DB::raw('max(idcabecera) as idcompra'), 'idarticulo', 'idsucursal')
                ->join('comprasdetalle', 'compras.id', '=', 'comprasdetalle.idcabecera')
                ->groupBy('idarticulo', 'idsucursal');

            if(!blank($filters->sucursal))
            {
                $subQuery->where('idsucursal', $filters->sucursal->id);
            }

            if(!blank($filters->articulo))
            {
                $subQuery->where('idarticulo', $filters->articulo->id);
            }

            if(!blank($filters->rubro))
            {
                $subQuery->join('articulos', 'articulos.id', '=', 'idarticulo');
                $subQuery->where('idrubro', $filters->rubro->id);
            }

            $this->queryBuilder = Articulo::query()
                ->select('articulos.codigo','articulos.nombre', 'articulos.id', 'compras.id as compraId',
                    'compras.fechahora', db::raw('datediff(now(), compras.fechahora) ult_compra'), db::raw('rubros.nombre as rubroNombre'),
                    'sucursales.id as sucursalId', 'sucursales.nombre as sucursalNombre', 'existencias.cantidad')
                ->join('existencias', 'articulos.id', '=', 'existencias.idarticulo')
                ->join('sucursales', 'sucursales.id', '=', 'existencias.idsucursal')
                ->join('rubros', 'rubros.id', '=', 'articulos.idrubro')
                ->JoinSub($subQuery,
                    'ultimacompra',
                    function ($join) {
                        $join->on('articulos.id', '=', 'ultimacompra.idarticulo')
                            ->on('ultimacompra.idsucursal', '=', 'sucursales.id');
                    }
                )
                ->join('compras', 'ultimacompra.idcompra', '=', 'compras.id');
        }
    }

    protected function getBuilder(): Builder
    {
        return $this->queryBuilder;
    }

    protected function applyFilters(Builder $query): Builder
    {

        $query->where('existencias.cantidad', '<>', 0);

        if(!blank($this->filters->sucursal))
            $query->where('sucursales.id', '=', $this->filters->sucursal->id);

        if(!blank($this->filters->articulo))
            $query->where('articulos.id', '=', $this->filters->articulo->id);

        if(!blank($this->filters->rubro))
            $query->where('articulos.idrubro', '=', $this->filters->rubro->id);

        if(!blank($this->filters->diasDesdeUltimaCompra))
            $query->having('ult_compra', '>=', $this->filters->diasDesdeUltimaCompra);

        return $query;
    }

    protected function applyOrder(Builder $query): Builder
    {
        $query->orderBy('ult_compra', 'desc');
        return $query;
    }

    protected function decorateResult(\Illuminate\Pagination\LengthAwarePaginator $paginator): \Illuminate\Pagination\LengthAwarePaginator
    {

        $paginator->getCollection()->each(function ($item) {
         /*   $ultimaventaid = VentaSucursal::query()
                ->where('idsucursal', '=', $item->sucursalId)
                ->where('idarticulo', '=', $item->id)
                ->max('id');

            $ultimaventa = VentaSucursal::query()
                ->where('id', '=', $ultimaventaid);

            $item->ultima_venta = $ultimaventa->exists() ? $ultimaventa->first()->fechaenvio->diffInDays() : null; */

            $item->ultima_venta = null;

            $ultimaRendicion = RendicionStock::query()
                ->join('rendicionstockdetalle', 'rendicionstockdetalle.idrendicion', '=', 'rendicionesstock.id')
                ->where('idsucursal', '=', $item->sucursalId)
                ->where('idarticulo', '=', $item->id)
                ->orderBy('rendicionesstock.id', 'desc')
                ->with('rendicionstockdetalle')
                ->first();

            $item->ultima_rendicion = $ultimaRendicion;
        });

        return $paginator;
    }
}
