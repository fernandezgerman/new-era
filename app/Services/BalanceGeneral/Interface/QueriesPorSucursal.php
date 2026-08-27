<?php

namespace App\Services\BalanceGeneral\Interface;

use App\Services\BalanceGeneral\Collections\BalancePorSucursalItemDTOCollection;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;

interface QueriesPorSucursal
{
    public function getDataCollection(): BalancePorSucursalItemDTOCollection;
}
