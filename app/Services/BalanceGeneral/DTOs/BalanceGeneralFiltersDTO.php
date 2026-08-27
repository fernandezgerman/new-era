<?php

namespace App\Services\BalanceGeneral\DTOs;

use Illuminate\Support\Carbon;

class BalanceGeneralFiltersDTO
{
    public function __construct(
        public ?Carbon $dateFrom,
        public ?Carbon $dateTo,
        public ?array $sucursales,
        public ?array $priodosContables,
    )
    {

    }

    public function toArray(): array
    {
        return [
            'dateFrom' => $this->dateFrom?->format('Y-m-d'),
            'dateTo' => $this->dateTo?->format('Y-m-d'),
            'sucursales' => $this->sucursales,
            'priodosContables' => $this->priodosContables,
        ];
    }
}
