<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Models\Sucursal;

class MercadoPagoCajaRequestFactory
{
    /**
     * Build the request payload to create a Mercado Pago POS (Caja) for the given sucursal.
     *
     * Shape:
     * {
     *   "name": sucursal.nombre.' Caja unica',
     *   "fixed_amount": true,
     *   "external_store_id": 'SUC'.sucursal.id,
     *   "external_id": 'SUC'.sucursal.id.'CAJA1'
     * }
     */
    public static function buildForCreateCaja(Sucursal $sucursal): array
    {
        $sucursalId = (string) $sucursal->id;
        return [
            'name' => trim((string) $sucursal->nombre . ' Caja unica'),
            'fixed_amount' => true,
            'external_store_id' => 'SUC' . $sucursalId,
            'external_id' => 'SUC' . $sucursalId . 'CAJA1',
        ];
    }
}
