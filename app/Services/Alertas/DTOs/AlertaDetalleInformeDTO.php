<?php

namespace App\Services\Alertas\DTOs;

use App\Contracts\DTOInterface;
use App\Models\AlertaTipo;
use App\Services\Alertas\Collections\AlertaDetalleInformeParametroCollection;
use App\Services\Alertas\Enums\AlertaColor;
use Carbon\Carbon;

class AlertaDetalleInformeDTO implements DTOInterface
{
    public function __construct(
        public ?string $codigoPagina = null,
        public ?int $id = null,
        public ?int $alertaId = null,
        public ?string $nombre = null,
        public ?AlertaDetalleInformeParametroCollection $parametros = null
    )
    {
    }

    public function toArray()
    {
        return [
            'codigo_pagina' => $this->codigoPagina,
            'id' => $this->id,
            'alerta_id' => $this->alertaId,
            'nombre' => $this->nombre,
            'parametros' => $this->parametros?->toArray() ?? [],
        ];
    }
}
