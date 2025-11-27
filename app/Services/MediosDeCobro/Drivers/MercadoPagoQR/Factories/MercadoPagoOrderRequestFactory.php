<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroConfiguracionException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

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

        $externalReference = 'ID'.$orderDTO->localId;

        //Obtiene el external identifier de la caja
        $medioDeCobroSucursalConfiguracionDataAccessor = new MedioDeCobroSucursalConfiguracionDataAccessor($orderDTO->sucursal->id, $orderDTO->modoDeCobro->id);
        $medioDeCobroSucursalConfiguracion = $medioDeCobroSucursalConfiguracionDataAccessor->getConfiguracionValidated();
        $externalPosId = Arr::get($medioDeCobroSucursalConfiguracion->metadata, 'caja.external_id');

        if(!$externalPosId)
        {
            throw new MediosDeCobroConfiguracionException('No se encontro la caja para enviar la orden');
        }

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
            //'notification_url' => 'https://flat-ducks-wink.loca.lt/api/medios-de-cobro/mercado-pago-qr/order/event?source_news=webhooks'
        ];
    }
}
