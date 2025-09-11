<?php

namespace App\Http\ApiResources;

use App\DataAccessor\UsuarioDataAccessor;
use App\Repositories\Legacy\PermisosRepository;
use App\Services\Authentication\AuthenticationService;
use App\Services\Authentication\Exceptions\InvalidCredentialsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Api\LoginRequest;
use Illuminate\Support\Facades\Auth;

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
    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        app(AuthenticationService::class)->logout();

        return redirect('/');
    }

    /**
     * Show the sucursal selection page.
     *
     * @return \Illuminate\View\View
     */
    public function showSelectionForm()
    {
        $usuarioDataAccessor = app(UsuarioDataAccessor::class,['user' => Auth::user()]);

        return view('sucursal.selection', ['sucursales' => $usuarioDataAccessor->getAllowedSucursales()]);
    }

    /**
     * Handle the sucursal selection.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function selectSucursal(Request $request)
    {
        $request->validate([
            'sucursal' => ['required', 'exists:sucursales,id'],
        ]);

        // Store the selected sucursal in the session
        session(['idSucursalActual' => $request->sucursal]);

        // Redirect to the main page
        return redirect('/');
    }
}
