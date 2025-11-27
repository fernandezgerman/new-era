<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoCajaDTO;
use Illuminate\Support\Arr;

class MercadoPagoCajaDTOFactory
{
    public static function fromArray(array $data): MercadoPagoCajaDTO
    {
        $dto = new MercadoPagoCajaDTO();

        $dto->user_id = self::toIntOrNull(Arr::get($data, 'user_id'));
        $dto->name = Arr::get($data, 'name');
        $dto->category = self::toIntOrNull(Arr::get($data, 'category'));
        $dto->store_id = self::toIntOrNull(Arr::get($data, 'store_id'));
        $dto->external_id = Arr::get($data, 'external_id');
        $dto->id = self::toIntOrNull(Arr::get($data, 'id'));

        $dto->qr = Arr::get($data, 'qr');

        $dto->status = Arr::get($data, 'status');
        $fixed = Arr::get($data, 'fixed_amount');
        $dto->fixed_amount = is_null($fixed) ? null : (bool) $fixed;
        $dto->uuid = Arr::get($data, 'uuid');

        $dto->date_created = Arr::get($data, 'date_created');
        $dto->date_last_updated = Arr::get($data, 'date_last_updated');
        $dto->external_store_id = Arr::get($data, 'external_store_id');

        return $dto;
    }

    private static function toIntOrNull($value): ?int
    {
        if ($value === null) {
            return null;
        }
        if (is_numeric($value)) {
            return (int) $value;
        }
        return null;
    }
}
