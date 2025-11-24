<?php

return [
    'drivers' => [
        'MercadoPagoQR' => [
            'id' => 'MercadoPagoQR',
            'local_id' => 3,
            'host' => 'https://api.mercadopago.com/v1/',
            'class' => \App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver::class,
            'tipo' => 'QR',
        ]
    ]
];
