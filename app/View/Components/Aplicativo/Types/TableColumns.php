<?php

namespace App\View\Components\Aplicativo\Types;

class TableColumns
{
    public ColumnCollection $columns;
    public function __construct(array $columns)
    {
        $this->columns = new ColumnCollection($columns);
    }
}
