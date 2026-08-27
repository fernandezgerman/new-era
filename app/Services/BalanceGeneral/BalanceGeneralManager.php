<?php

namespace App\Services\BalanceGeneral;

use App\Models\LiquidacionPeriodo;
use App\Models\Sucursal;
use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;
use App\Services\BalanceGeneral\Collections\BalancePorSucursalItemDTOCollection;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalFiltersDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalItemDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Queries\BalancePorSucursal\GetBalancePorSucursalAportes;
use App\Services\BalanceGeneral\Queries\BalancePorSucursal\GetBalancePorSucursalCompras;
use App\Services\BalanceGeneral\Queries\BalancePorSucursal\GetBalancePorSucursalGastos;
use App\Services\BalanceGeneral\Queries\BalancePorSucursal\GetBalancePorSucursalPagos;
use App\Services\BalanceGeneral\Queries\BalancePorSucursal\GetBalancePorSucursalRetiros;
use App\Services\BalanceGeneral\Queries\BalancePorSucursal\GetBalancePorSucursalSobrantes;
use App\Services\BalanceGeneral\Queries\BalancePorSucursal\GetBalancePorSucursalVentas;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralAportes;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralArregloStock;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralCompras;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralGastos;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralPagos;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralRetiros;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralRevalorizacionesDeSucursales;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralSobrantes;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralTara;
use App\Services\BalanceGeneral\Queries\GetBalanceGeneralVentas;
use Illuminate\Support\Arr;

class BalanceGeneralManager
{
    public function getBalanceGeneral(BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO): BalanceGeneralDTO
    {

        $collection = new BalanceGeneralItemDTOCollection();

        $balances = [
            GetBalanceGeneralVentas::class,
            GetBalanceGeneralAportes::class,
            GetBalanceGeneralSobrantes::class,
            GetBalanceGeneralCompras::class,
            GetBalanceGeneralPagos::class,
            GetBalanceGeneralGastos::class,
            GetBalanceGeneralRetiros::class,
            // GetBalanceGeneralTara::class
        ];

        foreach($balances as $class)
        {
            $collection->add(
                (new $class($balanceGeneralFiltersDTO))->getData()
            );
        }

        return new BalanceGeneralDTO(
            $balanceGeneralFiltersDTO,
            $collection
        );
    }

    public function getBalancePorPeriodoPorSucursal(
        BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO
    ): BalancePorSucursalDTO
    {

        $balances = [
            GetBalancePorSucursalVentas::class,
            GetBalancePorSucursalAportes::class,
            GetBalancePorSucursalSobrantes::class,
            GetBalancePorSucursalCompras::class,
            GetBalancePorSucursalPagos::class,
            GetBalancePorSucursalGastos::class,
            GetBalancePorSucursalRetiros::class,
        ];

        $valoresPorSucursal = [];
        foreach($balances as $class)
        {
            /** @var BalancePorSucursalItemDTOCollection $collection */
            $collection = (new $class($balanceGeneralFiltersDTO))->getData();

            /** @var BalancePorSucursalItemDTO $item */
            foreach($collection as $item)
            {
                $record = Arr::get($valoresPorSucursal, $item->sucursalId, []);
                $record[] = $item;

                $valoresPorSucursal[$item->sucursalId] = $record;

            }
        }

        return new BalancePorSucursalDTO(
            $balanceGeneralFiltersDTO,
            $valoresPorSucursal
        );
    }
}
