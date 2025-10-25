<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\DTOs\OrderDTO;

class MercadoPagoOrderRequestFactory
{
    public static function make(OrderDTO $orderDTO): array
    {
        $total = 0.0;
        $items = [];
        $payments = [];

        if(count($orderDTO->detalles) > 10)
        {
            foreach ($orderDTO->detalles as $detalle) {
                $lineTotal = (float) $detalle->precio_unitario * (float) $detalle->cantidad;
                $total += $lineTotal;
            }

            $items[] = [
                'title' => 'Articulos varios',
                'unit_price' => number_format((float) $total, 2, '.', ''),
                'quantity' => 1,
                'unit_measure' => 'unit',
                'external_code' => (string) '',
            ];
        }else{
            foreach ($orderDTO->detalles as $detalle) {
                $lineTotal = (float) $detalle->precio_unitario * (float) $detalle->cantidad;
                $total += $lineTotal;

                $items[] = [
                    'title' => $detalle->articulo->nombre ?? ('Articulo ' . $detalle->articulo->id),
                    'unit_price' => number_format((float) $detalle->precio_unitario, 2, '.', ''),
                    'quantity' => (int) $detalle->cantidad,
                    'unit_measure' => 'unit',
                    'external_code' => (string) ($detalle->articulo->codigo ?? $detalle->articulo->id),
                ];
            }
        }

        $payments[] = [ 'amount' => number_format($total, 2, '.', '') ];

        $externalReference = sprintf(
            'suc-%s_usr-%s_%s',
            $orderDTO->sucursal->id,
            $orderDTO->usuario->id,
            now()->timestamp
        );

        $externalPosId = config('services.mercadopago.external_pos_id', env('MP_EXTERNAL_POS_ID', 'CAJA1'));
        $mode = config('services.mercadopago.qr_mode', env('MP_QR_MODE', 'static'));
        $description = 'Order QR - Sucursal ' . $orderDTO->sucursal->id;

        return [
            'type' => 'qr',
            'total_amount' => number_format($total, 2, '.', ''),
            'description' => $description,
            'external_reference' => $externalReference,
            'expiration_time' => 'PT16M',
            'config' => [
                'qr' => [
                    'external_pos_id' => $externalPosId,
                    'mode' => $mode,
                ],
            ],
            'transactions' => [
                'payments' => $payments,
            ],
            'items' => $items,
        ];
    }
}
