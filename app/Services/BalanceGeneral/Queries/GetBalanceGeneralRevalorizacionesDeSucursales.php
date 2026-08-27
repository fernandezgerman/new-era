<?php

namespace App\Services\BalanceGeneral\Queries;

use App\Models\MovimientoCaja;
use App\Models\SucursalRevalorizacion;
use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Interface\Queries;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalanceGeneralRevalorizacionesDeSucursales implements Queries
{

    protected $result;
    protected $query;

    protected $tipoBalance = BalanceGeneralItemTipo::RETIROS;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);

        $this->query->select(
            db::raw('sum(valoringresado - valororiginal) as revalorizado')
        );

        $this->result = $this->query->first();
    }

    protected function getQuery(BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO): Builder
    {
        $query = SucursalRevalorizacion::query();

        if ($balanceGeneralFiltersDTO->dateFrom) {
            $query->where('fechahora', '>=', $balanceGeneralFiltersDTO->dateFrom);
        }

        if ($balanceGeneralFiltersDTO->dateTo) {
            $query->where('fechahora', '<=', $balanceGeneralFiltersDTO->dateTo);
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
            BalanceGeneralItemTipo::REVALORIZACIONES_DE_SUCURSALES,
            $this->balanceGeneralFiltersDTO,
            $this->result?->revalorizado ?? 0,
            null,
            false
        );
    }

}
