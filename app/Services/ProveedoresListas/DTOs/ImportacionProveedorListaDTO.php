<?php

namespace App\Services\ProveedoresListas\DTOs;

use App\Models\ImportacionProveedorListaCabecera;
use App\Services\ProveedoresListas\Collecitons\ImportacionProveedorListaCollection;

class ImportacionProveedorListaDTO
{
    public function __construct(
        public ImportacionProveedorListaCabecera $cabecera,
        public ImportacionProveedorListaCollection $collection
    ) {
    }

    public function toArray(): array
    {
        return [
            'cabecera' => $this->cabecera,
            'detalles' => $this->collection,
        ];
    }
}
