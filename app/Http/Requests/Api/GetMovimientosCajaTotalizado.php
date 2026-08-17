<?php

namespace App\Http\Requests\Api;

use App\Http\Exceptions\Api\Exceptions\ApiResourceValidationException;
use App\Http\Exceptions\Api\Exceptions\ApiValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class GetMovimientosCajaTotalizado extends AbstractApiRequest
{
    protected $exception = ApiValidationException::class;

    public function rules(): array
    {
        return [
            'filtros' => ['nullable', 'array']
        ];
    }

    protected function prepareForValidation(): void
    {
        $filtros = $this->query('filtros');
        if (is_string($filtros)) {
            $filtros = json_decode($filtros, true);
            $this->merge(['filtros' => $filtros]);
        }
    }
}
