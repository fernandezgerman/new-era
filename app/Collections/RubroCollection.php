<?php

namespace App\Collections;

use Illuminate\Database\Eloquent\Collection;

class RubroCollection extends Collection
{
    protected mixed $allowedType = \App\Models\Rubro::class;
}
