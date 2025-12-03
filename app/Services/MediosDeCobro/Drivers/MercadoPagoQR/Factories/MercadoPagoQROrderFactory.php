<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQROrder;
use App\Services\MediosDeCobro\DTOs\OrderDTO;

use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class MercadoPagoQROrderFactory
{
    /**
     * Crea un modelo MercadoPagoQROrder (no persistido) a partir de un OrderDTO.
     * - Toma datos básicos de sucursal y usuario del DTO.
     * - Usa el gatewayResponse (si existe) para obtener el order_id y datos de pago/QR.
     * - Serializa datos de la venta (items, totales) dentro de venta_data para trazabilidad.
     */
    public static function fromOrderDTO(OrderDTO $orderDTO): MercadoPagoQROrder
    {
        $order = new MercadoPagoQROrder();

        // Construcción de venta_data a partir de los detalles del DTO
        $items = [];
        $total = 0.0;
        foreach ($orderDTO->detalles as $detalle) {
            $lineTotal = (float) $detalle->precio_unitario * (float) $detalle->cantidad;
            $total += $lineTotal;
            $items[] = [
                'articulo_id' => Arr::get($detalle->articulo ?? [], 'id'),
                'articulo_nombre' => Arr::get($detalle->articulo ?? [], 'nombre'),
                'cantidad' => (float) $detalle->cantidad,
                'precio_unitario' => (float) $detalle->precio_unitario,
                'importe' => $lineTotal,
                'id_unico_venta' => $detalle->id_unico_venta ?? null,
            ];
        }

        $ventaData = [
            'sucursal_id' => $orderDTO->sucursal->id ?? null,
            'usuario_id' => 'S'.$orderDTO->usuario->id ?? null,
            'modo_de_cobro_id' => $orderDTO->modoDeCobro->id ?? null,
            'items' => $items,
            'total' => $total,
        ];

        // Datos de respuesta del gateway si ya fueron completados en el DTO por el driver
        $gateway = $orderDTO->gatewayResponse;
        $orderId = $gateway?->id ?: ($gateway?->external_reference ?: null);

        // pago_data almacena información relevante para recuperar el QR o auditar pagos
        $pagoData = [
            'gateway' => 'mercadopago',
            'order' => $gateway ? json_decode(json_encode($gateway), true) : null,
            'qr_data' => $gateway?->type_response?->qr_data ?? null,
            'status' => $gateway?->status ?? null,
        ];

        // Estado inicial
        $estado = $gateway?->status ?? 'pending';

        $order->fill([
            'order_id' => (string)$orderDTO->localId,
            'external_order_id' => (string)$orderId,
            'sucursal_id' => (string)($orderDTO->sucursal->id),
            'fecha_hora_venta' => Carbon::now()->timestamp,
            'venta_data' => $ventaData,
            'pago_data' => $pagoData,
            'estado' => $estado,
        ]);

        return $order;
    }
}
