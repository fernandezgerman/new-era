<?php

namespace App\Http\Requests\Api;

use App\Http\Exceptions\Api\Exceptions\ApiValidationException;

class ApiResourceBaseDelete extends AbstractApiRequest
{
    protected $exception = ApiValidationException::class;

    public function rules(): array
    {
        return [
            'entity' => ['required', 'string', function ($attribute, $value, $fail) {
                $modelClass = $this->resolveModelClass($value);
                if (! class_exists($modelClass)) {
                    $fail('The selected entity is invalid.');
                }
            }],
            'id' => ['required', 'integer', function ($attribute, $value, $fail) {
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
        ];
    }
}
