<?php

namespace App\Http\Requests\Articulos;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class GetArticulosHistoricoDeCostosRequest extends AbstractApiRequest
{
    public function rules(): array
    {

        return [
            'idarticulo' => ['required', 'integer', 'exists:articulos,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'idarticulo.required' => 'El articulo es obligatorio.',
            'idarticulo.integer' => 'El articulo debe ser un número entero.',
            'idarticulo.exists' => 'El articulo seleccionada no existe.',

        ];
    }
}
