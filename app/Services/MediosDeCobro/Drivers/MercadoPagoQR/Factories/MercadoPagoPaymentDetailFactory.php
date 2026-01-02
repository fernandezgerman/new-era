<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\DTOs\Collections\OrderPaymentChargeDetailDTOCollection;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\DTOs\OrderPaymentDetailDTO;
use Illuminate\Support\Arr;

class MercadoPagoPaymentDetailFactory
{
    public static function fromArray(array $data, OrderDTO $orderDTO): OrderPaymentDetailDTO
    {
        $dto = new OrderPaymentDetailDTO();
        $dto->localId = $orderDTO->localId;
        $dto->externalId = (string) (Arr::get($data, 'id') ?? null);

        // Charge details
        $charges = new OrderPaymentChargeDetailDTOCollection();
        foreach ((array) Arr::get($data, 'charges_details', []) as $charge) {
            $charges->push(MercadoPagoPaymentChargeDetailFactory::fromArray((array) $charge));
        }
        $dto->chargeDetails = $charges;

        // Basic payment info
        $dto->paymentTypeId = (string) (Arr::get($data, 'payment_type_id') ?? '');
        $dto->transactionAmount = (float) (Arr::get($data, 'transaction_amount') ?? 0);
        $dto->orderDTO = $orderDTO;
        /*
        $meta = [
            'status' => Arr::get($data, 'status'),
            'status_detail' => Arr::get($data, 'status_detail'),
            'transaction_details' => Arr::get($data, 'transaction_details'),
            'additional_info' => Arr::get($data, 'additional_info'),
            'payment_method' => Arr::get($data, 'payment_method'),
            'card' => Arr::get($data, 'card'),
            'date_approved' => Arr::get($data, 'date_approved'),
            'currency_id' => Arr::get($data, 'currency_id'),
        ];*/
        $dto->metadata = (object) $data;

        return $dto;
    }
}
