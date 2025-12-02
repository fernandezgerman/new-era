<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withSingletons([
        \Illuminate\Contracts\Http\Kernel::class => \App\Http\Kernel::class,
        \Illuminate\Contracts\Console\Kernel::class => \App\Console\Kernel::class,
    ])
    ->withProviders([
        \App\Providers\HelperServiceProvider::class,
        \App\Providers\AppServiceProvider::class,
        \App\Services\Actualizaciones\ServiceProviders\ActualizacionesServiceProvider::class
    ])
    ->withEvents()
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
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

        $middleware->statefulApi();
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
        $exceptions->render(function (Exception $e, \Illuminate\Http\Request $request) {
            // Only customize for API requests
            if ($request->is('api/*') || $e instanceof \App\Http\Exceptions\Api\Exceptions\ApiException) {
                return app(App\Http\Exceptions\Api\ExceptionRender::class)->handle($e);
            }
            // For non-API, use default behavior
            return null;
        });
        /*
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, \Illuminate\Http\Request $request) {
            // Only customize for API requests
            if ($request->is('api/*')) {
                $payload = [
                    'message' => $e->getMessage() ?: 'The given data was invalid.',
                    'errors' => $e->errors(),
                ];
                return response()->json($payload, 400);
            }
            // For non-API, use default behavior
            return null;
        });*/
    })->create();
