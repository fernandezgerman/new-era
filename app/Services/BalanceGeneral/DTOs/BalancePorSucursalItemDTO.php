<?php

namespace App\Services\BalanceGeneral\DTOs;

use App\Contracts\DTOInterface;
use App\Models\Sucursal;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use Illuminate\Support\Carbon;

class BalancePorSucursalItemDTO implements DTOInterface
{

    public function __construct(
        public BalanceGeneralItemTipo $tipo,
        public BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO,
        public int $sucursalId,
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
            'sucursalId' => $this->sucursalId,
            'total' => $this->total,
            'descripcion' => $this->descripcion,
            'suma' => $this->suma,
        ];
    }
}
