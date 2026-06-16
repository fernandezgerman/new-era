<?php

namespace App\Services\OrdenesDeCompra\DTOs;

use App\Models\Articulo;
use App\Models\Rubro;
use Illuminate\Support\Carbon;

class OrdenesDeCompraFilterDTO
{
    public function __construct(
        public readonly int $page = 1,
        public readonly int $perPage = 50,
        public readonly string $sort = 'id',
        public readonly string $sortDirection = 'desc',
        public readonly ?array $proveedoresId = null,
        public readonly ?array $sucursalesId = null,
        public readonly ?array $usuarios = null,
        public readonly ?string $numeroOrden = null,
        public readonly ?Carbon $fechaDesde = null,
        public readonly ?Carbon $fechaHasta = null,
        public readonly ?int $articuloId = null,
        public readonly ?int $rubroId = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            page: (int) ($data['page'] ?? 1),
            perPage: (int) ($data['per_page'] ?? 50),
            sort: $data['sort'] ?? 'id',
            sortDirection: $data['sort_direction'] ?? 'desc',
            proveedoresId: $data['proveedoresId'] ?? null,
            sucursalesId: $data['sucursalesId'] ?? null,
            usuarios: $data['usuarios'] ?? null,
            numeroOrden: $data['numeroOrden'] ?? null,
            fechaDesde: isset($data['fechaDesde']) ? Carbon::parse($data['fechaDesde']) : null,
            fechaHasta: isset($data['fechaHasta']) ? Carbon::parse($data['fechaHasta']) : null,
            articuloId: isset($data['articulo']) ? (int) $data['articulo'] : null,
            rubroId: isset($data['rubro']) ? (int) $data['rubro'] : null,
        );
    }
}
