<?php

namespace App\Services\Alertas\DTOs;

use App\Contracts\DTOInterface;
use App\Models\AlertaTipo;
use App\Services\Alertas\Collections\AlertaDetalleInformesCollection;
use App\Services\Alertas\Enums\AlertaColor;
use Carbon\Carbon;

class AlertaDetalleDTO implements DTOInterface
{
    public function __construct(
        public ?int $alertaTipoId = null,
        public ?AlertaColor $color = null,
        public ?string $descripcion = null,
        public ?Carbon $fechaHora = null,
        public ?Carbon $fechaHoraVisto = null,
        public ?int $id = null,
        public ?int $alertaDestinatarioId = null,
        public ?string $nombre = null,
        public ?AlertaDetalleInformesCollection $alertaDetalleInforme = null,

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
            'color' => $this->color->value,
            'descripcion' => $this->descripcion,
            'fechaHora' => $this->fechaHora?->format('Y-m-d H:i:s') ?? null,
            'fechaHoraVisto' => $this->fechaHoraVisto?->format('Y-m-d H:i:s') ?? null,
            'id' => $this->id,
            'nombre' => $this->nombre,
            'alertaDestinatarioId' => $this->alertaDestinatarioId,
            'alertaDetalleInforme' => $this->alertaDetalleInforme?->toArray() ?? [],
        ];
    }
}
