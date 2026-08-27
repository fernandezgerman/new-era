<?php

namespace App\Services\BalanceGeneral\Queries\BalancePorSucursal;

use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalItemDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralSobrantes;
use Illuminate\Support\Facades\DB;

class GetBalancePorSucursalSobrantes extends GetBalanceGeneralSobrantes
{
    protected $result;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);

        $this->query->select(
            'idsucursal',
            db::raw('sum(importerendido - (ifnull(cajainicial,0) + ifnull(totalmovimientos,0) + ifnull(totalventas,0) - ifnull(totalcompras,0) - ifnull(totalpagos,0) )) as totalSobrantes'),
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
                    BalanceGeneralItemTipo::SOBRANTES,
                    $this->balanceGeneralFiltersDTO,
                    $data->idsucursal,
                    $data->totalSobrantes ?? 0,
                    'Solo cajas cerradas al dia de hoy',
                    true
                )
            );
        }

        return $collection;
    }
}
