<?php

namespace App\Services\ProveedoresListas\Contracts;

use App\Services\ProveedoresListas\Collecitons\ImportacionProveedorDTOCollection;

interface ImportDriverInterface
{
    public function getRows(): ImportacionProveedorDTOCollection;
}
