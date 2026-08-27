<?php

namespace App\Services\BalanceGeneral\Queries\BalancePorSucursal;

use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalItemDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralPagos;
use Illuminate\Support\Facades\DB;

class GetBalancePorSucursalPagos extends GetBalanceGeneralPagos
{
    protected $result;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);

        $this->query->select(
            'idsucursal',
            db::raw('sum(totalpago) as pagos')
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
                    $this->tipoBalance,
                    $this->balanceGeneralFiltersDTO,
                    $data->idsucursal,
                    $data->pagos ?? 0,
                    null,
                    false
                )
            );
        }

        return $collection;
    }
}
