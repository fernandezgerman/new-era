<?php

namespace App\Services\RendicionesStock;

use App\Models\Articulo;
use App\Models\CompraDetalle;
use App\Models\Existencia;
use App\Models\RendicionStock;
use App\Models\RendicionStockDetalle;
use App\Models\Rubro;
use App\Models\Sucursal;
use App\Models\User;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\RendicionesStock\Enums\RendicionStockEstados;

//use Illuminate\Database\Query\Builder;
use App\Services\Stock\StockManager;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RendicionesStockManager
{
    public function __construct(
        protected ActualizacionesManager $actualizacionesManager,
        protected StockManager           $stockManager,
    )
    {

    }

    public function abrirRendicionStock(
        Rubro    $rubro,
        Sucursal $sucursal
    ): RendicionStock
    {
        $rendicionStock = new RendicionStock();

        $rendicionStock->idsucursal = $sucursal->id;
        $rendicionStock->idrubro = $rubro->id;
        $rendicionStock->idusuario = auth()->user()->id;
        $rendicionStock->idestado = RendicionStockEstados::PENDIENTE->value;
        $rendicionStock->fechaapertura = Carbon::now()->format('Y-m-d H:i:s');
        $rendicionStock->diferencia = 0;
        $rendicionStock->save();

        return $rendicionStock;
    }

    public function getRendicionesStock(

        User                  $usuario,
        Sucursal              $sucursal = null,
        Carbon                $fechaApertura = null,
        RendicionStockEstados $estado = null
    )
    {
        $query = RendicionStock::query()
            ->select('rendicionesstock.*')
            ->join('usuariossucursales', 'usuariossucursales.idsucursal', '=', 'rendicionesstock.idsucursal')
            /* Filtros de visualizacion por usuario */
            ->where('usuariossucursales.idusuario', $usuario->id)
            ->where('usuariossucursales.activo', 1);

        if ($fechaApertura !== null) {
            /* Mustra solo las rendiciones del dia */
            $query->where(db::raw(' date(rendicionesstock.fechaapertura)'), $fechaApertura->format('Y-m-d'));
        }

        if ($estado !== null) {
            $query->where('rendicionesstock.idestado', $estado->value);
        }

        if ($sucursal !== null) {
            $query->where('rendicionesstock.idsucursal', $sucursal->id);
        }

        return $query->get();
    }

    /**
     * @param RendicionStock $rendicionStock
     * @return Builder
     */
    private function getArticulosParaRendicionQueryBuilder(
        RendicionStock $rendicionStock
    ): Builder
    {
        return Articulo::query()
            ->select(
                DB::raw("
                rendicionstockdetalle.*,
                articulos.nombre as articulo,
                articulos.codigo as codigoArticulo,
                articulos.costo as costoArticulo,
                articulos.id as idarticulo,
                existencias.cantidad as existencia,
                listadetalle.precio as precioVentaArticulo,
                DATE_FORMAT(fechahora,'%d %H:%i:%s') as hora,
                (select max(comprasdetalle.id)
                from compras inner join comprasdetalle on compras.id = comprasdetalle.idcabecera
                where idsucursal = " . $rendicionStock->sucursal->id . " and idarticulo = articulos.id) as ultimaCompraDetalleId,
                " . $rendicionStock->id . " as idrendicion
                "))
            ->join('existencias', function ($join) use ($rendicionStock) {
                $join->on('existencias.idarticulo', '=', 'articulos.id')
                    ->on('existencias.idsucursal', DB::raw($rendicionStock->sucursal->id));
            })
            ->join('listadetalle', function ($join) use ($rendicionStock) {
                $join->on('listadetalle.idarticulo', '=', 'articulos.id')
                    ->on('listadetalle.idlista', DB::raw($rendicionStock->sucursal->idlista));
            })
            ->leftJoin('rendicionstockdetalle', function ($join) use ($rendicionStock) {
                $join->on('rendicionstockdetalle.idarticulo', '=', 'articulos.id')
                    ->on('rendicionstockdetalle.idrendicion', DB::raw($rendicionStock->id));
            })
            ->where('articulos.idrubro', $rendicionStock->idrubro)
            ->where('articulos.activo', 1)
            ->where(function ($query) use ($rendicionStock) {
                $query->whereNotNull('existencias.idarticulo')
                    ->orWhereNotNull('rendicionstockdetalle.id');
            })
            ->where(function ($query) use ($rendicionStock) {
                $query->whereNull('articulos.escompuesto')
                    ->orWhere('articulos.escompuesto', '<>', 1);
            })
            ->orderBy(DB::raw('articulos.nombre ,rendicionstockdetalle.fechahora '));
    }

    /**
     * @param RendicionStock $rendicionStock
     * @return Collection
     */
    public function getArticulosPendientes(RendicionStock $rendicionStock): Collection
    {
        $pendientes = $this->getArticulosParaRendicionQueryBuilder($rendicionStock)
            ->whereNull('rendicionstockdetalle.id')
            ->get();

        foreach ($pendientes as $pendiente) {

            $pendiente['ultimaCompra'] = null;
            if (!blank($pendiente['ultimaCompraDetalleId'])) {
                $compraDetalle = CompraDetalle::query()->where('id', $pendiente['ultimaCompraDetalleId'])->first();
                $compraDetalle->load('compra');
                $pendiente['ultimaCompra'] = $compraDetalle;
            }
        }

        return $pendientes;
    }

    /**
     *
     */
    public function getArticulosRendidos(RendicionStock $rendicionStock): Collection
    {
        return $this->getArticulosParaRendicionQueryBuilder($rendicionStock)
            ->whereNotNull('rendicionstockdetalle.id')
            ->orderBy(DB::raw('articulos.nombre ,rendicionstockdetalle.id desc , rendicionstockdetalle.id'))
            ->get();

    }

    /**
     * @param RendicionStock $rendicionStock
     * @param Articulo $articulo
     * @param float $cantidadRendida
     * @return RendicionStockDetalle
     */
    public function rendirArticulo(
        RendicionStock $rendicionStock,
        Articulo       $articulo,
        float          $cantidadRendida
    ): RendicionStockDetalle
    {
        $existenciaAnterior = Existencia::query()
            ->where('idarticulo', $articulo->id)
            ->where('idsucursal', $rendicionStock->idsucursal)
            ->first();

        $existenciaNueva = $this->stockManager->setStock(
            $articulo,
            $rendicionStock->sucursal,
            $cantidadRendida
        );


        $detallesRendicion = $this->getArticulosParaRendicionQueryBuilder($rendicionStock)->where('articulos.id', $articulo->id)->first();

        $rendicionStockDetalle = new RendicionStockDetalle();

        $rendicionStockDetalle->idrendicion = $rendicionStock->id;
        $rendicionStockDetalle->idarticulo = $articulo->id;
        $rendicionStockDetalle->cantidadsistema = $existenciaAnterior->cantidad;
        $rendicionStockDetalle->cantidadrendida = $existenciaNueva->cantidad;
        $rendicionStockDetalle->fechahora = Carbon::now()->format('Y-m-d H:i:s');
        $rendicionStockDetalle->costo = $detallesRendicion->costoArticulo;
        $rendicionStockDetalle->precioventa = $detallesRendicion->precioVentaArticulo;
        $rendicionStockDetalle->valorsistema = $detallesRendicion->precioVentaArticulo * $rendicionStockDetalle->cantidadsistema;
        $rendicionStockDetalle->valorrendido = $detallesRendicion->precioVentaArticulo * $rendicionStockDetalle->cantidadrendida;

        $rendicionStockDetalle->save();

        $this->actualizacionesManager->ActualizarArticuloConStockVisible($articulo, $rendicionStock->sucursal);

        return $rendicionStockDetalle->load('articulo');
    }
}
