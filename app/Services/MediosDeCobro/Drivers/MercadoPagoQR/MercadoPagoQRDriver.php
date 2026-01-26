<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR;

use App\Contracts\Integrations\HttpClient;
use App\Services\MediosDeCobro\Contracts\MedioDeCobroDriverInterface;
use App\Services\MediosDeCobro\Contracts\MedioDeCobroEventHandlerInterface;
use App\Services\MediosDeCobro\Contracts\MedioDeCobroQRDriverInterface;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoCajaDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoQRWebhookEventDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Enum\MercadoPagoQRStatus;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRDynamoPersitanceException;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQREventValidationFaild;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRIdempotencyKeyAlreadyTakenException;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRNotFoundException;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoOrderRequestFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoOrderResponseFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoQROrderNotificationFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoQROrderSqlFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoQRWebhookEventFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Http\MercadoPagoHttpClient;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQROrder;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQROrderSql;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoPaymentDetailFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQRPayment;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\DTOs\OrderPaymentDetailDTO;
use App\Services\MediosDeCobro\DTOs\OrderStatusChangeDTO;
use App\Services\MediosDeCobro\DTOs\WebhookEventDTO;
use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroConfiguracionException;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroInvalidOrderException;
use App\Services\MediosDeCobro\MediosDeCobroNotImplementedException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;



class MercadoPagoQRDriver implements MedioDeCobroQRDriverInterface, MedioDeCobroEventHandlerInterface
{
    private HttpClient $httpClient;
    private MercadoPagoExtendedFunctionalities $extendedFunctionalities;

    /**
     * @throws MediosDeCobroConfiguracionException
     */
    public function __construct(ConnectionDataDTO $connectionDataDTO)
    {
        $this->httpClient = new MercadoPagoHttpClient($connectionDataDTO);

        $connectionDataDTO->host = config('medios_de_cobro.drivers.MercadoPagoQR.host_extended_functionalities');
        $this->extendedFunctionalities = new MercadoPagoExtendedFunctionalities($connectionDataDTO);

    }

    /**
     * @throws MercadoPagoQRDynamoPersitanceException
     */
    public function createOrder(OrderDTO $orderDTO): OrderDTO
    {

        $order = MercadoPagoQROrderSql::where('ventasucursalcobroid',$orderDTO->localId)->first();
        if($order)
        {
            throw new MercadoPagoQRIdempotencyKeyAlreadyTakenException('Ya se genero una orden en mercado pago');
        }

        // Build request payload via factory
        $payload = MercadoPagoOrderRequestFactory::make($orderDTO);

        // Call Mercado Pago orders API
        $response = $this->httpClient->post('orders', $payload, [], $orderDTO->idempotencyKey);

        // Parse and persist the gateway response into the DTO for later usage
        $data = method_exists($response, 'getData') ? (array) $response->getData() : [];

        $orderDTO->gatewayResponse = MercadoPagoOrderResponseFactory::fromArray($data);

        $mercadoPagoQROrder =  MercadoPagoQROrderSqlFactory::fromOrderDTO($orderDTO);

        if(MercadoPagoQROrderSql::where('externalorderid',$data['id'])->doesntExist())
        {
            $mercadoPagoQROrder->save();
        }

        return $orderDTO;
    }

    public function refundOrder(string $localId): OrderDTO
    {
        $mercadoPagoQROrderSql = $this->getMercadoPagoQROrderSqlByLocalId($localId);
        // Build refund endpoint and perform POST with a fresh idempotency key
        $idempotencyKey = (string) Str::uuid();
        $response = $this->httpClient->post('orders/'.$mercadoPagoQROrderSql->externalorderid.'/refund', null, [], $idempotencyKey);
        $data = method_exists($response, 'getData') ? (array) $response->getData() : [];

        // Build and return OrderDTO populated with the gateway response
        $orderDTO = new OrderDTO();
        $orderDTO->externalId = $mercadoPagoQROrderSql->externalorderid;
        $orderDTO->localId = $mercadoPagoQROrderSql->ventasucursalcobroid;
        $orderDTO->gatewayResponse = MercadoPagoOrderResponseFactory::fromArray($data);
        $orderDTO->idempotencyKey = $idempotencyKey;

        return $orderDTO;
    }

