<?php

namespace App\Services\BalanceGeneral\DTOs;

use App\Contracts\DTOInterface;
use App\Services\BalanceGeneral\Collections\BalanceGeneralItemDTOCollection;

class BalanceGeneralDTO implements DTOInterface
{
    public function __construct(
        public BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO,
        public BalanceGeneralItemDTOCollection $balanceGeneralItemDTOCollection
    )
    {

    }


    public function toArray()
    {
        return [
            'balanceGeneralFiltersDTO' => $this->balanceGeneralFiltersDTO->toArray(),
            'balanceGeneralItemDTOCollection' => $this->balanceGeneralItemDTOCollection->map(fn($item) => $item->toArray())->toArray(),
        ];
    }
}
