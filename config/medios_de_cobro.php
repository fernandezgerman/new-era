<?php

return [
    'drivers' => [
        'MercadoPagoQR' => [
            'id' => 'MercadoPagoQR',
            'class' => \App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver::class,
            'tipo' => 'QR',

        ]
    ]
];
