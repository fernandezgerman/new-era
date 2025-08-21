<?php

namespace App\Http\Controllers;

use App\DataAccessor\UsuarioDataAccessor;
use App\Repositories\Legacy\PermisosRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'usuario' => ['required'],
            'clave' => ['required'],
        ]);

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
            'usuario' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
        ])->onlyInput('usuario');
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
