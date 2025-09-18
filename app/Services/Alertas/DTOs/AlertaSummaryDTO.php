<?php

namespace App\Services\Alertas\DTOs;

use App\Contracts\DTOInterface;
use App\Models\AlertaTipo;
use App\Services\Alertas\Enums\AlertaColor;

class AlertaSummaryDTO implements DTOInterface
{
    public function __construct(
        public ?int $cantidad = null,
        public ?int $alertaTipoId = null,
        public ?int $negro = null,
        public ?int $azul = null,
        public ?int $verde = null,
        public ?int $rojo = null,
        public ?int $amarillo = null,
        public ?int $violeta = null,
    )
    {
        if ($alertaTipoId !== null)
        {
            $this->alertaTipo = AlertaTipo::query()
                ->findOrFail($alertaTipoId);
        }
    }

    public AlertaTipo $alertaTipo;

    public function toArray()
    {
        return [
            'cantidad' => $this->cantidad,
            'negro' => strtoupper('negro'),
            'azul' => strtoupper('azul'),
            'verde' => strtoupper('verde'),
            'rojo' => strtoupper('rojo'),
            'amarillo' => strtoupper('amarillo'),
            'violeta' => strtoupper('violeta'),
            'idalertatipo' => $this->alertaTipo->id,
            'alerta_nombre' => $this->alertaTipo->codigo,
            'alerta_descripcion' => $this->alertaTipo->nombre,
        ];
    }
}
