<?php

namespace App\Services\QueryResolvers\Queries\ReporteMercadoPago;

use App\Models\Articulo;
use App\Models\Compra;
use App\Models\MovimientoCaja;
use App\Models\MovimientoCajaVentaSucursalCobro;
use App\Models\RendicionStock;
use App\Models\VentaSucursal;

use App\Services\QueryResolvers\Contracts\QueryResolverAbstractClass;
use App\Services\QueryResolvers\Queries\ReporteMercadoPago\DTOs\ReporteMercadoPagoQueryResolverFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Mockery\Exception;


class ReporteMercadoPagoResolver extends QueryResolverAbstractClass
{

    private Builder $queryBuilder;

    public function __construct(private ReporteMercadoPagoQueryResolverFilters $filters)
    {
        $movimientosQuery = MovimientoCaja::query()
            ->select('id', db::raw("'movimiento' as tipo"), 'fechahoramovimiento', 'importe')
            ->where('idsucursal', $filters->sucursal->id)
            ->where('fechahoramovimiento', '>=', $filters->fechaHoraDesde)
            ->where('fechahoramovimiento', '<=', $filters->fechaHoraHasta)
            ->where('idmotivo', config('medios_de_cobro.drivers.MercadoPagoQR.id_motivo_movimiento_caja'))
        ;
/*
        $comprasQueryX = Compra::query()
            ->select('compras.id', db::raw("'compra' as tipo"), DB::raw('max(fechahora) as fechahora'),db::raw('max(totalfactura) as importe'))
            ->join('comprasdetalle', 'comprasdetalle.idcabecera', '=', 'compras.id')
            ->where('comprasdetalle.idarticulo', config('medios_de_cobro.drivers.MercadoPagoQR.gastos.articuloId'))
            ->where('idsucursal', $filters->sucursal->id)
            ->where('idsucursal', $filters->sucursal->id)
            ->where('fechahora', '>=', $filters->fechaHoraDesde)
            ->where('fechahora', '<=', $filters->fechaHoraHasta)
            ->groupBy('compras.id')
        ;*/
        $this->queryBuilder = $movimientosQuery; # $comprasQueryX->union($movimientosQuery);

    }

    protected function getBuilder(): Builder
    {
        return $this->queryBuilder;
    }

    protected function applyFilters(Builder $query): Builder
    {

        return $query;
    }

    protected function applyOrder(Builder $query): Builder
    {
        $query->orderBy('id', 'desc');
        return $query;
    }

    protected function decorateResult($item)
    {
        if($item->tipo === 'movimiento'){
            $movimiento = $item->toArray();
            $movimiento['info'] = MovimientoCajaVentaSucursalCobro::where('idmovimientocaja', $item->id)
                ->with('ventaSucursalCobro')
                ->with('ventaSucursalCobro.cobroSucursalGastos.gasto')
                ->with('ventaSucursalCobro.usuario')
                ->with('ventaSucursalCobro.MercadoPagoOrders')
                ->with('ventaSucursalCobro.MercadoPagoOrders.payments')
                ->first();

            return $movimiento;
        }

        return $item;
    }
}
