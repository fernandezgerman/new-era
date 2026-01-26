<?php

namespace App\View\Components\Aplicativo;

use App\View\Components\Aplicativo\Types\RowCollection;
use App\View\Components\Aplicativo\Types\TableRow;
use App\View\Components\Aplicativo\Types\TableRows;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Table extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct(
        public TableRow $headers,
        public RowCollection $tableData,
        public string $tableStyle
    )
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.aplicativo.table');
    }
}
