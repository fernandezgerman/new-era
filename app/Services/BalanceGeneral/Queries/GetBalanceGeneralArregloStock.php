<?php

namespace App\Services\BalanceGeneral\Queries;

use App\Models\RendicionStockDetalle;
use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Interface\Queries;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalanceGeneralArregloStock implements Queries
{


    protected $descripcion = 'Valorizados al costo';
    protected $result;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);

        $this->result = $this->query->first();
    }

    protected function getQuery(BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO): Builder
    {
        $query = RendicionStockDetalle::query()
        ->join('rendicionesstock','rendicionstockdetalle.idrendicion', '=', 'rendicionesstock.id');

        if ($balanceGeneralFiltersDTO->dateFrom) {
            $query->where('rendicionstockdetalle.fechahora', '>=', $balanceGeneralFiltersDTO->dateFrom);
        }

        if ($balanceGeneralFiltersDTO->dateTo) {
            $query->where('rendicionstockdetalle.fechahora', '<=', $balanceGeneralFiltersDTO->dateTo);
        }

        if ($balanceGeneralFiltersDTO->sucursales) {
            $query->whereIn('rendicionesstock.idsucursal', $balanceGeneralFiltersDTO->sucursales);
        }

        $this->query->select(
            db::raw('sum((ifnull(cantidadsistema, 0) - ifnull(cantidadrendida, 0)) * costo) as totalArreglos'),
        );


        return $query;
    }
    /** Retorna las ventas */
    public function getData(): BalanceResponseDTO
    {
        return new BalanceGeneraItemDTO(
            BalanceGeneralItemTipo::ARREGLOS,
            $this->balanceGeneralFiltersDTO,
            $this->result->totalArreglos,
            $this->descripcion,
            false
        );
    }
}
