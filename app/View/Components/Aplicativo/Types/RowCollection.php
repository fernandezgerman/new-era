<?php

namespace App\View\Components\Aplicativo\Types;

use Illuminate\Support\Collection;

class RowCollection extends Collection
{
    protected mixed $allowedType = TableRow::class;
}
