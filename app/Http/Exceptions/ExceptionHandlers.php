<?php

namespace App\Http\Exceptions;

interface ExceptionHandlers
{
    public function response(): \Illuminate\Http\JsonResponse;
}
