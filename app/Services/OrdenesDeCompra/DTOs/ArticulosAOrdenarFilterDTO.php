<?php

namespace App\Services\OrdenesDeCompra\DTOs;

use App\Collections\MarcaCollection;
use App\Collections\RubroCollection;
use App\Models\Marca;
use App\Models\Rubro;
use App\Models\Sucursal;

class ArticulosAOrdenarFilterDTO
{
    public function __construct(
        public readonly Sucursal $sucursal,
        public readonly RubroCollection $rubros,
        public readonly int $diasVentas,
        public readonly ?MarcaCollection $marcas = null,
        public readonly bool $soloStockActivo = false,
        public readonly bool $soloVendidos = false,
        public readonly int $perPage = 20,
        public readonly int $page = 1,
    ) {
    }

    public static function fromArray(array $data): self
    {
        $sucursal = Sucursal::findOrFail($data['sucursal']);
        $rubros = Rubro::whereIn('id', $data['rubros'])->get();
        $marcas = !empty($data['marcas'])
            ? Marca::whereIn('id', $data['marcas'])->get()
            : null;

        return new self(
            sucursal: $sucursal,
            rubros: $rubros,
            diasVentas: (int) $data['diasventas'],
            marcas: $marcas,
            soloStockActivo: filter_var($data['soloStockActivo'] ?? false, FILTER_VALIDATE_BOOLEAN),
            soloVendidos: filter_var($data['soloVendidos'] ?? false, FILTER_VALIDATE_BOOLEAN),
            perPage: (int) ($data['per_page'] ?? 20),
            page: (int) ($data['page'] ?? 1),
        );
    }
}
