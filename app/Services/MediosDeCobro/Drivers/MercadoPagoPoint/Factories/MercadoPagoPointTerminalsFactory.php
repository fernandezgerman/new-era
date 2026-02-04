<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Factories;

use App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Collections\TerminalDTOCollection;
use App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\DTOs\TerminalDTO;
use Illuminate\Support\Arr;

class MercadoPagoPointTerminalsFactory
{
    public static function fromArray(array $data): TerminalDTOCollection
    {
        $collection = new TerminalDTOCollection();

        $terminals = Arr::get($data, 'data.terminals', []);
        foreach ($terminals as $item) {
            $dto = new TerminalDTO();
            $dto->id = Arr::get($item, 'id');
            $dto->pos_id = self::toIntOrNull(Arr::get($item, 'pos_id'));
            $dto->store_id = (string) Arr::get($item, 'store_id');
            $dto->external_pos_id = Arr::get($item, 'external_pos_id');
            $dto->operating_mode = Arr::get($item, 'operating_mode');
            $collection->push($dto);
        }

        return $collection;
    }

    private static function toIntOrNull($value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }
        return (int) $value;
    }
}
