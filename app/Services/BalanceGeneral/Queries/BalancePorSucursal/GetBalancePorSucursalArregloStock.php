<?php

namespace App\Services\BalanceGeneral\Queries\BalancePorSucursal;

use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalItemDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralArregloStock;
use Illuminate\Support\Facades\DB;

class GetBalancePorSucursalArregloStock extends GetBalanceGeneralArregloStock
{
    protected $descripcion = 'Valorizados al costo';
    protected $result;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);

        $this->query->select(
            'rendicionesstock.idsucursal',
            db::raw('sum((ifnull(cantidadsistema, 0) - ifnull(cantidadrendida, 0)) * costo) as totalArreglos'),
        );
        $this->query->groupBy('rendicionesstock.idsucursal');

        $this->result = $this->query->get();
    }

    public function getData(): BalanceResponseDTO
    {
        $collection = new BalanceGeneralItemDTOCollection();
        foreach ($this->result as $data) {
            $collection->add(
                new BalancePorSucursalItemDTO(
                    BalanceGeneralItemTipo::ARREGLOS,
                    $this->balanceGeneralFiltersDTO,
                    $data->idsucursal,
                    $data->totalArreglos ?? 0,
                    $this->descripcion,
                    false
                )
            );
        }

        return $collection;
    }
}
