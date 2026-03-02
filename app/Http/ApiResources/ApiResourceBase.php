<?php

namespace App\Http\ApiResources;

use App\Http\Requests\Api\ApiResourceBaseGetEntity;
use App\Http\Requests\Api\ApiResourceBaseInsert;
use App\Http\Requests\Api\ApiResourceBasePatch;
use App\Http\Requests\Api\ApiResourceBaseDelete;
use App\Models\AgrupacionCaja;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use function PHPUnit\Framework\isArray;

class ApiResourceBase extends AbstractApiHandler
{
    public function index(ApiResourceBaseGetEntity $request): JsonResponse
    {
        $entity = $request->validated('entity');
        $id = $request->validated('id');
        $includes = $request->validated('includes') ?? [];
        $filtros = $request->validated('filtros') ?? [];
        $orden = $request->validated('orden') ?? [];

        $modelClass = $this->resolveModelClass($entity);

        // Build query with includes if provided
        /** @var \Illuminate\Database\Eloquent\Builder $query */
        $query = $modelClass::query();
        $customAttributes = [];
        if (!empty($includes)) {
            foreach ($includes as $include) {
                if (method_exists($modelClass, 'get'.ucfirst($include).'Attribute')) {
                    $customAttributes[] = $include;
                }else{
                    $query->with($include);
                }
            }
        }

        foreach ($filtros as $key => $value) {
            $query->where($key, $value);
        }

        foreach ($orden as $o) {
            $query->orderBy($o);
        }

        $data = null;
        if ($id) {
            $data = $query->find($id);
            if (!$data) {
                return $this->sendResponsePageNotFound();
            }

            foreach ($customAttributes as $attribute) {
                $data['$attribute'] = $data->getAttribute($attribute);
            }
        } else {
            $data = $query->get();
            $data->toArray();
            foreach($data as $key => $item) {
                foreach ($customAttributes as $attribute) {
                    $item[$attribute] = $item->$attribute;
                    $data[$key] = $item;
                }
            }
        }

        //$modelClass->{$include}


        return $this->sendResponse($data);

    }

    public function insertResource(ApiResourceBaseInsert $request): JsonResponse
    {
        // Exclude route parameters from payload
        $payload = collect($request->all())->except(['entity', 'id', 'relations'])->toArray();
        $entity = $request->validated('entity');
        /** @var \Illuminate\Database\Eloquent\Model $model */
        $model = $this->processInsert($entity, $payload);

        $this->processRelations($request->all(), $model, 'id'.str_replace('-','', $entity));


        return $this->sendResponse($model);
    }

    private function processRelations(array $data, Model $belongToModel, string $belongToFieldName): void
    {
        $relations = Arr::get($data, 'relations', []);

        foreach ($relations as $relation) {
            $entity = Arr::get($relation, 'entity');

            $payload = Arr::get($relation, 'payload');
            $payload = isArray($payload) ? $payload : [$payload];

            foreach ($payload as $item) {
                $itemToSave = [
                    ...$item,
                    $belongToFieldName => $belongToModel->id,
                ];

                if(Arr::get($item, 'deleted') !== true)
                {
                    $relationModel = $this->processInsert($entity, $itemToSave);
                    $this->processRelations($relation, $relationModel, 'id'.$entity);
                }

            }
        }
    }
    private function processInsert($entity, $payload): Model
    {
        $modelClass = $this->resolveModelClass($entity);
        return $modelClass::create($payload);
    }

    private function processUpdate($entity, $payload): Model
    {
        $modelClass = $this->resolveModelClass($entity);
        return $modelClass::updateOrCreate(
            ['id' => $payload['id']],
            $payload
        );
    }

    private function processDelete($entity, $payload)
    {
        $modelClass = $this->resolveModelClass($entity);
        $modelClass::find($payload['id'])->delete();
    }

