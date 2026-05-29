<?php
namespace App\Services\ProveedoresListas\Collecitons;

use App\Services\MediosDeCobro\DTOs\OrderDetalleDTO;
use App\Services\ProveedoresListas\DTOs\ImportacionProveedorListasDTO;
use Illuminate\Support\Collection;

class ImportacionProveedorDTOCollection extends Collection
{
    protected mixed $allowedType = ImportacionProveedorListasDTO::class;
}

