<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Factories;

use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroConfiguracionException;
use Illuminate\Support\Arr;

class MercadoPagoPointOrderRequestFactory
{
    /**
     * Build Mercado Pago Orders payload for Point terminals.
     * Mirrors the QR request factory but for type "point".
     *
     * @throws MediosDeCobroConfiguracionException
     */
    public static function make(OrderDTO $orderDTO): array
    {
        $total = 0.0;
        foreach ($orderDTO->detalles as $detalle) {
            $total += ((float) $detalle->precio_unitario) * ((float) $detalle->cantidad);
        }

        $payments = [ [ 'amount' => number_format($total, 2, '.', '') ] ];

        $externalReference = 'ID' . $orderDTO->localId;

        // Obtain terminal_id from configuration (metadata.caja.terminal_id)
        $medioDeCobroSucursalConfiguracionDataAccessor = new MedioDeCobroSucursalConfiguracionDataAccessor(
            $orderDTO->sucursal->id,
            $orderDTO->modoDeCobro->id
        );
        $config = $medioDeCobroSucursalConfiguracionDataAccessor->getConfiguracionValidated();
        $terminalId = Arr::get($config->metadata, 'caja.terminal_id');

        // terminal_id may be required depending on account setup; if not present, we still send structure without it
        $pointConfig = array_filter([
            'terminal_id' => $terminalId,
            // Optional: 'print_on_terminal', 'ticket_number' can be added via metadata later
        ]);

        $description = 'Order Point - Sucursal ' . $orderDTO->sucursal->id;

        return [
            'type' => 'point',
            'external_reference' => $externalReference,
            'expiration_time' => 'PT16M',
            'transactions' => [
                'payments' => $payments,
            ],
            'config' => [
                'point' => $pointConfig,
            ],
            'description' => $description,
        ];
    }
}
