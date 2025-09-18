<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class HelperServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // Load application helpers
        $helpers = [
            app_path('Helpers/AuthHelper.php'),
            app_path('Helpers/QueryHelper.php'),
        ];

        foreach ($helpers as $file) {
            if (file_exists($file)) {
                require_once $file;
            }
        }
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
