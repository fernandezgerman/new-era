<?php
namespace App\Services\QueryResolvers\Queries\ReporteMercadoPago\DTOs;

use App\Contracts\DTOInterface;
use App\Models\Sucursal;
use Illuminate\Support\Carbon;

class ReporteMercadoPagoQueryResolverFilters implements DTOInterface
{
    public function __construct(
        public Sucursal $sucursal,
        public Carbon $fechaHoraDesde,
        public Carbon $fechaHoraHasta,
    )
    {

    }

    public function toArray(): array
    {
        return [
            'sucursal' => $this->sucursal,
            'fechaHoraDesde' => $this->fechaHoraDesde,
            'fechaHoraHasta' => $this->fechaHoraHasta,
        ];
    }
}
