<?php

namespace App\Services\Alertas\Collections;

use App\Services\Alertas\DTOs\AlertaDetalleDTO;
use App\Services\Alertas\DTOs\AlertaDetalleInformeDTO;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use Illuminate\Support\Collection;

class AlertaDetalleCollection extends Collection
{
    protected mixed $allowedType = AlertaDetalleDTO::class;
}
