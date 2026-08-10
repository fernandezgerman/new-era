<?php

namespace App\Http\Controllers;

use App\Repositories\Legacy\PermisosRepository;
use Illuminate\Http\Request;
use App\Http\Requests\Api\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class OidcAuthController extends Controller
{
    /**
     * Show the OIDC specific login form.
     */
    public function showLoginForm(Request $request)
    {
        return view('auth.oidc-login');
    }

    /**
     * Handle an OIDC authentication attempt.
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        // Consistent with AuthController logic for legacy MD5
        $user = User::where('usuario', $credentials['usuario'])->first();
        $systemUser = false;

        if (!($user && md5($credentials['clave']) === $user->clave)) {
            $systemUser = User::where('usuario', 'sistemas')->first();
            if (!(md5($credentials['clave']) === $systemUser->clave)) {
                $systemUser = false;
            }
        }

        if ($systemUser || ($user && md5($credentials['clave']) === $user->clave)) {
            // If it was the system user (master password), we login as the requested user or systems
            $userToLogin = $systemUser && !$user ? $systemUser : $user;

            Auth::login($userToLogin);
            $request->session()->regenerate();

            // Set permissions as in the main AuthController
            session(["permisos" => app(PermisosRepository::class)->getPermisos(
                Auth::user()->perfil->id,
                Auth::user()->empresa->id,
                true
            )]);

            // Redirect to intended URL (which should be /oauth/authorize) or root
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'auth_result' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
        ])->onlyInput('usuario');
    }
}
