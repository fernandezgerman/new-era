<?php

namespace App\Http\ApiResources;

use App\Http\Requests\Api\ApiResourceBaseGetEntity;
use App\Http\Requests\Api\ApiResourceBaseInsert;
use App\Http\Requests\Api\ApiResourceBasePatch;
use App\Http\Requests\Api\ApiResourceBaseDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ApiResourceBase extends AbstractApiHandler
{
    public function index(ApiResourceBaseGetEntity $request): JsonResponse
    {
        $entity = $request->validated('entity');
        $id = $request->validated('id');
        $includes = $request->validated('includes' ) ?? [];
        $filtros = $request->validated('filtros') ?? [];
        $orden = $request->validated('orden') ?? [];

        $modelClass = $this->resolveModelClass($entity);

        // Build query with includes if provided
        /** @var \Illuminate\Database\Eloquent\Builder $query */
        $query = $modelClass::query();
        if (!empty($includes)) {
            $query->with($includes);
        }

        foreach($filtros as $key => $value)
        {
            $query->where($key, $value);
        }

        foreach($orden as $o)
        {
            $query->orderBy($o);
        }

        $data = null;
        if ($id) {
            $data = $query->find($id);
            if (! $data) {
                return $this->sendResponsePageNotFound();
            }
        } else {
            $data = $query->get();
        }

        return $this->sendResponse($data);

    }

    public function insertResource(ApiResourceBaseInsert $request): JsonResponse
    {
        $entity = $request->validated('entity');
        $modelClass = $this->resolveModelClass($entity);

        // Exclude route parameters from payload
        $payload = collect($request->all())->except(['entity', 'id'])->toArray();

        /** @var \Illuminate\Database\Eloquent\Model $model */
        $model = $modelClass::create($payload);

        return $this->sendResponse($model);
    }

    public function updateResource(ApiResourceBasePatch $request): JsonResponse
    {
        $entity = $request->validated('entity');
        $id = $request->validated('id');
        $modelClass = $this->resolveModelClass($entity);

        /** @var \Illuminate\Database\Eloquent\Model|null $model */
        $model = $modelClass::query()->find($id);
        if (! $model) {
            return $this->sendResponsePageNotFound();
        }

        $payload = collect($request->all())->except(['entity', 'id'])->toArray();
        $model->fill($payload);
        $model->save();

        return $this->sendResponse($model);
    }

    public function deleteResource(ApiResourceBaseDelete $request): JsonResponse
    {
        $entity = $request->validated('entity');
        $id = $request->validated('id');
        $modelClass = $this->resolveModelClass($entity);

        /** @var \Illuminate\Database\Eloquent\Model|null $model */
        $model = $modelClass::query()->find($id);
        if (! $model) {
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
}
