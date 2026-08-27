<?php

namespace App\Services\BalanceGeneral\Queries;

use App\Models\Caja;
use App\Models\RendicionStockDetalle;
use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Interface\Queries;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalanceGeneralSobrantes implements Queries
{


    protected $result;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);

        $this->query->select(
            db::raw('sum(importerendido - (ifnull(cajainicial,0) + ifnull(totalmovimientos,0) + ifnull(totalventas,0) - ifnull(totalcompras,0) - ifnull(totalpagos,0) )) as totalSobrantes'),
        );

        $this->result = $this->query->first();
    }

    protected function getQuery(BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO): Builder
    {
        $query = Caja::query();
        $query->where('idestado', '1');
        if ($balanceGeneralFiltersDTO->dateFrom) {
            $query->where('fechaapertura', '>=', $balanceGeneralFiltersDTO->dateFrom);
        }

        if ($balanceGeneralFiltersDTO->dateTo) {
            $query->where('fechaapertura', '<=', $balanceGeneralFiltersDTO->dateTo);
        }

        if ($balanceGeneralFiltersDTO->sucursales) {
            $query->whereIn('idsucursal', $balanceGeneralFiltersDTO->sucursales);
        }

        return $query;
    }
    /** Retorna las ventas */
    public function getData(): BalanceResponseDTO
    {
        return new BalanceGeneraItemDTO(
            BalanceGeneralItemTipo::SOBRANTES,
            $this->balanceGeneralFiltersDTO,
            $this->result->totalSobrantes,
            'Solo cajas cerradas al dia de hoy',
            true
        );
    }
}
