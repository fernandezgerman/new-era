<?php

namespace App\Http\Requests\MediosDePago;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class ReembolsarOrderByDataRequest extends AbstractApiRequest
{
    public function rules(): array
    {

        return [
           /* 'usuario' => ['required', 'string'],
            'clave' => ['required', 'string'],*/
            'orderId' => ['integer', 'exists:ventasucursalcobros,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'usuario.required' => 'El usuario es obligatorio.',
            'usuario.string' => 'El usuario debe ser un texto.',

            'clave.required' => 'La clave es obligatoria.',
            'clave.string' => 'La clave debe ser un texto.',

            'orderId.required' => 'La venta es obligatoria.',
            'orderId.integer' => 'La venta debe ser un número entero.',
            'orderId.exists' => 'La venta seleccionada no existe.',

        ];
    }
}
