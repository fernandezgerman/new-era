<?php

namespace App\Services\ProveedoresListas\Contracts;

use App\Services\ProveedoresListas\Collecitons\ImportacionProveedorListaCollection;
use App\Services\ProveedoresListas\DTOs\ImportacionProveedorListaDTO;
use App\Services\ProveedoresListas\DTOs\ImportDataDTO;

interface ImportationStrategyInterface
{
    public function process(ImportacionProveedorListaCollection $importacionProveedorListaCollection): ImportacionProveedorListaCollection;
}
