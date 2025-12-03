<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoStoreDTO;
use Illuminate\Support\Arr;

class MercadoPagoStoreDTOFactory
{
    public static function fromArray(array $data): MercadoPagoStoreDTO
    {
        $dto = new MercadoPagoStoreDTO();
        $dto->id = (string) Arr::get($data, 'id');
        $dto->name = (string) Arr::get($data, 'name');
        $dto->date_creation = Arr::get($data, 'date_creation');

        $dto->address_line = Arr::get($data, 'location.address_line');
        $dto->reference = Arr::get($data, 'location.reference');
        $lat = Arr::get($data, 'location.latitude');
        $lng = Arr::get($data, 'location.longitude');
        $dto->latitude = is_null($lat) ? null : (float) $lat;
        $dto->longitude = is_null($lng) ? null : (float) $lng;

        $dto->external_id = Arr::get($data, 'external_id');

        return $dto;
    }
}
