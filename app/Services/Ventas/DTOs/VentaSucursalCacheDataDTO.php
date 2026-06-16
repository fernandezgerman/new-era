<?php

namespace App\Services\Ventas\DTOs;

class VentaSucursalCacheDataDTO
{
    public function __construct(public ?int $ventaSucursalFiltroDesdeId,
                                public ?int $ventaSucursalFiltroHastaId){

    }
    public function toArray(): array
    {
        return [
            'ventaSucursalFiltroDesdeId' => $this->ventaSucursalFiltroDesdeId,
            'ventaSucursalFiltroHastaId' => $this->ventaSucursalFiltroHastaId
        ];
    }
}