    private function getMercadoPagoQROrderSqlByLocalId(string $localId): MercadoPagoQROrderSql
    {
        return MercadoPagoQROrderSql::where('ventasucursalcobroid', $localId)->first();
    }

    public function getOrder(string $localId): OrderDTO
    {
        $mercadoPagoQROrderSql = $this->getMercadoPagoQROrderSqlByLocalId($localId);
        // Call Mercado Pago Orders API
        $response = $this->httpClient->get('orders/'.$mercadoPagoQROrderSql->externalorderid);
        $data = method_exists($response, 'getData') ? (array) $response->getData() : [];

        // Build OrderDTO using the existing factory for the gateway response
        $orderDTO = new OrderDTO();
        $orderDTO->externalId = $mercadoPagoQROrderSql->externalorderid;
        $orderDTO->gatewayResponse = MercadoPagoOrderResponseFactory::fromArray($data);
        $orderDTO->idempotencyKey = '';

        // If we have a local record, fill localId
        $local = MercadoPagoQROrderSql::where('externalorderid', $mercadoPagoQROrderSql->externalorderid)->first();
        if ($local) {
            $orderDTO->localId = $local->ventasucursalcobroid;
        }

        return $orderDTO;
    }

    public function getQRImageURL(OrderDTO $orderDTO): string
    {
        return $orderDTO->gatewayResponse?->type_response?->qr_data ?? '';
    }

    public function validateEventOrigin(Request $request): bool
    {
        try {

            //Explanation: La mierda de mercado pago, admite algunos webhooks con este metodo de validacion, pero otros ni idea ni yo ni la puta documentacion
            // por loq eu decidi clavarle un query param al webhook y la re puta que lo pario

            if($request->get('ne_token') === env('MERCADO_PAGO_WEBHOOK_QUERY_PARAM_AUTH')) return true;

            $signature = $request->header('x-signature');
            if(!$signature) throw new MercadoPagoQREventValidationFaild('Auth event failed.');
            $signatureContent = explode(',',$signature);

            if(count($signatureContent) !== 2) throw new MercadoPagoQREventValidationFaild('Incorrect x-signature format.');

            $tsPosition = 0;
            $keyPosition = 1;

            $signatureContent[$tsPosition] = str_replace('ts=','',$signatureContent[$tsPosition]);
            $signatureContent[$keyPosition] = str_replace('v1=','',$signatureContent[$keyPosition]);

            $id = ($request->get('id') ?? $request->get('data_id'));
            $template = "id:{$id};request-id:{$request->header('x-request-id')};ts:{$signatureContent[$tsPosition]};";

            $key = env('MERCADO_PAGO_WEBHOOK_SECRET_KEY');
            $cyphedSignature = hash_hmac('sha256', $template, $key);

            if($cyphedSignature !== $signatureContent[$keyPosition]) throw new MercadoPagoQREventValidationFaild('Encrypted value does not match.');

        }catch(\Throwable $throwable)
        {
            throw new MercadoPagoQREventValidationFaild('Mercado pago QR events: '. $throwable->getMessage());
        }

        return true;
    }

