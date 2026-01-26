<?php

namespace App\View\Components\Aplicativo\Types;

class TableColumn
{
    public function __construct(
        public string $content = '',
        public string $style = '',
        public int     $colSpan = 1,
        public string $class = ''
    )
    {

    }
}
