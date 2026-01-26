<?php

namespace App\View\Components\Aplicativo\Types;

use Illuminate\Support\Collection;

class ColumnCollection extends Collection
{
    protected mixed $allowedType = TableColumn::class;
}
