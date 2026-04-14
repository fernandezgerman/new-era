<?php

namespace App\Services\Liquidaciones\Collections;

use App\Services\Liquidaciones\DTOs\HistoricoValorizacionDTO;
use Illuminate\Support\Collection;

class HistoricoValorizacionCollection extends Collection
{
    protected mixed $allowedType = HistoricoValorizacionDTO::class;
}
