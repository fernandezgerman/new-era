<?php

namespace App\Services\ProveedoresListas\DTOs;

use App\Models\Proveedor;
use App\Services\ProveedoresListas\Enum\SupportedDrivers;
use App\Services\ProveedoresListas\Enum\SupportedFiles;

class ImportDataDTO
{
    public function __construct(public Proveedor $proveedor,
                                public ?string $path,
                                public SupportedDrivers $driver)
    {
    }
}
