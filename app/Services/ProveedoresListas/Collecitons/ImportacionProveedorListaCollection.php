<?php
namespace App\Services\ProveedoresListas\Collecitons;

use App\Models\ImportacionProveedorLista;
use App\Services\MediosDeCobro\DTOs\OrderDetalleDTO;
use App\Services\ProveedoresListas\DTOs\ImportacionProveedorListasDTO;
use Illuminate\Support\Collection;

class ImportacionProveedorListaCollection extends Collection
{
    protected mixed $allowedType = ImportacionProveedorLista::class;
}

