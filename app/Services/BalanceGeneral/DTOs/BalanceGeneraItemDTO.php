<?php

namespace App\Services\BalanceGeneral\DTOs;

use App\Contracts\DTOInterface;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use Illuminate\Support\Carbon;

class BalanceGeneraItemDTO implements DTOInterface, BalanceResponseDTO
{

    public function __construct(
        public BalanceGeneralItemTipo $tipo,
        public BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO,
        public float $total,
        public ?string $descripcion = '',
        public bool $suma = true,
    )
    {

    }
    public function toArray()
    {
        return [
            'tipo' => $this->tipo->value,
            'balanceGeneralFiltersDTO' => $this->balanceGeneralFiltersDTO->toArray(),
            'total' => $this->total,
            'descripcion' => $this->descripcion,
            'suma' => $this->suma,
        ];
    }
}
