<?php

namespace App\Http\Controllers;

use App\DataAccessor\UsuarioDataAccessor;
use App\Repositories\Legacy\PermisosRepository;
use Illuminate\Http\Request;
use App\Http\Requests\Api\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use phpDocumentor\Parser\Exception;

class AuthController extends Controller
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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(LoginRequest $request)
    {
        throw new Exception('sdf asdfasd');
        $credentials = $request->validated();

        // Since the legacy system uses MD5 for password hashing,
        // we need to handle authentication manually
        $user = \App\Models\User::where('usuario', $credentials['usuario'])->first();
        $systemUser = false;

        if (!($user && md5($credentials['clave']) === $user->clave)) {
            //try with the key of user, this password is master
            $systemUser = \App\Models\User::where('usuario', 'sistemas')->first();
            if(!(md5($credentials['clave']) === $systemUser->clave))
            {
                $systemUser = false;
            }
        }
        if ($systemUser || ($user && md5($credentials['clave']) === $user->clave)) {
            Auth::login($user);
            $request->session()->regenerate();

            session(["permisos" => app(PermisosRepository::class)->getPermisos(
                Auth::user()->perfil->id,
                Auth::user()->empresa->id,
                true
            )]);

            return redirect()->route('sucursal.selection');
        }

        return back()->withErrors([
            'auth_result' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
        ])->onlyInput('usuario');
    }

    /**
     * Generate and return an API token for a valid user.
     *
     * Expected POST params: 'usuario', 'clave'
     */
    public function getToken(Request $request)
    {
        $data = $request->validate([
            'usuario' => ['required', 'string'],
            'clave'   => ['required', 'string'],
        ]);

        // Locate active user by usuario
        $user = \App\Models\User::where('usuario', $data['usuario'])
            ->where('activo', 1)
            ->first();

        if (!($user && $data['clave'] === $user->clave)) {
            return response()->json([
                'message' => 'Credenciales inválidas o usuario inactivo.'
            ], 401);
        }

        // Create Sanctum token with 3-minute expiration
        $token = $user->createToken('api', ['*'], now()->addMinutes(3))->plainTextToken;

        return response()->json([
            'token' => base64_encode($token),
            'token_type' => 'Bearer',
        ]);
    }
    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

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
