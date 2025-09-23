<?php

namespace App\Http\Exceptions\Api;

use App\Http\Exceptions\Api\Exceptions\ApiResourceValidationException;
use App\Http\Exceptions\Api\Exceptions\ApiUnauthorizedException;
use App\Http\Exceptions\Api\Exceptions\ApiValidationException;
use App\Http\Exceptions\Api\Handlers\ApiResourceValidationExceptionHandler;
use App\Http\Exceptions\Api\Handlers\ApiUnauthorizedExceptionHandler;
use App\Http\Exceptions\Api\Handlers\ApiValidationExceptionHandler;
use App\Http\Exceptions\Api\Handlers\DefaultHandler;
use Illuminate\Contracts\Container\BindingResolutionException;
use Throwable;

class ExceptionRender
{
    public function handle(Throwable $throwable): \Illuminate\Http\JsonResponse
    {
        $handler = $this->mapExceptionWithHandler($throwable);
        return $handler->response();
    }

    /**
     * @throws BindingResolutionException
     */
    private function mapExceptionWithHandler(Throwable $throwable)
    {
        return match (true){
            $throwable instanceof ApiResourceValidationException => app()->makeWith(ApiResourceValidationExceptionHandler::class, ['throwable' => $throwable]),
            $throwable instanceof ApiValidationException => app()->makeWith(ApiValidationExceptionHandler::class, ['throwable' => $throwable]),
            $throwable instanceof ApiUnauthorizedException => app()->makeWith(ApiUnauthorizedExceptionHandler::class, ['throwable' => $throwable]),
            default => app()->makeWith(DefaultHandler::class, ['throwable' => $throwable]),
        };
    }
}
