<?php

namespace App\Services\Permisos\ServiceProvider;

use App\Services\Permisos\Enums\CodigosPermisos;
use App\Services\Permisos\PermisosManager;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use App\Models\User;

class PermisosServiceProvider  extends ServiceProvider
{
    public function boot(): void
    {
        Gate::define('editar-gasto', function (User $user) {
            return PermisosManager::userCan(CodigosPermisos::EDITAR_GASTO, $user);
        });
    }
}
