<?php

namespace App\Http\Requests\RendicionesStock;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class RendicionesStockRendirRequest extends AbstractApiRequest
{
    public function rules(): array
    {

        return [
            'rendicionId' => ['required', 'integer', 'exists:rendicionesstock,id'],
            'idarticulo' => ['required', 'integer', 'exists:articulos,id'],
            'cantidad' => ['required', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'rendicionId.required' => 'EL id de rendicion es obligatorio.',
            'rendicionId.exists' => 'No se encontro la rendicion.',
            'idarticulo.required' => 'EL id del articulo es obligatorio.',
            'idarticulo.exists' => 'No se encontro el articulo.',
            'cantidad.required' => 'La cantidad es obligatoria.',
        ];
    }
}
