<?php

namespace App\Collections;

use Illuminate\Database\Eloquent\Collection;

class MarcaCollection extends Collection
{
    protected mixed $allowedType = \App\Models\Marca::class;
}
