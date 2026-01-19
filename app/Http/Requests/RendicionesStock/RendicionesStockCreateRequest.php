<?php

namespace App\Http\Requests\RendicionesStock;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class RendicionesStockCreateRequest extends AbstractApiRequest
{
    public function rules(): array
    {

        return [
            'idrubro' => ['required', 'integer', 'exists:rubros,id'],
            'idsucursal' => ['required', 'integer', 'exists:sucursales,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'idrubro.required' => 'El rubro es obligatorio.',
            'idsucursal.string' => 'La sucursal es obligatoria.',

            'idrubro.exists' => 'No se encontro el rubro.',
            'idsucursal.exists' => 'No se encontro la sucursal.',
        ];
    }
}
