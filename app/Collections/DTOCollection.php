<?php

namespace App\Collections;

use App\Contracts\DTOInterface;
use App\Services\Liquidaciones\DTOs\HistoricoValorizacionDTO;
use Illuminate\Support\Collection;

class DTOCollection extends Collection
{
    protected mixed $allowedType = DTOInterface::class;
}
