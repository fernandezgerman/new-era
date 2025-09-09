<?php

namespace App\Http\Exceptions\Api\Handlers;

use App\Http\Exceptions\ExceptionHandlers;

class ApiValidationExceptionHandler implements ExceptionHandlers
{
    public function __construct(private \Throwable $throwable)
    {}
    public function response(): \Illuminate\Http\JsonResponse
    {
        $payload = [
            'message' => $this->throwable->getMessage() ?: 'The given data was invalid.',
            'errors' => $this->throwable->errors(),
        ];
        return response()->json($payload, 400);
    }
}
