<?php

namespace App\Services\BalanceGeneral\Queries\BalancePorSucursal;

use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalItemDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralVentas;
use Illuminate\Support\Facades\DB;

class GetBalancePorSucursalVentas extends GetBalanceGeneralVentas
{
    protected $result;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);

        $this->query->select(
            'idsucursal',
            db::raw('sum(cantidad * preciounitario) as totalVenta'),
            db::raw('sum(cantidad * costosucursal) as totalCosto')
        );
        $this->query->groupBy('idsucursal');

        $this->result = $this->query->get();
    }

    public function getData(): BalanceResponseDTO
    {
        $collection = new BalanceGeneralItemDTOCollection();
        foreach ($this->result as $data) {
            $ganancia = $data->totalVenta - $data->totalCosto;
            $rentabilidad = $data->totalVenta > 0 ? ($ganancia / $data->totalVenta) * 100 : 0;

            $collection->add(
                new BalancePorSucursalItemDTO(
                    BalanceGeneralItemTipo::VENTAS,
                    $this->balanceGeneralFiltersDTO,
                    $data->idsucursal,
                    $data->totalVenta ?? 0,
                    'Con una rentabilidad de ' . round(abs($rentabilidad), 2) . '%',
                    true
                )
            );
        }

        return $collection;
    }

    public function getDataGanancias(): BalanceResponseDTO
    {
        $collection = new BalanceGeneralItemDTOCollection();
        foreach ($this->result as $data) {
            $collection->add(
                new BalancePorSucursalItemDTO(
                    BalanceGeneralItemTipo::GANANCIA,
                    $this->balanceGeneralFiltersDTO,
                    $data->idsucursal,
                    ($data->totalVenta - $data->totalCosto) ?? 0,
                    null,
                    true
                )
            );
        }

        return $collection;
    }
}
