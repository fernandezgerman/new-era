<?php

namespace App\Services\BalanceGeneral\Interface;

use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;

interface Queries
{
    public function getData(): BalanceResponseDTO;
}
