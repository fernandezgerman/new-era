<?php

namespace App\Http\ApiResources;

use App\DataAccessor\UsuarioDataAccessor;
use App\Http\Requests\Api\SelectSucursalRequest;
use App\Models\Sucursal;
use App\Repositories\Legacy\PermisosRepository;
use App\Services\Authentication\AuthenticationService;
use App\Services\Authentication\Exceptions\InvalidCredentialsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Api\LoginRequest;
use Illuminate\Support\Facades\Auth;
use phpDocumentor\Parser\Exception;

class Authentication extends AbstractApiHandler
{
    /**
     * Show the login form.
     *
     * @return \Illuminate\View\View
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        try
        {
            return $this->sendResponse(
                app(AuthenticationService::class)->login(
                    $credentials['usuario'],
                    $credentials['clave']
                ),
            );
        }catch(InvalidCredentialsException $invalidCredentialsException)
        {
            return $this->sendResponseValidationError('Las credenciales proporcionadas no coinciden con nuestros registros.');
        }
    }

    public function logout(Request $request): JsonResponse
    {
        app(AuthenticationService::class)->logout();

        return $this->sendResponse();
    }

    public function selectSucursal(SelectSucursalRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Store the selected sucursal in the session
        session(['idSucursalActual' => $validated['sucursalId']]);

        return $this->sendResponse();
    }

    public function getSucursalActual(): JsonResponse
    {
        $sucursalActual = Sucursal::query()->findOrFail(session('idSucursalActual'));

        return $this->sendResponse($sucursalActual);
    }
}
