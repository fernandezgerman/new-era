<?php
namespace App\Services\QueryResolvers\Queries\LimpiezaDeArticulos\DTOs;

use App\Contracts\DTOInterface;
use App\Models\Articulo;
use App\Models\Rubro;
use App\Models\Sucursal;
use App\Services\QueryResolvers\Queries\LimpiezaDeArticulos\Enums\LimpiezaDeArticulosQueryResolverTipoDeReporte;

class LimpiezaDeArticulosQueryResolverFilters implements DTOInterface
{
    public function __construct(
        public LimpiezaDeArticulosQueryResolverTipoDeReporte $tipoDeReporte,
        public ?Sucursal $sucursal,
        public ?Articulo $articulo,
        public ?Rubro $rubro,
        public ?int $diasDesdeUltimaCompra,
        public ?int $diasDesdeUltimaVenta,
    )
    {

    }

    public function toArray(): array
    {
        return [
            'tipoDeReporte' => $this->tipoDeReporte,
            'sucursal' => $this->sucursal,
            'articulo' => $this->articulo,
            'rubro' => $this->rubro,
            'diasDesdeUltimaCompra' => $this->diasDesdeUltimaCompra,
            'diasDesdeUltimaVenta' => $this->diasDesdeUltimaVenta,
        ];
    }
}
