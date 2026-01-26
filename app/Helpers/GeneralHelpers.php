<?php

use Illuminate\Database\Eloquent\Model;
use App\Http\Exceptions\Api\Exceptions\ApiValidationException;

if (! function_exists('get_entity_or_fail')) {
    function get_entity_or_fail(string $modelName, int $id): Model
    {
        // Resolve model class: accept either FQCN or short model name under App\Models
        $class = $modelName;
        if (!class_exists($class)) {
            $maybe = 'App\\Models\\' . ltrim($modelName, '\\');
            if (class_exists($maybe)) {
                $class = $maybe;
            }
        }

        // Validate model class
        if (!class_exists($class) || !is_subclass_of($class, Model::class)) {
            throw new Exception("Model '{$modelName}' does not exist or is not an Eloquent model");
        }

        // Find entity by id
        /** @var Model|null $entity */
        $entity = $class::query()->find($id);
        if (!$entity) {
            throw ApiValidationException::withMessages([
                'id' => ["{$class} with id={$id} not found"],
            ]);
        }

        return $entity;
    }

}

