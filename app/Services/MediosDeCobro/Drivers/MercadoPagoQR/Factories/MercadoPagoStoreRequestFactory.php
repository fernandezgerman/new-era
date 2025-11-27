<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Models\Sucursal;

class MercadoPagoStoreRequestFactory
{
    /**
     * Build the request payload to create a Mercado Pago store for the given sucursal.
     *
     * Expected shape:
     * {
     *   "name": (sucursales.nombre),
     *   "external_id": ('SUC'.sucursales.id),
     *   "location": {
     *     "street_number": (numbers from sucursales.nombre),
     *     "street_name": (non-number chars from sucursales.nombre),
     *     "city_name": "Retiro",
     *     "state_name": "Capital Federal",
     *     "latitude": sucursales.latitud,
     *     "longitude": sucursales.longitud,
     *     "reference": "New era"
     *   }
     * }
     */
    public static function buildForCreateStore(Sucursal $sucursal, string $sucursalId): array
    {
        $nombre = (string) $sucursal->nombre;

        // Extract numbers and non-numbers from nombre
        $streetNumber = preg_replace('/\D+/', '', $nombre) ?? '';
        $streetName = trim(preg_replace('/\d+/', '', $nombre) ?? '');

        return [
            'name' => $nombre,
            'external_id' => 'SUC' . $sucursalId,
            'location' => [
                'street_number' => $streetNumber,
                'street_name'   => $streetName,
                'city_name'     => 'Retiro',
                'state_name'    => 'Capital Federal',
                'latitude'      => is_null($sucursal->latitud) ? null : (float) $sucursal->latitud,
                'longitude'     => is_null($sucursal->longitud) ? null : (float) $sucursal->longitud,
                'reference'     => 'New era',
            ],
        ];
    }
}
