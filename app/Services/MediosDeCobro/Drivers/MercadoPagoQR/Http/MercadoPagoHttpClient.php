<?php
namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Http;

use App\Contracts\Integrations\HttpClient;
use App\Contracts\Integrations\IntegrationResponse;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Illuminate\Support\Facades\Http;

class MercadoPagoHttpClient implements HttpClient
{
    private string $host;

    private string $accessToken;

    public function __construct()
    {
        $this->accessToken = "APP_USR-3275564673385356-101013-a2213ab05478298eb6fce38ae85efda2-2915257368";
        $this->host = "api.mercadopago.com/v1/";
    }

    public function delete(string $uri, array $data): IntegrationResponse
    {
        return $this->getResponse($this->callHttpMethod('delete', $uri, $data));
    }

    public function get(string $uri, array $data = []): IntegrationResponse
    {
        return $this->getResponse($this->callHttpMethod('get', $uri, $data));
    }

    public function post(string $uri, array $data, array $queryParameters = []): IntegrationResponse
    {
        return $this->getResponse($this->callHttpMethod('post', $uri, $data, $queryParameters));
    }

    public function put(string $uri, array $data): IntegrationResponse
    {
        return $this->getResponse($this->callHttpMethod('put', $uri, $data));
    }

    private function callHttpMethod(string $method, string $uri,
                                    array $data = [], array $queryParameters = []): \Illuminate\Http\Client\Response
    {
        return Http::withToken($this->accessToken)
            //We set verify = false on non production environments to not get certificate issues from guzzle.
            ->withOptions(['verify' => false, 'stream' => true])
            ->withHeaders($this->getHeaders())
            ->withQueryParameters($queryParameters)
            ->{$method}($this->host.$uri, $data);
    }

    private function getHeaders(): array
    {
        return [

        ];
    }
    private function getResponse(\Illuminate\Http\Client\Response $response): IntegrationResponse
    {
        $body = $response->json();

        $httpOkResponsesStatus = [
            HttpResponse::HTTP_OK,
            HttpResponse::HTTP_CREATED,
            HttpResponse::HTTP_ACCEPTED,
            HttpResponse::HTTP_NON_AUTHORITATIVE_INFORMATION,
            HttpResponse::HTTP_NO_CONTENT,
            HttpResponse::HTTP_RESET_CONTENT,
            HttpResponse::HTTP_PARTIAL_CONTENT,
            HttpResponse::HTTP_MULTI_STATUS,
            HttpResponse::HTTP_ALREADY_REPORTED,
            HttpResponse::HTTP_IM_USED,
        ];

        if (! in_array($response->status(), $httpOkResponsesStatus))
        {
            //throw ExceptionFactory::makeFromResponse($response);
        }

        return app(IntegrationResponse::class, [
            'status' => $response->status(),
            'data'   => $body,
        ]);
    }
}
