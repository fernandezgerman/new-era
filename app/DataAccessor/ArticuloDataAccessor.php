<?php

namespace App\DataAccessor;

use App\Models\AgrupacionCaja;
use App\Models\Articulo;
use App\Models\ArticuloCompuesto;
use App\Models\CompraDetalle;
use App\Models\Existencia;
use App\Models\Funcion;
use App\Models\ProveedorListaDetalle;
use App\Models\Sucursal;
use App\Models\User;
use App\Models\Modulo;
use App\Models\VentaSucursal;
use App\Services\Alertas\Collections\AlertaDetalleCollection;
use App\Services\Alertas\DataAccessors\AlertasDataAccessor;
use App\Services\Alertas\Exceptions\NotImplementedException;
use App\Services\Compras\ComprasManager;
use App\Services\Ventas\VentasManager;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class ArticuloDataAccessor extends DataAccessorBase
{
    public function __construct(public Articulo $articulo)
    {

    }

    /**
     * Retorna  el costo de un articulo con impuestos, si es compuesto lo calcula
     * @return float
     */
    public function getCostoConImpuestos(): float
    {
        //Si es compuesto, calcula el costo de su composicion
        if ($this->articulo->escompuesto === 1) {
            return (
            ArticuloCompuesto::query()
                ->where('idCompuesto', $this->articulo->id)
                ->get()
            )->reduce(
                    fn($carry, $composicion) => ($carry + $composicion->cantidad * (new ArticuloDataAccessor($composicion->articulo))->getCosto()), 0
                );
        }
        //SI tiene compra asociada, toma el valor con impuestos
        if ($this->articulo->compraDetalle) {
            return $this->articulo->compraDetalle->costo_con_impuestos;
        };

        //Si nada de lo anterior sucede, devuelve el costo establecido manualmente
        return $this->articulo->costo;
    }

    public function getExistencia(Sucursal $sucursal): ?Existencia
    {
        return Existencia::query()
            ->where('idsucursal', $sucursal->id)
            ->where('idarticulo', $this->articulo->id)
            ->first();
    }

    public function getUltimaCompraDetalle(Sucursal $sucursal): ?CompraDetalle
    {
        $comprasManager = app(ComprasManager::class);

        return $comprasManager->getCompraDetallesLimpiasQuery()
            ->with(['compra.proveedor', 'compra.sucursal'])
            ->where('idsucursal', $sucursal->id)
            ->where('idarticulo', $this->articulo->id)
            ->orderBy('id', 'desc')
            ->first();
    }

    public function getUltimasComprasPorSucursal(?Carbon $desde = null): Collection
    {
        $comprasManager = app(ComprasManager::class);

        $latestIds = $comprasManager->getCompraDetallesLimpiasQuery()
            ->where('comprasdetalle.idarticulo', $this->articulo->id)
            ->select(DB::raw('MAX(comprasdetalle.id) as id'))
            ->groupBy('compras.idsucursal');


        if($desde)
        {
            $latestIds->where('compras.fechahora', '>=', $desde);
        }

        $latestIds = $latestIds->pluck('id');

        return $comprasManager->getCompraDetallesLimpiasQuery()
            ->with(['compra.proveedor', 'compra.sucursal'])
            ->whereIn('comprasdetalle.id', $latestIds)
            ->get();
    }

    public function getProveedoresListaPrecio(Carbon $desde = null): Collection
    {
        return ProveedorListaDetalle::query()
            ->join('proveedorlistas', 'proveedorlistas.id', '=', 'proveedorlistadetalle.idproveedorlista')
            ->with('proveedorLista.proveedor')
            ->where('idarticulo', $this->articulo->id)
            ->where('fechalista', '>=', $desde)
            ->get();
    }

    public function getCantidadesVendida(int $diasAtras, Sucursal $sucursal): int
    {
        $fechaHasta = Carbon::now()->startOfDay();
        $fechaDesde = Carbon::now()->subDays($diasAtras)->startOfDay();

        $query = VentaSucursal::query()
            ->select(db::raw('sum(cantidad) as cantidad'))
            ->where('idarticulo', $this->articulo->id)
            ->where('fechaenvio', '>=', $fechaDesde)
            ->where('idsucursal', $sucursal->id);

        return app(VentasManager::class)->addVentaCacheIdFilterToQuery(
            $query, $fechaDesde, $fechaHasta
        )->first()->cantidad ?? 0;
    }

}
