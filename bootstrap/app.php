<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Register admin routes with admin middleware group
            Route::middleware('legacy')->group(__DIR__.'/../routes/legacy.php');
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Define a new 'admin' middleware group with the same middleware as 'web'
        $middleware->group('legacy', [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);

        // Modify the 'web' middleware group
        $middleware->web(
            // Append middleware to the end of the web group
            append: [
                // Example: \App\Http\Middleware\CustomWebMiddleware::class,
            ],
            // Prepend middleware to the beginning of the web group
            prepend: [
                // Example: \App\Http\Middleware\AnotherCustomMiddleware::class,
            ],
            // Remove middleware from the web group
            remove: [
                // Example: \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
            ],
            // Replace middleware in the web group
            replace: [
                // Example: \Illuminate\Cookie\Middleware\EncryptCookies::class => \App\Http\Middleware\CustomEncryptCookies::class,
            ]
        );

        // Modify the 'api' middleware group
        $middleware->api(
            // Append middleware to the end of the api group
            append: [
                // Example: \App\Http\Middleware\CustomApiMiddleware::class,
            ],
            // Prepend middleware to the beginning of the api group
            prepend: [
                // Example: \App\Http\Middleware\ApiRateLimiter::class,
            ],
            // Remove middleware from the api group
            remove: [
                // Example: 'throttle:api',
            ],
            // Replace middleware in the api group
            replace: [
                // Example: \Illuminate\Routing\Middleware\SubstituteBindings::class => \App\Http\Middleware\CustomBindings::class,
            ]
        );
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
