<?php

namespace App\Services\Actualizaciones\Collections;

use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use Illuminate\Support\Collection;

class ActualizacionIdentifiersCollection extends Collection
{
    protected mixed $allowedType = ActualizacionIdentifierDTO::class;

}
