<?php

namespace App\Services\BalanceGeneral\DTOs;

use App\Contracts\DTOInterface;
use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;

class BalancePorSucursalDTO implements DTOInterface
{
    public function __construct(
        public BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO,
        public array $result
    )
    {

    }


    public function toArray()
    {
        return [
            'balanceGeneralFiltersDTO' => $this->balanceGeneralFiltersDTO->toArray(),
            'result' => array_map(function ($items) {
                return array_map(fn(BalancePorSucursalItemDTO $item) => $item->toArray(), $items);
            }, $this->result)
        ];
    }
}
