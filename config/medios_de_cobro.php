<?php

return [
    'drivers' => [
        'MercadoPagoQR' => [
            'id' => 'MercadoPagoQR',
            'local_id' => 3,
            'host' => 'https://api.mercadopago.com/v1/',
            'host_extended_functionalities' => 'https://api.mercadopago.com/',
            'class' => \App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver::class,
            'tipo' => 'QR',
            'id_motivo_movimiento_caja' => env('MERCADO_PAGO_MOTIVO_MOVIMIENTO_CAJA_ID')
        ]
    ]
];
