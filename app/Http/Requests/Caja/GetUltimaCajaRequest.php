<?php

namespace App\Http\Requests\Caja;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class GetUltimaCajaRequest extends AbstractApiRequest
{
    public function rules(): array
    {

        return [
            'idsucursal' => ['required', 'integer', 'exists:sucursales,id'],
            'idusuario' => ['required', 'integer', 'exists:usuarios,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'idsucursal.required' => 'La sucursal es obligatoria.',
            'idsucursal.integer' => 'La sucursal debe ser un número entero.',
            'idsucursal.exists' => 'La sucursal seleccionada no existe.',

            'idusuario.required' => 'El usuario es obligatoria.',
            'idusuario.integer' => 'El usuario debe ser un número entero.',
            'idusuario.exists' => 'El usuario seleccionada no existe.',
        ];
    }
}
