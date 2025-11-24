<?php
namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Http;

use App\Contracts\Integrations\HttpClient;
use App\Contracts\Integrations\IntegrationResponse;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRIdempotencyKeyAlreadyTakenException;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\Exceptions\ErrorInTheRequestException;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroInvalidOrderException;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Illuminate\Support\Facades\Http;

class MercadoPagoHttpClient implements HttpClient
{
    private string $host;


    private string $accessToken;

    public function __construct(ConnectionDataDTO $connectionDataDTO)
    {
        $this->accessToken = $connectionDataDTO->token;
            //"APP_USR-6468260747376535-100914-8f38318e2797248ece7921c68900edac-2915257368";
        $this->host = config('medios_de_cobro.drivers.MercadoPagoQR.host');
            //"https://api.mercadopago.com/v1/";
    }

    public function delete(string $uri, array $data): IntegrationResponse
    {
        return $this->getResponse($this->callHttpMethod('delete', $uri, $data));
    }

    public function get(string $uri, array $data = []): IntegrationResponse
    {
        return $this->getResponse($this->callHttpMethod('get', $uri, $data));
    }

    public function post(string $uri, array $data, array $queryParameters = [], string $idempotencyKey = null): IntegrationResponse
    {
        return $this->getResponse($this->callHttpMethod('post', $uri, $data, $queryParameters, $idempotencyKey ));
    }

    public function put(string $uri, array $data): IntegrationResponse
    {
        return $this->getResponse($this->callHttpMethod('put', $uri, $data));
    }

    private function callHttpMethod(string $method, string $uri,
                                    array $data = [], array $queryParameters = [], string $idempotencyKey = null): \Illuminate\Http\Client\Response
    {
        return Http::withToken($this->accessToken)
            //We set verify = false on non production environments to not get certificate issues from guzzle.
            ->withOptions(['verify' => false, 'stream' => true])
            ->withHeaders($this->getHeaders($idempotencyKey))
            ->withQueryParameters($queryParameters)
            ->{$method}($this->host.$uri, $data);
    }

    private function getHeaders(string $idempotencyKey = null): array
    {
        return [
            'X-Idempotency-Key' => $idempotencyKey
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
            if($response->status() === HttpResponse::HTTP_CONFLICT) //409 idempotenci already used
            {
                throw new MercadoPagoQRIdempotencyKeyAlreadyTakenException('Idempotency Key Already Taken');
            }
            Log::error(json_encode($body));

            if(Arr::get($body, 'errors.0.code') === 'invalid_path_param')
            {
                throw new MediosDeCobroInvalidOrderException('Los parametros definidos no son correctos');
            }

            if($response->status() > 399 && $response->status() < 500)
            {
                throw new ErrorInTheRequestException(Arr::get($body, 'errors.0.message') ?? 'Request error');
            }

            throw new Exception('Unexpected HTTP status code '.$response->status());
        }

        return app(MercadoPagoResponse::class, [
            'status' => $response->status(),
            'data'   => $body,
        ]);
    }
}
