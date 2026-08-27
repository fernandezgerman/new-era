<?php

namespace App\Services\BalanceGeneral\Collections;

use App\Services\Alertas\DTOs\AlertaDetalleDTO;
use App\Services\Alertas\DTOs\AlertaDetalleInformeDTO;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use Illuminate\Support\Collection;

class BalanceGeneralItemDTOCollection extends Collection implements BalanceResponseDTO
{
    protected mixed $allowedType = BalanceGeneraItemDTO::class;
}
