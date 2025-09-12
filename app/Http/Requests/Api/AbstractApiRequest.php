<?php

namespace App\Http\Requests\Api;

use App\Http\Exceptions\Api\Exceptions\ApiResourceValidationException;
use App\Http\Exceptions\Api\Exceptions\ApiValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

abstract class AbstractApiRequest extends FormRequest
{

    protected function prepareForValidation(): void
    {
        // Move route parameter into the data bag so validation can apply
        if ($this->route()->parameters !== null) {
            foreach ($this->route()->parameters as $clave => $valor) {
                $this->merge([
                    $clave => $valor,
                ]);
            }
        }
    }

    protected $exception = ApiValidationException::class;

    protected function failedValidation(Validator $validator)
    {
        throw (new ApiResourceValidationException($validator))
            ->errorBag($this->errorBag)
            ->redirectTo($this->getRedirectUrl());
    }

    public function authorize(): bool
    {
        return true;
    }
}
