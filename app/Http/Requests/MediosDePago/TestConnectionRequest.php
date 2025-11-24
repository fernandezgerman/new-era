<?php

namespace App\Http\Requests\MediosDePago;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class TestConnectionRequest extends AbstractApiRequest
{
    public function rules(): array
    {

        return [
            'token' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'token.required' => 'El token de app es obligatorio.',
        ];
    }
}
