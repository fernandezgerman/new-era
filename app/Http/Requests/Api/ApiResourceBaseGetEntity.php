<?php

namespace App\Http\Requests\Api;

use App\Http\Exceptions\Api\Exceptions\ApiResourceValidationException;
use App\Http\Exceptions\Api\Exceptions\ApiValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class ApiResourceBaseGetEntity extends AbstractApiRequest
{
    protected $exception = ApiValidationException::class;

    public function rules(): array
    {
        return [
            // entity and id come from route parameters
            'entity' => ['required', 'string', function ($attribute, $value, $fail) {
                $modelClass = $this->resolveModelClass($value);
                if (! class_exists($modelClass)) {
                    $fail('The selected entity is invalid.');
                }
            }],
            'id' => ['nullable', 'integer', function ($attribute, $value, $fail) {
                if ($value === null) {
                    return;
                }
                $modelClass = $this->resolveModelClass($this->route('entity'));
                if (! class_exists($modelClass)) {
                    $fail('The selected entity is invalid.');
                    return;
                }
                /** @var \Illuminate\Database\Eloquent\Model $model */
                $exists = $modelClass::query()->whereKey($value)->exists();
                if (! $exists) {
                    $fail('The selected id is invalid.');
                }
            }],
            'filtros' => ['nullable', 'array'],
            'orden' => ['nullable', 'array'],
            'includes' => ['sometimes', 'array'],
            'includes.*' => ['string', function ($attribute, $value, $fail) {
                $modelClass = $this->resolveModelClass($this->route('entity'));
                if (! class_exists($modelClass)) {
                    $fail('The selected entity is invalid.');
                    return;
                }
                $instance = new $modelClass();
                if (! method_exists($instance, $value)) {
                    $fail("The include '$value' is not a relation of the model.");
                }
            }],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Move route parameters into validation data keys
        $this->merge([
            'entity' => $this->route('entity'),
            'id' => $this->route('id'),
        ]);

        // Normalize includes: allow comma-separated string or array
        $includes = $this->query('includes');
        if (is_string($includes)) {
            $parts = array_filter(array_map('trim', explode(',', $includes)));
            $this->merge(['includes' => $parts]);
        }

        $filtros = $this->query('filtros');
        if (is_string($filtros)) {
            $filtros = json_decode($filtros, true);
            $this->merge(['filtros' => $filtros]);
        }

        $orden = $this->query('orden');
        if (is_string($orden)) {
            $parts = array_filter(array_map('trim', explode(',', $orden)));
            $this->merge(['orden' => $parts]);
        }
    }
}
