<?php

namespace App\Http\ApiResources;

use Illuminate\Http\JsonResponse;

abstract class AbstractApiHandler
{
    public function sendResponse($data = []): JsonResponse
    {
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
