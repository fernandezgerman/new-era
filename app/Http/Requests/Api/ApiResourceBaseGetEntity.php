<?php

namespace App\Http\Requests\Api;

use App\Http\Exceptions\Api\Exceptions\ApiResourceValidationException;
use App\Http\Exceptions\Api\Exceptions\ApiValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class ApiResourceBaseGetEntity extends FormRequest
{
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
    }

    private function resolveModelClass(?string $entity): string
    {
        if (! $entity) {
            return '';
        }
        // Accept entity in various cases, map to StudlyCase and singular if needed.
        $class = Str::studly(Str::singular($entity));
        return "App\\Models\\$class";
    }
}
