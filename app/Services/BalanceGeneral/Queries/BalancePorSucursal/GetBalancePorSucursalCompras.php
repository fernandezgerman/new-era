<?php

namespace App\Services\BalanceGeneral\Queries\BalancePorSucursal;

use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalItemDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralCompras;
use Illuminate\Support\Facades\DB;

class GetBalancePorSucursalCompras extends GetBalanceGeneralCompras
{
    protected $result;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery(
            $balanceGeneralFiltersDTO, $this->tipoBalance === BalanceGeneralItemTipo::GASTOS
        );

        $this->query->select(
            'compras.idsucursal',
            db::raw('sum(totalfactura) as compras')
        );
        $this->query->groupBy('compras.idsucursal');

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
                    $data->compras ?? 0,
                    $this->descripcion,
                    false
                )
            );
        }

        return $collection;
    }
}
