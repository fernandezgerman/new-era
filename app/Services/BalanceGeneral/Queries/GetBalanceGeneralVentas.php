<?php

namespace App\Services\BalanceGeneral\Queries;

use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Interface\Queries;
use App\Services\Ventas\DTOs\VentaSucursalCacheDataDTO;
use App\Services\Ventas\VentasManager;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalanceGeneralVentas implements Queries
{


    protected $result;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);

        $this->query->select(
            db::raw('sum(cantidad * preciounitario) as totalVenta'),
            db::raw('sum(cantidad * costosucursal) as totalCosto')
        );

        $this->result = $this->query->first();
    }

    protected function getQuery(BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO): Builder
    {
        $query = VentaSucursal::query();

        if ($balanceGeneralFiltersDTO->dateFrom) {
            $query->where('fechacreacion', '>=', $balanceGeneralFiltersDTO->dateFrom);
        }

        if ($balanceGeneralFiltersDTO->dateTo) {
            $query->where('fechacreacion', '<=', $balanceGeneralFiltersDTO->dateTo);
        }

        if ($balanceGeneralFiltersDTO->dateFrom && $balanceGeneralFiltersDTO->dateTo) {
            /** @var VentaSucursalCacheDataDTO $dto */
            $dto = VentasManager::getIdVentaDesdeByDate($balanceGeneralFiltersDTO->dateFrom, $balanceGeneralFiltersDTO->dateTo);


            if(!blank($dto->ventaSucursalFiltroDesdeId))
            {
                $query->where('id', '>=', $dto->ventaSucursalFiltroDesdeId);
            }

            if(!blank($dto->ventaSucursalFiltroHastaId))
            {
                $query->where('id', '<=', $dto->ventaSucursalFiltroHastaId);
            }
        }

        if ($balanceGeneralFiltersDTO->sucursales) {
            $query->whereIn('idsucursal', $balanceGeneralFiltersDTO->sucursales);
        }

        return $query;
    }
    /** Retorna las ventas */
    public function getData(): BalanceResponseDTO
    {
        $ganancia = $this->getDataGanancias();

        return new BalanceGeneraItemDTO(
            BalanceGeneralItemTipo::VENTAS,
            $this->balanceGeneralFiltersDTO,
            $this->result->totalVenta ?? 0,
            'Con una rentabilidad de '.
            round(
                abs($this->result->totalVenta > 0  ? $ganancia->total / $this->result->totalVenta * 100 : 0
                ), 2).'%',
            true
        );
    }

    public function getDataGanancias(): BalanceResponseDTO
    {
        return new BalanceGeneraItemDTO(
            BalanceGeneralItemTipo::GANANCIA,
            $this->balanceGeneralFiltersDTO,
            ($this->result->totalVenta - $this->result->totalCosto) ?? 0,
            null,
            true
        );
    }

}
