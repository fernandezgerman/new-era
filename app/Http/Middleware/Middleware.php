<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Configuration\Middleware as FoundationMiddleware;
class Middleware extends FoundationMiddleware
{
    public function getMiddlewareGroups()
    {
        return parent::getMiddlewareGroups();
    }
}