    public static function processEvent(WebhookEventDTO $webhookEventDTO): ?\App\Services\MediosDeCobro\DTOs\OrderStatusChangeDTO
    {
        $mpQRWebhookEvent = MercadoPagoQRWebhookEventFactory::fromWebhook($webhookEventDTO);
        $localOrder =  MercadoPagoQROrderSql::where('externalorderid', $mpQRWebhookEvent->data->id)->first();

        if(!$localOrder){
            throw new MercadoPagoQRNotFoundException('Mercado pago QR -> Order not found: '.$mpQRWebhookEvent->data->id);
        }

        if($mpQRWebhookEvent->notification_type !== MercadoPagoQRWebhookEventDTO::NOTIFICATION_TYPE_ORDER)
        {
            throw new MediosDeCobroNotImplementedException('Mercado pago QR -> driver does not implement this kind of notification: '. $mpQRWebhookEvent->notification_type);
        }

        $mercadoPagoQROrderNotification = MercadoPagoQROrderNotificationFactory::fromOrderAndWebhook($localOrder, $webhookEventDTO);
        $mercadoPagoQROrderNotification->save();

        if($localOrder->estado !== $mercadoPagoQROrderNotification->estado)
        {
            $localOrder->estado = $mercadoPagoQROrderNotification->estado;
            $localOrder->save();

            $orderStatusChangeDTO = new OrderStatusChangeDTO();
            $orderStatusChangeDTO->externalId = $localOrder->externalorderid;
            $orderStatusChangeDTO->localId = $localOrder->ventasucursalcobroid;
            $orderStatusChangeDTO->status = self::getModoDeCobroStatus($localOrder->estado);

            return $orderStatusChangeDTO;
        }

        return null;
    }

    private static function getModoDeCobroStatus(string $mpQrStatus): MedioDeCobroEstados
    {
        return match($mpQrStatus){
            MercadoPagoQRStatus::EXPIRED->value => MedioDeCobroEstados::EXPIRO,
            MercadoPagoQRStatus::CREATED->value => MedioDeCobroEstados::PENDIENTE,
            MercadoPagoQRStatus::PROCESSED->value => MedioDeCobroEstados::APROBADO,
            MercadoPagoQRStatus::REFUNDED->value => MedioDeCobroEstados::REEMBOLSADO,
            default => throw new MediosDeCobroNotImplementedException('Mercado pago qr driver does not implement this kind of status: '. $mpQrStatus),
        };
    }

    public function testConnection(int $sucursalId): bool
    {
        $mercadoPagoCajaDTO = null;
        try{
            // 1- test token
            $this->httpClient->get('orders/AAAA1');
        }catch(MediosDeCobroInvalidOrderException $e)
        {
        }catch(\Throwable $throwable)
        {
            Log::error($throwable->getMessage());
            throw new MediosDeCobroConfiguracionException('Error al validar el token: '.$throwable->getMessage());
        }

        try{
            //2 - create caja and store
            $mercadoPagoCajaDTO = $this->extendedFunctionalities->getOrCreateCajaForSucursal($sucursalId);
        }catch(\Throwable $throwable)
        {
            Log::error($throwable->getMessage());
            throw $throwable;
        }


        return !blank($mercadoPagoCajaDTO);
    }

    public function syncPaymentDetails(OrderDTO $orderDTO): OrderPaymentDetailDTO
    {
        // Extract payment id from the original gateway response
        $payments = $orderDTO->gatewayResponse->transactions->payments;
        $paymentId = $payments[0]->reference_id;

        if(!$paymentId){
            throw new MediosDeCobroInvalidOrderException('Payment id not found in order gateway response');
        }

        // Call Mercado Pago Payments API
        $response = $this->httpClient->get('payments/'.$paymentId);
        $data = method_exists($response, 'getData') ? (array) $response->getData() : [];

        $orderPaymentDetailDTO = MercadoPagoPaymentDetailFactory::fromArray($data, $orderDTO);

        $mercadoPagoQRPayment = MercadoPagoQRPayment::where('externalpaymentid', $orderPaymentDetailDTO->externalId)->first();

        if(blank($mercadoPagoQRPayment)){
            $mercadoPagoQRPayment = new MercadoPagoQRPayment();

            $mercadoPagoQROrderSql =  MercadoPagoQROrderSql::where('ventasucursalcobroid', $orderDTO->localId)->first();

            $mercadoPagoQRPayment->mercadopagoqrorderid = $mercadoPagoQROrderSql->id;
            $mercadoPagoQRPayment->externalpaymentid = $orderPaymentDetailDTO->externalId;
            $mercadoPagoQRPayment->externalpaymentdata = $orderPaymentDetailDTO->metadata;


            $mercadoPagoQRPayment->save();
        }

        // Build OrderPaymentDetailDTO using factories
        return $orderPaymentDetailDTO;
    }
}
