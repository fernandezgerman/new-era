<?php

namespace App\Services\Alertas\Collections;

use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use Illuminate\Support\Collection;

class AlertasSummaryCollection extends Collection
{
    protected mixed $allowedType = AlertaSummaryDTO::class;
}
