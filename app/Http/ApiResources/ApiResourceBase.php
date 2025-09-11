<?php

namespace App\Http\ApiResources;

use App\Http\Requests\Api\ApiResourceBaseGetEntity;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ApiResourceBase extends AbstractApiHandler
{
    public function index(ApiResourceBaseGetEntity $request): JsonResponse
    {
        $entity = $request->validated('entity');
        $id = $request->validated('id');
        $includes = $request->validated('includes', []);

        $modelClass = $this->resolveModelClass($entity);

        // Build query with includes if provided
        /** @var \Illuminate\Database\Eloquent\Builder $query */
        $query = $modelClass::query();
        if (!empty($includes)) {
            $query->with($includes);
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

    private function resolveModelClass(string $entity): string
    {
        $class = Str::studly(Str::singular($entity));
        return "App\\Models\\$class";
    }
}
