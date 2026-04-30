<?php

namespace App\Services\ProcesamientoDeCostos;

use App\Models\ArticuloCostoHistorico;
use App\Models\Compra;
use App\Models\CompraDetalle;
use App\Models\TipoComprobante;
use App\Services\Articulos\Enums\ArticulosCostoHistoricoMotivos;
use App\Services\Compras\ComprasManager;
use App\Services\Compras\Enums\TipoComprobanteCompra;
use App\Services\ProcesamientoDeCostos\Factories\ProcesamientosDeCostosFactory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcesamientoDeCostosManager
{

    /**
     * Procesa los articulos de la compra para actualizar el costo si aplica
     * @param int $compraId
     * @return void
     * @throws \Throwable
     */
    public function procesarCostosDeCompra(int $compraId): void
    {

        $compra = get_entity_or_fail('Compra', $compraId);

        if($compra->idtipocomprobante != TipoComprobanteCompra::FACTURA->value)
            return;

        $compraDetalles = app(ComprasManager::class)->getCompraDetallesLimpiasQuery()
            ->where('compras.id', $compra->id)
            ->get();

        DB::transaction(function () use ($compraDetalles, $compra) {
            foreach ($compraDetalles as $compraDetalle) {
                /** Si aplica el costo nuevo */
                if (ProcesamientosDeCostosFactory::make()->shouldBeCostoSetted($compraDetalle)) {
                    $this->setCompraDetalleAsArticuloCosto($compraDetalle, ArticulosCostoHistoricoMotivos::COMPRA->value, null);
                }
            }
        });
    }

    protected function setCompraDetalleAsArticuloCosto(CompraDetalle $compraDetalle, string $motivo, ?string $descripcion = null): void
    {
        $compra = $compraDetalle->compra;
        $articulo = $compraDetalle->articulo;

        $articulo->costo = $compraDetalle->costo_con_impuestos;
        $articulo->idcompradetalle = $compraDetalle->id;
        $articulo->save();

        $articuloscostoshistorico = new ArticuloCostoHistorico();
        $articuloscostoshistorico->idarticulo = $articulo->id;
        $articuloscostoshistorico->idcompradetalle = $compraDetalle->id;
        $articuloscostoshistorico->fechahora = new Carbon();
        $articuloscostoshistorico->medio = $motivo;
        $articuloscostoshistorico->descripcion = $descripcion;
        $articuloscostoshistorico->idusuario = $compra->idusuario;
        $articuloscostoshistorico->save();
    }
    /**
     * Metodo para establecer el costo de articulos pertenecientes a una compra en los siguientes casos:
     * - Compra anulada
     * - Compra dudosa auditada como mal cargada o precio excepcional
     * @param int $compraId
     * @return void
     * @throws \Throwable
     */
    public function actualizarReferenciaDeCostos(int $compraId): void
    {
        $compra = get_entity_or_fail('Compra', $compraId);

        $compraDetalles = app(ComprasManager::class)->getCompraDetallesARecalcularQuery()
            ->where('compras.id', $compra->id)
            ->get();

        $this->actualizarReferenciaDeCostosPorDetalles($compraDetalles);
    }

    public function actualizarReferenciaDeCostoscompraDetallesIds(array $comprasDetalles): void
    {
        $compraDetalles = app(ComprasManager::class)->getCompraDetallesARecalcularQuery()
            ->whereIn('comprasdetalle.id', $comprasDetalles)
            ->get();

        $this->actualizarReferenciaDeCostosPorDetalles($compraDetalles);
    }
    private function actualizarReferenciaDeCostosPorDetalles(Collection $compraDetalles): void
    {

        DB::transaction(function () use ($compraDetalles) {
            foreach ($compraDetalles as $compraDetalle) {

                //Actualiza la referencia de ventas de compras anuladas
                $this->ActualizarVentaPorCompraDetalleAnulada($compraDetalle);

                $iddetalle = $compraDetalle->id;
                $articulo = $compraDetalle->articulo;
                $codigo = $articulo->codigo;

                //Si la compra no define costo del articulo, continua con el siguiente
                if($compraDetalle->articulo->idcompradetalle !== $compraDetalle->id)
                {
                    continue;
                }

                $articuloCostoHistorico = ArticuloCostoHistorico::query()
                    ->select('articuloscostoshistorico.*')
                    ->leftJoin('comprasdetalle', 'articuloscostoshistorico.idcompradetalle', '=', 'comprasdetalle.id')
                    ->leftJoin('compras', 'compras.id', '=', 'comprasdetalle.idcabecera')
                    ->leftJoin('comprasanuladas', 'compras.id', '=', 'comprasanuladas.idcompra')
                    ->leftJoin(db::raw('comprasanuladas as anulaciones'), 'compras.id', '=', 'anulaciones.idanulacion')
                    ->leftJoin('comprasdudosas', 'comprasdetalle.id', '=', 'comprasdudosas.idcompradetalle')
                    ->whereNull('comprasanuladas.idcompra')
                    ->where(function ($query) {
                        $query->whereNotIn('comprasdudosas.audicionresultado', [1, 3]);
                        $query->orWhereNull('comprasdudosas.audicionresultado');
                    })
                    ->whereNull('anulaciones.idanulacion')
                    ->where('articuloscostoshistorico.idarticulo', $compraDetalle->idarticulo)
                    ->whereNot('articuloscostoshistorico.idcompradetalle', $compraDetalle->id)
                    ->orderBy('articuloscostoshistorico.id', 'desc');

                Log::info('query: '. query_builder_to_raw_sql($articuloCostoHistorico));
                $articuloCostoHistorico = $articuloCostoHistorico->first();

                //Si existe un historico anterior
                if(!blank($articuloCostoHistorico)){
                    //Si el costo anterior es por una compra y no manual
                    if(!blank($articuloCostoHistorico->compradetalle))
                    {
                        $this->setCompraDetalleAsArticuloCosto(
                            $articuloCostoHistorico->compradetalle,
                            ArticulosCostoHistoricoMotivos::RECALCULO->value,
                            'Compra establecida por ser la anterior en el historial.'
                        );
                    }else{
                        //Si el costo es manual
                        $articulo = $compraDetalle->articulo;
                        $articulo->costo = $articuloCostoHistorico->precioauxiliar ;
                        $articulo->idcompradetalle = null;
                        $articulo->save();

                        $articuloscostoshistorico = new ArticuloCostoHistorico();
                        $articuloscostoshistorico->idarticulo = $articulo->id;
                        $articuloscostoshistorico->idcompradetalle = null;
                        $articuloscostoshistorico->fechahora = new Carbon();
                        $articuloscostoshistorico->descripcion = 'Precio manual, por ser el anterior en el historial';
                        $articuloscostoshistorico->medio = ArticulosCostoHistoricoMotivos::RECALCULO->value;
                        $articuloscostoshistorico->idusuario = $articuloCostoHistorico->idusuario;

                        $articuloscostoshistorico->save();
                    }
                }else{
                    //Si no tiene ningun historico de costo, toma la ultima compra al mismo proveedor
                    $ultimaCompraParaEseProveedor = app(ComprasManager::class)->getCompraDetallesLimpiasQuery()
                        ->where('comprasdetalle.idarticulo', $compraDetalle->idarticulo)
                        ->where('compras.idproveedor', $compraDetalle->compra->idproveedor)
                        ->where('compras.idtipocomprobante', 1)
                        ->orderBy('comprasdetalle.id', 'desc')
                        ->first();

                    if(!blank($ultimaCompraParaEseProveedor))
                    {
                        $this->setCompraDetalleAsArticuloCosto(
                            $ultimaCompraParaEseProveedor,
                            ArticulosCostoHistoricoMotivos::RECALCULO->value,
                            'Se tomo la ultima compra al proveedor por no existir otra en el historial'
                        );
                    }else{

                        //Si el mismo proveedor no tiene compras, se toma la ultima compra
                        $ultimaCompra = app(ComprasManager::class)->getCompraDetallesLimpiasQuery()
                            ->where('comprasdetalle.idarticulo', $compraDetalle->idarticulo)
                            ->where('compras.idtipocomprobante', 1)
                            ->orderBy('comprasdetalle.id', 'desc')
                            ->first();

                        if(!blank($ultimaCompra)) {
                            $this->setCompraDetalleAsArticuloCosto(
                                $ultimaCompra,
                                ArticulosCostoHistoricoMotivos::RECALCULO->value,
                                'Se tomo la ultima compra de la cadena por no tener historial ni compra al mismo proveedor'
                            );
                        }else{
                            $this->setCompraDetalleAsArticuloCosto(
                                $compraDetalle,
                                ArticulosCostoHistoricoMotivos::RECALCULO->value,
                                'No se modifico costo, dado que no hay referencia alguna (no hay historial valido ni compras anteriores)'
                            );
                        }

                    }
                }
            }
        });

    }
    public function ActualizarVentaPorCompraDetalleAnulada(CompraDetalle $compraDetalle)
    {
        //Para reemplazar la referencia en ventas (para calcular ganancia) se toma la primer compra anterior a la anulada de la sucursal
        $compraReemplazante = app(ComprasManager::class)
            ->getCompraDetallesLimpiasQuery()
            ->where('comprasdetalle.idarticulo', $compraDetalle->idarticulo)
            ->where('comprasdetalle.id', '<', $compraDetalle->id)
            ->where('comprasdetalle.cantidad', '>', 0)
            ->where('compras.idsucursal', $compraDetalle->compra->idsucursal)
            ->where('compras.idtipocomprobante', 1)
            ->orderBy('comprasdetalle.id', 'desc')
            ->first();

        if(blank($compraReemplazante))
        {
            //Si la inmediatamente anterior no existe, se toma la posterior de la sucursal
            $compraReemplazante = app(ComprasManager::class)
                ->getCompraDetallesLimpiasQuery()
                ->where('comprasdetalle.idarticulo', $compraDetalle->idarticulo)
                ->where('comprasdetalle.cantidad', '>', 0)
                ->where('comprasdetalle.id', '<>', $compraDetalle->id)
                ->where('compras.idsucursal', $compraDetalle->compra->idsucursal)
                ->where('compras.idtipocomprobante', 1)
                ->orderBy('comprasdetalle.id', 'asc')
                ->first();
        }

        if(blank($compraReemplazante))
        {
            //Si la sucursal no tiene compras, se toma la compra del articulo
            $compraReemplazante = $compraDetalle->articulo->compradetalle;
        }

      //  $compra = $compraReemplazante?->compra;
        $idCompraDetalleUpdate = blank($compraReemplazante) ? null : $compraReemplazante->id;
        $costo = blank($compraReemplazante) ? $compraDetalle->articulo->costo : $compraReemplazante->precio;

        $res = DB::update('UPDATE ventassucursal as vs LEFT JOIN ventassucursalextra as vse ON vs.id = vse.idventa
                    SET vse.idcompradetalle = '.$idCompraDetalleUpdate.', costosucursal = '.(int)$costo.'
                    WHERE vse.idcompradetalle = '.$compraDetalle->id);
        return $costo;
    }
}
