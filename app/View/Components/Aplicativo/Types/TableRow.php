<?php

namespace App\View\Components\Aplicativo\Types;

class TableRow
{
    public ColumnCollection   $columns;
    public function __construct(array $columns = [],
        public string $style = '',
        public int     $rowSpan = 1
    )
    {
        $this->columns = new ColumnCollection($columns);
    }
}