    public function updateResource(ApiResourceBasePatch $request): JsonResponse
    {
        $entity = $request->validated('entity');
        $id = $request->validated('id');
        $modelClass = $this->resolveModelClass($entity);

        /** @var \Illuminate\Database\Eloquent\Model|null $model */
        $model = $modelClass::query()->find($id);
        if (!$model) {
            return $this->sendResponsePageNotFound();
        }

        $payload = collect($request->all())->except(['entity', 'id'])->toArray();

        // Fill model while preserving existing keys in JSON/array attributes (patch-like behavior)
        $mergedPayload = [];
        foreach ($payload as $attr => $value) {
            $current = $model->getAttribute($attr);

            $currentArr = $this->toArrayIfJsonLike($current);
            $incomingArr = $this->toArrayIfJsonLike($value);

            if (is_array($currentArr) && is_array($incomingArr)) {
                // Deep-merge arrays so unspecified keys are preserved
                $mergedPayload[$attr] = $this->deepMerge($currentArr, $incomingArr);
            } else {
                // For non-array attributes or when the incoming value isn't an array, replace normally
                $mergedPayload[$attr] = $value;
            }
        }

        $model->fill($mergedPayload);
        $model->save();

        $this->processUpdateRelations($request->all(), $model, 'id'.str_replace('-','', $entity));
        return $this->sendResponse($model);
    }
    private function processUpdateRelations(array $data, Model $belongToModel, string $belongToFieldName): void
    {
        $relations = Arr::get($data, 'relations', []);

        foreach ($relations as $relation) {
            $entity = Arr::get($relation, 'entity');
            $payload = Arr::get($relation, 'payload');
            $payload = isArray($payload) ? $payload : [$payload];

            foreach ($payload as $item) {
                $itemToSave = [
                    ...$item,
                    $belongToFieldName => $belongToModel->id,
                ];
                if(isset($itemToSave['id'])){
                    if(Arr::get($itemToSave,'deleted'))
                    {
                        $this->processDelete($entity, $itemToSave);
                    }else{
                        $relationModel = $this->processUpdate($entity, $itemToSave);
                        $this->processRelations($relation, $relationModel, 'id'.$entity);
                    }
                }else{
                    if(Arr::get($itemToSave,'deleted') !== true)
                    {
                        $relationModel = $this->processInsert($entity, $itemToSave);
                        $this->processRelations($relation, $relationModel, 'id'.$entity);
                    }
                }
            }
        }
    }

    public function deleteResource(ApiResourceBaseDelete $request): JsonResponse
    {
        $entity = $request->validated('entity');
        $id = $request->validated('id');
        $modelClass = $this->resolveModelClass($entity);

        /** @var \Illuminate\Database\Eloquent\Model|null $model */
        $model = $modelClass::query()->find($id);
        if (!$model) {
            return $this->sendResponsePageNotFound();
        }

        $model->delete();

        return $this->sendResponse(['deleted' => true]);
    }

    private function resolveModelClass(string $entity): string
    {
        $class = Str::studly(Str::singular($entity));
        return "App\\Models\\$class";
    }

    /**
     * Convert a value to array if it's already an array, Arrayable, or a JSON-encoded string.
     * Returns null when the value is not array-like.
     *
     * @param mixed $value
     * @return array|null
     */
    private function toArrayIfJsonLike($value): ?array
    {
        if (is_array($value)) {
            return $value;
        }

        if ($value instanceof Arrayable) {
            return $value->toArray();
        }

        if (is_string($value)) {
            $trim = trim($value);
            if ($trim !== '' && ($trim[0] === '{' || $trim[0] === '[')) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    return $decoded;
                }
            }
        }

        return null;
    }

    /**
     * Deep merge two arrays. For associative arrays, keys are merged recursively.
     * For sequential (list) arrays, the override replaces the base completely.
     *
     * @param array $base
     * @param array $override
     * @return array
     */
    private function deepMerge(array $base, array $override): array
    {
        $baseIsAssoc = $this->isAssoc($base);
        $overrideIsAssoc = $this->isAssoc($override);

        if (!$baseIsAssoc || !$overrideIsAssoc) {
            // If either is a list, prefer override (patch semantics for lists)
            return $override;
        }

        foreach ($override as $key => $val) {
            if (array_key_exists($key, $base)) {
                if (is_array($base[$key]) && is_array($val)) {
                    $base[$key] = $this->deepMerge($base[$key], $val);
                } else {
                    $base[$key] = $val; // replace scalar or mismatched types
                }
            } else {
                $base[$key] = $val; // new key
            }
        }

        return $base;
    }

    /**
     * Determine if an array is associative.
     */
    private function isAssoc(array $arr): bool
    {
        if ($arr === []) {
            return true; // treat empty as associative for merge purposes
        }
        return array_keys($arr) !== range(0, count($arr) - 1);
    }
}
