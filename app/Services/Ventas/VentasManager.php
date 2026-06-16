<?php

namespace App\Services\Ventas;

use App\Models\User;
use App\Models\VentaSucursal;
use App\Models\VentaSucursalAnulacion;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\Cache\CacheManager;
use App\Services\Cache\Enums\CacheExpire;
use App\Services\Cajas\CajaManager;
use App\Services\Ventas\DTOs\VentaSucursalCacheDataDTO;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
class VentasManager
{
    public function __construct(private ActualizacionesManager $actualizacionesManager)
    {

    }

    public function anularVentaPorIdUnico(User $usuario, string $idUnicoVenta): void
    {
        $ventaSucursalAnulacion = new VentaSucursalAnulacion();

        $venta = VentaSucursal::where('idventa', $idUnicoVenta)->first();

        if(blank($venta))
        {
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
        if($fechaDesde)
        {
            $idDesde = app(CacheManager::class)->Cache(
                ['getVentaCacheIdDesde', $fechaDesde->format('Y-m-d H:i:s')],
                CacheExpire::HOUR,
            function()use ($fechaDesde){
                return \DB::selectOne("SELECT getVentaCacheIdDesde(?) as id", [$fechaDesde])->id;
            });
        }

        if($fechaHasta)
        {
            $idHasta = app(CacheManager::class)->Cache(
                ['getVentaCacheIdHasta', $fechaHasta->format('Y-m-d H:i:s')],
                CacheExpire::HOUR,
                function()use ($fechaHasta){
                    return \DB::selectOne("SELECT getVentaCacheIdHasta(?) as id", [$fechaHasta])->id;
                });
        }

        return new VentaSucursalCacheDataDTO($idDesde, $idHasta);
    }

    public function addVentaCacheIdFilterToQuery(EloquentBuilder|QueryBuilder $query,
                                                 ?Carbon $fechaDesde,
                                                 ?Carbon $fechaHasta ,
                                                 ?string $tableAlias = 'ventassucursal'): EloquentBuilder|QueryBuilder
    {
        $filtros = $this->getIdVentaDesdeByDate($fechaDesde, $fechaHasta);

        if ($filtros->ventaSucursalFiltroDesdeId > 0) {
            $query->where("{$tableAlias}.id", ">=",$filtros->ventaSucursalFiltroDesdeId);
        }

        if ($filtros->ventaSucursalFiltroHastaId > 0) {
            $query->where("{$tableAlias}.id", "<=",$filtros->ventaSucursalFiltroHastaId);
        }

        return $query;
    }
}
