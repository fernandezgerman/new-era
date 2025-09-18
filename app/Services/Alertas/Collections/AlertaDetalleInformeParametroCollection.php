<?php

namespace App\Services\Alertas\Collections;

use App\Services\Alertas\DTOs\AlertaDetalleInformeDTO;
use App\Services\Alertas\DTOs\AlertaDetalleInformeParametroDTO;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use Illuminate\Support\Collection;

class AlertaDetalleInformeParametroCollection extends Collection
{
    protected mixed $allowedType = AlertaDetalleInformeParametroDTO::class;
}
