<?php

namespace App\Http\Requests\RendicionesStock;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class RendicionesStockArticulosPendientesRequest extends AbstractApiRequest
{
    public function rules(): array
    {

        return [
            'rendicionId' => ['required', 'integer', 'exists:rendicionesstock,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'rendicionId.required' => 'EL id de rendicion es obligatorio.',
            'rendicionId.exists' => 'No se encontro la rendicion.',
        ];
    }
}
