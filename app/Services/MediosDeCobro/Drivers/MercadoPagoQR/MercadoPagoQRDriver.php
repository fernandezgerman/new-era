<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR;

use App\Contracts\Integrations\HttpClient;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Http\MercadoPagoHttpClient;

class MercadoPagoQRDriver
{
    private HttpClient $httpClient;
    public function __construct()
    {
        $this->httpClient = app(MercadoPagoHttpClient::class);
    }

    public function createOrder()
    {

    }

}
