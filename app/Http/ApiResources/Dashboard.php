<?php

namespace App\Http\ApiResources;

use Illuminate\Http\JsonResponse;

class Dashboard extends AbstractApiHandler
{
    public function getUserMenu(): JsonResponse
    {
        $user = auth()->user();

        $usuarioDataAccessor = app(\App\DataAccessor\UsuarioDataAccessor::class, ['user' => $user]);

        return $this->sendResponse($usuarioDataAccessor->getMenu()->toArray());
    }
}
