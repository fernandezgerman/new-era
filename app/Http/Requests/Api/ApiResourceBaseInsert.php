<?php

namespace App\Http\Requests\Api;

use App\Http\Exceptions\Api\Exceptions\ApiValidationException;
use Illuminate\Support\Str;

class ApiResourceBaseInsert extends AbstractApiRequest
{
    protected $exception = ApiValidationException::class;

    public function rules(): array
    {
        $base = [
            'entity' => ['required', 'string', function ($attribute, $value, $fail) {
                $modelClass = $this->resolveModelClass($value);
                if (! class_exists($modelClass)) {
                    $fail('The selected entity is invalid.');
                }
            }],
        ];

        // Discover and merge per-entity validator rules if a validator class exists
        $entity = $this->input('entity');
        if (is_string($entity) && $entity !== '') {
            $validator = $this->resolveEntityInsertValidator($entity);
            if ($validator && method_exists($validator, 'rules')) {
                try {
                    $additional = $validator->rules($this);
                    if (is_array($additional)) {
                        // Let entity-specific rules extend or override base ones
                        $base = array_merge($base, $additional);
                    }
                } catch (\Throwable $e) {
                    // Silently ignore validator errors to not break generic insert
                }
            }
        }

        return $base;
    }

    public function messages(): array
    {
        $messages = [];
        $entity = $this->input('entity');
        if (is_string($entity) && $entity !== '') {
            $validator = $this->resolveEntityInsertValidator($entity);
            if ($validator && method_exists($validator, 'messages')) {
                try {
                    $custom = $validator->messages();
                    if (is_array($custom)) {
                        $messages = array_merge($messages, $custom);
                    }
                } catch (\Throwable $e) {
                    // ignore
                }
            }
        }
        return $messages;
    }

    /**
     * Locate a per-entity insert validator class by convention.
     * Tries: App\\Validations\\{Entity}InsertValidation, then ...InsertValidator
     */
    protected function resolveEntityInsertValidator(string $entity): ?object
    {
        $classCore = Str::studly(Str::singular($entity));
        $candidates = [
            "App\\Validations\\{$classCore}InsertValidation",
            "App\\Validations\\{$classCore}InsertValidator",
        ];
        foreach ($candidates as $fqcn) {
            if (class_exists($fqcn)) {
                try {
                    return app($fqcn);
                } catch (\Throwable $e) {
                    try {
                        return new $fqcn();
                    } catch (\Throwable $e2) {
                        // continue
                    }
                }
            }
        }
        return null;
    }
}
