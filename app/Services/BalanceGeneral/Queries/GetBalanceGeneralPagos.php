<?php

namespace App\Services\BalanceGeneral\Queries;

use App\Models\Compra;
use App\Models\Pago;
use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Interface\Queries;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalanceGeneralPagos implements Queries
{
    protected $result;

    protected Builder $query;

    protected $tipoBalance = BalanceGeneralItemTipo::PAGOS;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery(
            $balanceGeneralFiltersDTO
        );

        $this->result = $this->query->first();
    }

    protected function getQuery(BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO): Builder
    {
        $query = Pago::query();

        if ($balanceGeneralFiltersDTO->dateFrom) {
            $query->where('fechahorareal', '>=', $balanceGeneralFiltersDTO->dateFrom);
        }

        if ($balanceGeneralFiltersDTO->dateTo) {
            $query->where('fechahorareal', '<=', $balanceGeneralFiltersDTO->dateTo);
        }

        if ($balanceGeneralFiltersDTO->sucursales) {
            $query->whereIn('idsucursal', $balanceGeneralFiltersDTO->sucursales);
        }

        $query->select(db::raw('sum(totalpago) as pagos'));

        return $query;
    }

    /** Retorna las ventas */
    public function getData(): BalanceResponseDTO
    {
        return new BalanceGeneraItemDTO(
            $this->tipoBalance,
            $this->balanceGeneralFiltersDTO,
            $this->result->pagos ?? 0,
            null,
            false
        );
    }
}
