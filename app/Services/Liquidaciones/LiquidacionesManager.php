<?php

namespace App\Services\Liquidaciones;

use App\Services\Cache\CacheManager;
use App\Services\Cache\Enums\CacheExpire;
use App\Services\Liquidaciones\Collections\HistoricoValorizacionCollection;
use App\Services\Liquidaciones\Collections\LiquidacionDetalleConceptosCollection;
use App\Services\Liquidaciones\DTOs\HistoricoValorizacionDTO;
use App\Services\Liquidaciones\DTOs\LiquidacionDetalleConceptoDTO;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class LiquidacionesManager extends CacheManager
{
    public function getHistoricoDeValorizaciones(?array $sucursalesIds, ?int $pagina): LiquidacionDetalleConceptosCollection
    {

        return $this->Cache(
            ['historico_valorizaciones_', md5(json_encode($sucursalesIds)), '_'.$pagina],
            CacheExpire::NEXT_MONDAY,
            function () use ($sucursalesIds, $pagina) {
            $limit = 4 * 24;
            $offset = ($pagina ?? 0) * 4;

            $query = DB::table('liquidaciondetalleconceptos as ldc')
                ->join('liquidacionesconceptos as lc', 'ldc.idconcepto', '=', 'lc.id')
                ->join('liquidaciondetalle as ld', 'ldc.idliquidaciondetalle', '=', 'ld.id')
                ->join('liquidaciones as l', 'ld.idliquidacion', '=', 'l.id')
                ->join('sucursales as s', 'ld.idsucursal', '=', 's.id')
                ->select(
                    'l.fechahoradesde',
                    'l.id as liquidacionId',
                    'lc.id as id',
                    'lc.descripcion',
                    DB::raw('sum(ldc.importe) as importe')
                )
                ->groupBy('l.fechahoradesde', 'l.id', 'lc.descripcion', 'lc.id')
                ->orderByDesc('l.fechahoradesde')
                ->where('s.activo', 1)
                ->where('s.id', '<>',  2)
                //->where('s.id','=',  18)
                ->where('s.id', '<>',  22)
                ->orderBy('l.id')
                ->orderBy('lc.id')
                ->limit($limit)
                ->offset($offset);

            if (!empty($sucursalesIds)) {
                $query->whereIn('ld.idsucursal', $sucursalesIds);
            }

            $results = $query->get()->reverse();

            $grouped = $results->groupBy('descripcion');

            $collection = new LiquidacionDetalleConceptosCollection();

            foreach ($grouped as $descripcion => $items) {
                $first = $items->first();
                $detalles = new HistoricoValorizacionCollection();
                foreach ($items as $item) {
                    $detalles->push(new HistoricoValorizacionDTO(
                        fecha: $item->fechahoradesde,
                        descripcion: $item->descripcion,
                        importe: (float) $item->importe
                    ));
                }

                $collection->push(new LiquidacionDetalleConceptoDTO(
                    id: $first->id,
                    descripcion: $descripcion,
                    detalles: $detalles
                ));
            }


            return $collection;
        });
    }
}
