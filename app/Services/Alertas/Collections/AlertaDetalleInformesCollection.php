<?php

namespace App\Services\Alertas\Collections;

use App\Services\Alertas\DTOs\AlertaDetalleInformeDTO;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use Illuminate\Support\Collection;

class AlertaDetalleInformesCollection extends Collection
{
    protected mixed $allowedType = AlertaDetalleInformeDTO::class;
}
