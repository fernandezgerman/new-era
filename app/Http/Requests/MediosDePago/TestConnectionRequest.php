<?php

namespace App\Http\Requests\MediosDePago;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class TestConnectionRequest extends AbstractApiRequest
{
    public function rules(): array
    {

        return [
            'configuracionId' => ['required', 'int'],
        ];
    }

    public function messages(): array
    {
        return [
            'configuracionId.required' => 'El id de configuracion de app es obligatorio.',
        ];
    }
}
