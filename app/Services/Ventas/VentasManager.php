<?php

namespace App\Services\Ventas;

use App\Models\ArticuloCompuesto;
use App\Models\Compra;
use App\Models\CompraDetalle;
use App\Models\User;
use App\Models\VentaArticuloCompuesto;
use App\Models\VentaSucursal;
use App\Models\VentaSucursalAnulacion;
use App\Models\VentaSucursalExtra;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\Cache\CacheManager;
use App\Services\Cache\Enums\CacheExpire;
use App\Services\Compras\ComprasManager;
use App\Services\Stock\StockManager;
use App\Services\Ventas\DTOs\VentaSucursalCacheDataDTO;
use App\Services\Ventas\Exceptions\CompraDetalleNotFoundException;
use App\Services\Ventas\Exceptions\VentaAlreadyProcessedException;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VentasManager
{
    public function __construct(private ActualizacionesManager $actualizacionesManager)
    {

    }

    public function anularVentaPorIdUnico(User $usuario, string $idUnicoVenta): void
    {
        $ventaSucursalAnulacion = new VentaSucursalAnulacion();

        $venta = VentaSucursal::where('idventa', $idUnicoVenta)->first();

        if (blank($venta)) {
            throw new Exception('No se encontro la venta para anular con el idunico: ' . $idUnicoVenta);
        }

        $ventaSucursalAnulacion->idunicoventaanulada = $venta->idventa;
        $ventaSucursalAnulacion->idusuarioanulo = $venta->idusuario;
        $ventaSucursalAnulacion->idusuariocaja = $venta->idusuario;
        $ventaSucursalAnulacion->idsucursalcaja = $venta->idsucursal;
        $ventaSucursalAnulacion->idarticulo = $venta->idarticulo;
        $ventaSucursalAnulacion->idlista = $venta->idlista;
        $ventaSucursalAnulacion->cantidad = $venta->cantidad * -1;
        $ventaSucursalAnulacion->preciounitario = $venta->preciounitario;
        $ventaSucursalAnulacion->costo = $venta->costo;
        $ventaSucursalAnulacion->fechahora = Carbon::now()->format('Y-m-d H:i:s');
        $ventaSucursalAnulacion->costosucursal = $venta->costosucursal;

        $ventaSucursalAnulacion->save();

        $this->actualizacionesManager->insertarActualizacion($ventaSucursalAnulacion, $ventaSucursalAnulacion->sucursal);

    }

    /**
     * @param Carbon $fechaDesde
     * @param Carbon $fechaHasta
     * @return VentaSucursalCacheDataDTO
     */
    public static function getIdVentaDesdeByDate(?Carbon $fechaDesde, ?Carbon $fechaHasta): VentaSucursalCacheDataDTO
    {

        $idDesde = null;
        $idHasta = null;
        if ($fechaDesde) {
            $idDesde = app(CacheManager::class)->Cache(
                ['getVentaCacheIdDesde', $fechaDesde->format('Y-m-d H:i:s')],
                CacheExpire::HOUR,
                function () use ($fechaDesde) {
                    return \DB::selectOne("SELECT getVentaCacheIdDesde(?) as id", [$fechaDesde])->id;
                });
        }

        if ($fechaHasta) {
            $idHasta = app(CacheManager::class)->Cache(
                ['getVentaCacheIdHasta', $fechaHasta->format('Y-m-d H:i:s')],
                CacheExpire::HOUR,
                function () use ($fechaHasta) {
                    return \DB::selectOne("SELECT getVentaCacheIdHasta(?) as id", [$fechaHasta])->id;
                });
        }

        return new VentaSucursalCacheDataDTO($idDesde, $idHasta);
    }

    public function addVentaCacheIdFilterToQuery(EloquentBuilder|QueryBuilder $query,
                                                 ?Carbon                      $fechaDesde,
                                                 ?Carbon                      $fechaHasta,
                                                 ?string                      $tableAlias = 'ventassucursal'): EloquentBuilder|QueryBuilder
    {
        $filtros = $this->getIdVentaDesdeByDate($fechaDesde, $fechaHasta);

        if ($filtros->ventaSucursalFiltroDesdeId > 0) {
            $query->where("{$tableAlias}.id", ">=", $filtros->ventaSucursalFiltroDesdeId);
        }

        if ($filtros->ventaSucursalFiltroHastaId > 0) {
            $query->where("{$tableAlias}.id", "<=", $filtros->ventaSucursalFiltroHastaId);
        }

        return $query;
    }

    /** Busca la compra que determina el costo del articulo a la hora de ser vendido
     * 1 - Busca la ultima compra en la sucursal para los ultimos n meses (configurado en el conf))
     * 2 - Toma la compra del articulo
     * 3 - Sino, busca la ultima de la cadena para los ultimos 4 meses
     * 4 - Sino, retorna por excepcion
     */
    public function ventaSucursalGetCompraDetalle(VentaSucursal $ventasucursal): CompraDetalle
    {
        /** @var ComprasManager $comprasManager */
        $comprasManager = app(ComprasManager::class);

        $minId = app(CacheManager::class)->cache('min-id-compra-4-meses', CacheExpire::DAY, function(){
            $minId = Compra::query()
                ->where('compras.fechacreacion', '>=', (new Carbon())->addMonths(-5))
                ->select(db::raw('min(compras.id) as minId'))
                ->first();
            return $minId?->minId;
        });

        // Ultima compra en la sucursal, para los ultimos 4 meses
        $compraDetalle = $comprasManager->getCompraDetallesLimpiasQuery()
            ->where('idsucursal', $ventasucursal->idsucursal)
            ->where('idarticulo', $ventasucursal->idarticulo)
            ->where('compras.fechacreacion', '<=', new Carbon($ventasucursal->fechaenvio))
            ->where('compras.fechacreacion', '>=', (new Carbon($ventasucursal->fechaenvio))->addMonths(-4))
            ->where(function ($query) use ($minId) {
                if(blank($minId)) return ;
                $query->where('compras.id', '>=', $minId);
            })
            ->whereNot('idtipocomprobante', 2)
            ->orderBy('comprasdetalle.id', 'desc')
            ->first();


        // Costo asociado al articulo
       /* if (!$compraDetalle) {
            $compraDetalle = $ventasucursal->articulo->compraDetalle;
        }

        // Compras de los ulitmos 4 meses en toda la cadena
        if (!$compraDetalle) {
            $compraDetalle = $comprasManager->getCompraDetallesLimpiasQuery()
                ->where('idarticulo', $ventasucursal->idarticulo)
                ->where('fechacreacion', '<=', new Carbon($ventasucursal->fechaenvio))
                ->where('fechacreacion', '>=', (new Carbon($ventasucursal->fechaenvio))->addMonths(-4))
                ->whereNot('idtipocomprobante', 2)
                ->orderBy('comprasdetalle.id', 'desc')
                ->first();
        }

        // Compras despues de la venta
        if (!$compraDetalle) {
            $compraDetalle = $comprasManager->getCompraDetallesLimpiasQuery()
                ->where('idarticulo', $ventasucursal->idarticulo)
                ->where('fechacreacion', '>=', new Carbon($ventasucursal->fechaenvio))
                ->whereNot('idtipocomprobante', 2)
                ->orderBy('comprasdetalle.id', 'asc')
                ->first();
        }
*/
        if (!$compraDetalle) {
            throw new CompraDetalleNotFoundException('No se encontro una compra para la venta idventa: ' . $ventasucursal->id);
        }

        return $compraDetalle;

    }

    public function procesarVentaSucursal(int $ventaSucursalId): void
    {

        // Determina el costo de la sucursal
        /** @var VentaSucursal $ventaSucursal */
        $ventaSucursal = get_entity_or_fail('VentaSucursal', $ventaSucursalId);

        if(!blank($ventaSucursal->costosucursalcriterio)){
            Log::warning('La venta '.$ventaSucursal->idunico.' ya ha sido procesada. ', [$ventaSucursal]);
            return;
            // throw new VentaAlreadyProcessedException('La venta ya a sido procesada.');
        }
        db::transaction(function () use ($ventaSucursal, $ventaSucursalId) {
            $articulo = $ventaSucursal->articulo;
            $ventaSucursal->costo = $articulo->costo;
            $ventaSucursal->costosucursalcriterio = 'COSTO_DEL_ARTICULO_SIN_COMPRAS';

            if ($articulo->escompuesto) {
                $ventaSucursal->costosucursal = $articulo->costo;
                $ventaSucursal->costosucursalcriterio = 'COSTO_DEL_ARTICULO_POR_COMPUESTO';

                $compuestos = ArticuloCompuesto::where('idcompuesto', $articulo->id)->get();

                foreach ($compuestos as $compuesto) {
                    VentaArticuloCompuesto::create([
                        'idventa' => $ventaSucursalId,
                        'cantidadcompuesto' => $compuesto->cantidad,
                        'fechacreacion' => new Carbon(),
                        'idcomponente' => $compuesto->idarticulo
                    ]);
                }

            } else {
                $compraDetalle = false;
                try {
                    $compraDetalle = $this->ventaSucursalGetCompraDetalle($ventaSucursal);
                }catch(CompraDetalleNotFoundException $e)
                {}

                //DETERMINA COSTO Y COSTO DE SUCURSAL
                if ($compraDetalle) {
                    $costoConImpuesto = $compraDetalle->costos()->where('idtipocosto', 1)->first();

                    $utilizarCostoDelArticulo = blank($costoConImpuesto);

                    VentaSucursalExtra::create([
                        'idventa' => $ventaSucursalId,
                        'idcompradetalle' => $utilizarCostoDelArticulo ? $articulo->idcompradetalle : $compraDetalle->id,
                    ]);

                    $ventaSucursal->costosucursal = $utilizarCostoDelArticulo ? $articulo->costo : $costoConImpuesto->importe;

                    $ventaSucursal->costosucursalcriterio = match (true) {
                        $utilizarCostoDelArticulo => 'COSTO_DEL_ARTICULO',
                        $compraDetalle?->compra->idsucursal === $ventaSucursal->idsucursal => 'ULTIMO_COSTO_SUCURSAL',
                        !blank($compraDetalle) => 'COSTO_DE_LA_CADENA',
                        default => 'NO_DETERMINADO',
                    };

                } else {

                    $ventaSucursal->costosucursalcriterio = 'COSTO_DEL_ARTICULO';
                    $ventaSucursal->costosucursal = $articulo->costo;

                    if(!blank($articulo->idcompradetalle)){
                        VentaSucursalExtra::create([
                            'idventa' => $ventaSucursalId,
                            'idcompradetalle' => $articulo->idcompradetalle,
                        ]);
                    }
                }
            }
            $ventaSucursal->save();
            //
            app(StockManager::class)->affectStock($ventaSucursal->articulo, $ventaSucursal->sucursal, $ventaSucursal->cantidad * -1);

        });

    }
}
