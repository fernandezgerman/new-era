<?php

use Illuminate\Support\Facades\Route;

// Development-only endpoints
//if (env('APP_ENV') === 'local') {
    // Simple connectivity check: GET /api/dev/ping
    Route::any('/dev/ping', function () {
        return response()->json([
            'ok'   => true,
            'app'  => config('app.name'),
            'env'  => app()->environment(),
            'time' => now()->toDateTimeString(),
        ]);
    })->name('api.dev.ping')
      ->withoutMiddleware(['auth:sanctum', \App\Http\Middleware\CheckLegacyPermissions::class]);
//}
