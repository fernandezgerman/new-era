<?php

namespace App\Http\Exceptions\Api\Handlers;

use App\Http\Exceptions\ExceptionHandlers;

class ApiUnauthorizedExceptionHandler implements ExceptionHandlers
{

    public function __construct(private \Throwable $throwable)
    {}
    public function response(): \Illuminate\Http\JsonResponse
    {
        $payload = [
            'message' => $this->throwable->getMessage() ?: 'No autorizado.',
        ];
        return response()->json($payload, 401);
    }
}
