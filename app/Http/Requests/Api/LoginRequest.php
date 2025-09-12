<?php

namespace App\Http\Requests\Api;

use App\Http\Exceptions\Api\Exceptions\ApiResourceValidationException;
use App\Http\Exceptions\Api\Exceptions\ApiValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends AbstractApiRequest
{
    public function rules(): array
    {
        return [
            'usuario' => ['required','string'],
            'clave' => ['required','string'],
        ];
    }

    public function messages(): array
    {
        return [
            'usuario.required' => 'El usuario es obligatorio.',
            'clave.required' => 'La clave es obligatoria.',
        ];
    }
}
