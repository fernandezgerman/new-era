<?php

namespace App\Http\Exceptions\Api\Handlers;

use App\Http\Exceptions\ExceptionHandlers;
use Illuminate\Support\Facades\Log;

class ApiResourceValidationExceptionHandler implements ExceptionHandlers
{
    public function __construct(private \Throwable $throwable)
    {}
    public function response(): \Illuminate\Http\JsonResponse
    {
        $payload = [
            'message' => 'page not found',
        ];

        Log::error($this->throwable->getMessage(), $this->throwable->getTrace());
        return response()->json($payload, 404);
    }
}
