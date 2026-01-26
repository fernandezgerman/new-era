<?php

namespace App\View\Components\Aplicativo\Types;

class TableRows
{
    public RowCollection $rows;

    public function __construct(array $rows)
    {
        $this->rows = new RowCollection($rows);
    }
}
