<?php

namespace App\Services\Alertas\DTOs;

use App\Contracts\DTOInterface;
use App\Models\AlertaTipo;
use Illuminate\Support\Carbon;

class AlertaSucursalLiquidacionDTO implements DTOInterface
{

    public function __construct(
        public ?array $content,
        public Carbon $fechaHora
    )
    {

    }
    public function toArray()
    {
        return [
            'content' => $this->content,
            'fechaHora' => $this->fechaHora,
        ];
    }
}
