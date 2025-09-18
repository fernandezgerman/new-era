<?php

namespace App\Services\Alertas\DTOs;

use App\Contracts\DTOInterface;
use App\Models\AlertaTipo;
use App\Services\Alertas\Enums\AlertaColor;
use Carbon\Carbon;

class AlertaDetalleInformeParametroDTO implements DTOInterface
{
    public function __construct(
        public ?string $clave = null,
        public ?int $id = null,
        public ?string $valor = null,
        public ?string $type = 'POST',
    )
    {
    }

    public function toArray()
    {
        return [
            'clave' => $this->clave,
            'id' => $this->id,
            'valor' => $this->valor,
        ];
    }
}
