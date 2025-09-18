<?php

namespace App\Http\ApiResources;

use App\Contracts\Transformer;
use Illuminate\Http\JsonResponse;

abstract class AbstractApiHandler
{
    public function sendResponse($data = [], ?Transformer $transformer = null): JsonResponse
    {
        if($transformer !== null)
        {
            foreach($data as $key => $value)
            {
                $data[$key] = $transformer->transform($value);
            }
        }

        return response()->json($data);
    }

    public function sendResponsePageNotFound(): JsonResponse
    {
        return response()->json(['message' => 'Not Found'], 404);
    }

    public function sendResponseValidationError(
        string $message, ?array $extraData = null
    ): JsonResponse
    {
        return response()->json(['message' => $message, 'extra' => $extraData], 400);
    }
}
