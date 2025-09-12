<?php

namespace App\Http\Requests\Api;

class SelectSucursalRequest extends AbstractApiRequest
{
    public function rules(): array
    {
        return [
            'sucursalId' => ['required', 'integer', 'exists:sucursales,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'sucursalId.required' => 'La sucursal es requerida.',
            'sucursalId.exists' => 'La sucursal seleccionada no existe.',
        ];
    }
}
