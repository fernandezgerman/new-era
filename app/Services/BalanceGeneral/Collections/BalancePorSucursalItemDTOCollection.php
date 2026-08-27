<?php

namespace App\Services\BalanceGeneral\Collections;

use App\Services\Alertas\DTOs\AlertaDetalleDTO;
use App\Services\Alertas\DTOs\AlertaDetalleInformeDTO;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalancePorSucursalItemDTO;
use Illuminate\Support\Collection;

class BalancePorSucursalItemDTOCollection extends Collection
{
    protected mixed $allowedType = BalancePorSucursalItemDTO::class;
}
