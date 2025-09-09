<?php

namespace App\Http\Exceptions\Api\Handlers;

use App\Http\Exceptions\ExceptionHandlers;

class DefaultHandler implements ExceptionHandlers
{

    public function __construct(private \Throwable $throwable)
    {}
    public function response(): \Illuminate\Http\JsonResponse
    {
        $payload = [
            'message' => $this->throwable->getMessage() ?: 'Unidentified error occurred.',
        ];
        return response()->json($payload, 400);
    }
}
