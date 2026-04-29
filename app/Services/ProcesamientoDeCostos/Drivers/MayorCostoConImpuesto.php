<?php

namespace App\Services\ProcesamientoDeCostos\Drivers;

use App\DataAccessor\CompraDetalleDataAccessor;
use App\Models\CompraDetalle;
use App\Services\Compras\ComprasManager;
use App\Services\ProcesamientoDeCostos\Contracts\ProcesamientoDeCostosInterface;

class MayorCostoConImpuesto implements ProcesamientoDeCostosInterface
{
    /**
     * Aplica como nuevo costo si:
     * - No es rubro gastos
     * - El costo es mayor al anterior
     * @param CompraDetalle $compradetalle
     * @return bool
     */
    public function ShouldBeCostoSetted(CompraDetalle $compradetalle): bool
    {

        $compraDetalle = app(ComprasManager::class)->getCompraDetallesLimpiasQuery()
            ->where('comprasdetalle.id', $compradetalle->id)
            ->first();

        if(blank($compraDetalle))return false;

        if($compraDetalle->articulo->rubro->esrubrogastos == 1) return false;

        if(blank($compraDetalle->articulo->compradetalle))
        {
            $oldCosto = $compraDetalle->articulo->costo;
        }else{
            $oldCosto = (new CompraDetalleDataAccessor($compraDetalle->articulo->compradetalle))->getUnitarioConImpuestos();
        }

        $newCompraDetalleDataAccessor = new CompraDetalleDataAccessor($compraDetalle);

        return (
            $oldCosto < $newCompraDetalleDataAccessor->getUnitarioConImpuestos()
        );
    }
}
