<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR;

use App\Contracts\Integrations\HttpClient;
use App\Services\MediosDeCobro\Contracts\MedioDeCobroQRDriverInterface;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRDynamoPersitanceException;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoOrderRequestFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoOrderResponseFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoQROrderFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Http\MercadoPagoHttpClient;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use Illuminate\Http\Client\StrayRequestException;

class MercadoPagoQRDriver implements MedioDeCobroQRDriverInterface
{
    private HttpClient $httpClient;
    public function __construct()
    {
        $this->httpClient = app(MercadoPagoHttpClient::class);
    }

    /**
     * @throws MercadoPagoQRDynamoPersitanceException
     */
    public function createOrder(OrderDTO $orderDTO): OrderDTO
    {
        // Build request payload via factory
        $payload = MercadoPagoOrderRequestFactory::make($orderDTO);

        // Call Mercado Pago orders API
        $response = $this->httpClient->post('orders', $payload, [], $orderDTO->idempotencyKey);

        // Parse and persist the gateway response into the DTO for later usage
        $data = method_exists($response, 'getData') ? (array) $response->getData() : [];

        $orderDTO->gatewayResponse = MercadoPagoOrderResponseFactory::fromArray($data);

        $mercadoPagoQROrder =  MercadoPagoQROrderFactory::fromOrderDTO($orderDTO);
        try {
            $mercadoPagoQROrder->save();
        }catch (\Throwable $throwable) {
            throw new MercadoPagoQRDynamoPersitanceException($throwable->getMessage(), $throwable->getCode(), $throwable);
        }

        return $orderDTO;
    }

    public function getQRImageURL(OrderDTO $orderDTO): string
    {
        return $orderDTO->gatewayResponse?->type_response?->qr_data ?? '';
    }
}
