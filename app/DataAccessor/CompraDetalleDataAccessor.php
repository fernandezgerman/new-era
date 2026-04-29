<?php

namespace App\DataAccessor;

use App\Models\Articulo;
use App\Models\CompraDetalle;
use App\Models\CostoCompra;

class CompraDetalleDataAccessor extends DataAccessorBase
{
    public function __construct(public CompraDetalle $compraDetalle)
    {

    }
    public function getUnitarioConImpuestos(): float
    {

        $costoConImpuestos = CostoCompra::query()->where('iddetalle', $this->compraDetalle->id)
            ->where('idtipocosto', 1)
            ->first()?->importe;

        if ($costoConImpuestos !== null) {
            return (float)$costoConImpuestos;
        }

        $this->compraDetalle->load('compra');
        $compra = $this->compraDetalle->compra;
        if (!$compra || $compra->totalfactura == 0) {
            return (float)$this->compraDetalle->precio;
        }

        $totalImpuestos = 0;
        foreach ($compra->impuestos as $impuesto) {
            if ($impuesto->suma) {
                $totalImpuestos += (float)$impuesto->valor;
            } else {
                $totalImpuestos -= (float)$impuesto->valor;
            }
        }

        if($totalImpuestos == 0 || blank($totalImpuestos))
            return (float)$this->compraDetalle->precio;

        $porcentajeProporcionalSinImpuestos = ($this->compraDetalle->total_linea) / ($compra->totalfactura - $totalImpuestos);
        $lineaConImpuestos = ($totalImpuestos * $porcentajeProporcionalSinImpuestos) + $this->compraDetalle->total_linea;

        return (float)($lineaConImpuestos / $this->compraDetalle->cantidad);
    }
}
