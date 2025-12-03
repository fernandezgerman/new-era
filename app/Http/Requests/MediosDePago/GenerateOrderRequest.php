<?php

namespace App\Http\Requests\MediosDePago;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class GenerateOrderRequest extends AbstractApiRequest
{
    public function rules(): array
    {

        return [
            'usuario' => ['required', 'string'],
            'clave' => ['required', 'string'],
            'idventassucursalcobro' => ['required', 'integer', 'exists:ventasucursalcobros,id'],
            'idmododecobro' => ['required', 'integer', 'exists:modosdecobro,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'usuario.required' => 'El usuario es obligatorio.',
            'usuario.string' => 'El usuario debe ser un texto.',

            'clave.required' => 'La clave es obligatoria.',
            'clave.string' => 'La clave debe ser un texto.',

            'idventassucursalcobro.required' => 'No se especifico una orden.',
            'idventassucursalcobro.integer' => 'La orden debe ser un número entero.',
            'idventassucursalcobro.exists' => 'No se encontro una orden.',
        ];
    }
}
