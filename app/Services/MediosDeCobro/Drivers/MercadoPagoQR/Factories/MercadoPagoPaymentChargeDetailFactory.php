<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\DTOs\OrderPaymentChargeDetailDTO;
use App\Services\MediosDeCobro\Enums\OrderPaymentChargeDetailTypeEnum;
use Illuminate\Support\Arr;

class MercadoPagoPaymentChargeDetailFactory
{
    public static function fromArray(array $data): OrderPaymentChargeDetailDTO
    {
        $dto = new OrderPaymentChargeDetailDTO();
        $dto->externalId = (string) Arr::get($data, 'id');
        $dto->baseAmount = (float) (Arr::get($data, 'base_amount') ?? 0);
        $dto->name = (string) (Arr::get($data, 'name') ?? '');
        $dto->rate = (float) (Arr::get($data, 'rate') ?? 0);
        $dto->amount = (float) (Arr::get($data, 'amounts.original') ?? 0);
        $dto->payedByCustomer = Arr::get($data, 'accounts.from') === "payer";

        $type = (string) (Arr::get($data, 'type') ?? '');
        $dto->type = match ($type) {
            'tax' => OrderPaymentChargeDetailTypeEnum::TAX,
            'fee' => OrderPaymentChargeDetailTypeEnum::FEE,
            default => OrderPaymentChargeDetailTypeEnum::FEE,
        };

        return $dto;
    }
}
