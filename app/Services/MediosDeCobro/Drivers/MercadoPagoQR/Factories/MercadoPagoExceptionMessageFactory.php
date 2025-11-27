<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQROrder;
use App\Services\MediosDeCobro\DTOs\OrderDTO;

use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class MercadoPagoExceptionMessageFactory
{
    public static function fromBodyRequest(array $body): string
    {
        $concatenator = fn($prev, $new) => (blank($prev) ? $new : $prev.PHP_EOL.' '. $new);

        $message= '';
        $message = $concatenator($message, Arr::get($body, 'errors.0.message',''));
        $message = $concatenator($message, Arr::get($body, 'error',''));
        $message = $concatenator($message, Arr::get($body, 'message',''));

        foreach(Arr::get($body,'causes', []) as $cause){
            $message = $concatenator($message, Arr::get($cause, 'description',''));
        }
        return $message;
    }
}
