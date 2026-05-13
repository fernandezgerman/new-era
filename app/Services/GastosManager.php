<?php

namespace App\Services;

use App\Collections\LiquidacionPeriodoCollection;
use App\Collections\SucursalCollection;
use App\DTOs\RubroGastoPorPeriodoDTO;
use App\Models\Sucursal;
use App\Models\LiquidacionPeriodo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class GastosManager
{
    /**
     * Reporte de gastos por rubro y periodo.
     *
     * @param LiquidacionPeriodoCollection|null $periodos
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return Collection<int, RubroGastoPorPeriodoDTO>
     */
    public function reporteDeGastos(
        ?LiquidacionPeriodoCollection $periodos = null,
        ?string $fechaDesde = null,
        ?string $fechaHasta = null,
        ?SucursalCollection $sucursales = null
    ): Collection {
        $query = $this->getBaseQuery($periodos, $fechaDesde, $fechaHasta, $sucursales);

        $subquerySql = 'SELECT COUNT(DISTINCT cmp2.idsucursal)
                      FROM compras as cmp2
                      JOIN liquidacionesperiodogastos as lpg2 ON cmp2.id = lpg2.idgasto
                      WHERE lpg2.idperiodo = lp.id';

        if ($fechaDesde) {
            $subquerySql .= " AND cmp2.fechaemision >= '$fechaDesde'";
        }
        if ($fechaHasta) {
            $subquerySql .= " AND cmp2.fechaemision <= '$fechaHasta'";
        }

        $results = $query->select(
            'lp.id as periodo_id',
            'lp.descripcion',
            'rbr.nombre',
            'rbr.id',
            DB::raw('sum(cmp.totalfactura) as importe'),
            DB::raw("($subquerySql) as sucursales_per_periodo")
        )
            ->groupBy('rbr.nombre', 'rbr.id', 'lp.descripcion', 'lp.id')
            ->orderBy('rbr.nombre')
            ->orderBy('lp.id', 'desc')
            ->get();

        return $results->map(fn($row) => new RubroGastoPorPeriodoDTO(
            id: $row->id,
            descripcion: $row->descripcion,
            nombre: $row->nombre,
            importe: (float) $row->importe,
            periodoId: $row->periodo_id,
            sucursales_per_periodo: $row->sucursales_per_periodo
        ));
    }

    /**
     * Reporte de gastos para artículos de un rubro específico, agrupado por periodo.
     *
     * @param int $idrubro
     * @param LiquidacionPeriodoCollection|null $periodos
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return Collection<int, RubroGastoPorPeriodoDTO>
     */
    public function reporteDeGastosArticulosPorRubro(
        int                           $idrubro,
        ?LiquidacionPeriodoCollection $periodos = null,
        ?string                       $fechaDesde = null,
        ?string                       $fechaHasta = null,
        ?SucursalCollection           $sucursales = null
    ): Collection {
        $query = $this->getBaseQuery($periodos, $fechaDesde, $fechaHasta, $sucursales);

        $subquerySql = 'SELECT COUNT(DISTINCT cmp2.idsucursal)
                      FROM compras as cmp2
                      JOIN liquidacionesperiodogastos as lpg2 ON cmp2.id = lpg2.idgasto
                      WHERE lpg2.idperiodo = lp.id';

        if ($fechaDesde) {
            $subquerySql .= " AND cmp2.fechaemision >= '$fechaDesde'";
        }
        if ($fechaHasta) {
            $subquerySql .= " AND cmp2.fechaemision <= '$fechaHasta'";
        }

        $results = $query->select(
            'lp.id as periodo_id',
            'lp.descripcion',
            'art.nombre',
            'art.id',
            DB::raw('sum(cmp.totalfactura) as importe'),
            DB::raw("($subquerySql) as sucursales_per_periodo")
        )
            ->where('art.idrubro', $idrubro)
            ->groupBy('art.nombre', 'art.id', 'lp.descripcion', 'lp.id')
            ->orderBy('art.nombre')
            ->orderBy('lp.id', 'desc')
            ->get();

        return $results->map(fn($row) => new RubroGastoPorPeriodoDTO(
            id: $row->id,
            descripcion: $row->descripcion,
            nombre: $row->nombre,
            importe: (float) $row->importe,
            periodoId: $row->periodo_id,
            sucursales_per_periodo: $row->sucursales_per_periodo
        ));
    }

    /**
     * Reporte de gastos para un artículo específico, sin agrupar.
     *
     * @param int $idarticulo
     * @param LiquidacionPeriodoCollection|null $periodos
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return Collection<int, RubroGastoPorPeriodoDTO>
     */
    public function reporteDeGastosPorArticulo(
        int                           $idarticulo,
        ?LiquidacionPeriodoCollection $periodos = null,
        ?string                       $fechaDesde = null,
        ?string                       $fechaHasta = null,
        ?SucursalCollection           $sucursales = null
    ): Collection {
        $query = $this->getBaseQuery($periodos, $fechaDesde, $fechaHasta, $sucursales);

        $results = $query->select('lp.descripcion', 'lp.id as periodo_id', 'art.nombre', 'art.id', 'cmp.totalfactura as importe', 'suc.nombre as sucursal_nombre')
            ->join('sucursales as suc', 'cmp.idsucursal', '=', 'suc.id')
            ->where('art.id', $idarticulo)
            ->orderBy('lp.id', 'desc')
            ->get();

        return $results->map(fn($row) => new RubroGastoPorPeriodoDTO(
            id: $row->id,
            descripcion: $row->descripcion,
            nombre: $row->nombre,
            importe: (float) $row->importe,
            sucursal: $row->sucursal_nombre,
            periodoId: $row->periodo_id
        ));
    }

    /**
     * Reporte de gastos para un rubro específico en un contexto de periodo o fechas.
     * Recupera las sucursales relacionadas y los datos del periodo.
     *
     * @param int $idrubro
     * @param int|null $idperiodo
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return array
     */
    public function getPeriodoContexto(
        int                $idperiodo = null,
    ): array {
        $periodos = null;
        if ($idperiodo) {
            $periodos = LiquidacionPeriodo::where('id', $idperiodo)->get();
        }

        $query = $this->getBaseQuery($periodos);

        // 1 - All sucursales related
        $relatedSucursales = Sucursal::whereIn('id', function ($q) use ($query) {
            $q->select('sub.idsucursal')
                ->fromSub($query->select('cmp.idsucursal'), 'sub');
        })->get();

        // 2 - The liquidacionperiodo data
        $liquidacionPeriodoData = null;
        if ($idperiodo) {
            $liquidacionPeriodoData = LiquidacionPeriodo::find($idperiodo);
        } else {
            // Si no hay periodo, devolvemos los periodos que tocan este rubro en este contexto
            $liquidacionPeriodoData = LiquidacionPeriodo::whereIn('id', function ($q) use ($query) {
                $q->select('lp.id')
                    ->fromSub($query->select('lp.id'), 'sub');
            })->get();
        }

        return [
            'sucursales' => $relatedSucursales,
            'liquidacionperiodo' => $liquidacionPeriodoData,
        ];
    }

    /**
     * Obtiene la base de la consulta para reportes de gastos.
     *
     * @param LiquidacionPeriodoCollection|null $periodos
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return \Illuminate\Database\Query\Builder
     */
    private function getBaseQuery(
        ?LiquidacionPeriodoCollection $periodos = null,
        ?string $fechaDesde = null,
        ?string $fechaHasta = null,
        ?SucursalCollection $sucursales = null
    ) {
        if (($periodos === null || $periodos->isEmpty()) && $fechaDesde === null && $fechaHasta === null) {
            throw new InvalidArgumentException('Al menos uno de estos filtros deben ser not null: periodos, fecha desde o fecha hasta.');
        }

        $query = DB::table('compras as cmp')
            ->join('comprasdetalle as cd', 'cmp.id', '=', 'cd.idcabecera')
            ->join('articulos as art', 'cd.idarticulo', '=', 'art.id')
            ->join('rubros as rbr', 'art.idrubro', '=', 'rbr.id')
            ->join('liquidacionesperiodogastos as lpg', 'cmp.id', '=', 'lpg.idgasto')
            ->join('liquidacionesperiodo as lp', 'lpg.idperiodo', '=', 'lp.id')
            ->where('rbr.esrubrogastos', 1);

        if ($periodos && $periodos->isNotEmpty()) {
            $query->whereIn('lp.id', $periodos->pluck('id'));
        }

        if ($fechaDesde) {
            $query->where('cmp.fechaemision', '>=', $fechaDesde);
        }

        if ($fechaHasta) {
            $query->where('cmp.fechaemision', '<=', $fechaHasta);
        }

        if ($sucursales && $sucursales->isNotEmpty()) {
            $query->whereIn('cmp.idsucursal', $sucursales->pluck('id'));
        }

        return $query;
    }
}
