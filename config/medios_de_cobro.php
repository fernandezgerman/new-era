<?php

use App\Services\MediosDeCobro\Drivers\MercadoPagoBase\MercadoPagoExtendedFunctionalities;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoCajaDTO;

return [
    'drivers' => [
        'MercadoPagoQR' => [
            'id' => 'MercadoPagoQR',
            'local_id' => 3,
            'config_id' => 3,
            'host' => 'https://api.mercadopago.com/v1/',
            'host_extended_functionalities' => 'https://api.mercadopago.com/',
            'class' => \App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver::class,
            'tipo' => 'QR',
            'id_motivo_movimiento_caja' => env('MERCADO_PAGO_MOTIVO_MOVIMIENTO_CAJA_ID'),
            'gastos' => [
                'proveedorId' => env('MERCADO_PAGO_GASTO_PROVEEDOR_ID'),
                'articuloId' => env('MERCADO_PAGO_GASTO_ARTICULO_ID'),
            ],
            'resolve_image' => fn (MercadoPagoCajaDTO $cajaDto) => MercadoPagoExtendedFunctionalities::getOrCreateQrImage($cajaDto),
        ],
        'MercadoPagoPoint' => [
            'id' => 'MercadoPagoPoint',
            'local_id' => 4,
            'config_id' => 4,
            'host' => 'https://api.mercadopago.com/v1/',
            'host_extended_functionalities' => 'https://api.mercadopago.com/',
            'class' => \App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\MercadoPagoPointDriver::class,
            'tipo' => 'Point',
            'default_image' => 'mp-posnet.png',
            'imprimir_ticket_en_terminal' => true,
            'id_motivo_movimiento_caja' => env('MERCADO_PAGO_MOTIVO_MOVIMIENTO_CAJA_ID'),
            'gastos' => [
                'proveedorId' => env('MERCADO_PAGO_GASTO_PROVEEDOR_ID'),
                'articuloId' => env('MERCADO_PAGO_GASTO_ARTICULO_ID'),
            ],
            'resolve_image' => fn() => Storage::disk('public')->url('mp-posnet.png'),
        ]
    ]
];
