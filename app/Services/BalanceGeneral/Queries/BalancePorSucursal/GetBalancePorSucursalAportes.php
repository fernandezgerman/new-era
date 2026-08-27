<?php

namespace App\Services\BalanceGeneral\Queries\BalancePorSucursal;

use App\Models\MovimientoCaja;
use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;
use App\Services\BalanceGeneral\Collections\BalancePorSucursalItemDTOCollection;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalItemDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Interface\Queries;
use App\Services\BalanceGeneral\Interface\QueriesPorSucursal;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralAportes;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralRetiros;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalancePorSucursalAportes extends GetBalanceGeneralAportes
{
    protected $descripcion = null;
    protected $result;

    protected $tipoBalance = BalanceGeneralItemTipo::APORTES;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);
        $this->query->select('idsucursaldestino', db::raw('sum(importe) as totalMovimientos'));
        $this->query->groupBy('idsucursaldestino');

        $this->result = $this->query->get();
    }

    public function getData(): BalanceResponseDTO
    {
        $collection = new BalanceGeneralItemDTOCollection();
        foreach($this->result as $data)
        {
            $collection->add(
                new BalancePorSucursalItemDTO(
                    $this->tipoBalance,
                    $this->balanceGeneralFiltersDTO,
                    $data->idsucursaldestino ?? 0,
                    $data->totalMovimientos ?? 0,
                    '',
                    ($this->tipoBalance === BalanceGeneralItemTipo::APORTES)
                ));
        }

        return $collection;
    }

}
