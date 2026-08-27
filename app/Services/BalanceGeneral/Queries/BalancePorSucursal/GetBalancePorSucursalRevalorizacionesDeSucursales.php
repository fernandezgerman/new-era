<?php

namespace App\Services\BalanceGeneral\Queries\BalancePorSucursal;

use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalItemDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralRevalorizacionesDeSucursales;
use Illuminate\Support\Facades\DB;

class GetBalancePorSucursalRevalorizacionesDeSucursales extends GetBalanceGeneralRevalorizacionesDeSucursales
{
    protected $result;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);

        $this->query->select(
            'idsucursal',
            db::raw('sum(valoringresado - valororiginal) as revalorizado')
        );
        $this->query->groupBy('idsucursal');

        $this->result = $this->query->get();
    }

    public function getData(): BalanceResponseDTO
    {
        $collection = new BalanceGeneralItemDTOCollection();
        foreach ($this->result as $data) {
            $collection->add(
                new BalancePorSucursalItemDTO(
                    BalanceGeneralItemTipo::REVALORIZACIONES_DE_SUCURSALES,
                    $this->balanceGeneralFiltersDTO,
                    $data->idsucursal,
                    $data->revalorizado ?? 0,
                    null,
                    false
                )
            );
        }

        return $collection;
    }
}
