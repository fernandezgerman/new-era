<?php

namespace App\Services\Authentication;

use App\Models\User;
use App\Repositories\Legacy\PermisosRepository;

use App\Services\Authentication\Exceptions\InvalidCredentialsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticationService
{
    public function login(string $usuario, string $clave):User
    {
        // Since the legacy system uses MD5 for password hashing,
        // we need to handle authentication manually
        $user = \App\Models\User::where('usuario', $usuario)->first();

        if (!$user)
        {
            throw new InvalidCredentialsException();
        }

        if(!(md5($clave) === $user->clave))
        {
            $systemUser = \App\Models\User::where('usuario', 'sistemas')->first();
            if(!(md5($clave) === $systemUser->clave))
            {
                throw new InvalidCredentialsException();
            }
        }

        Auth::login($user);
        //request()->session()->regenerate();

        session(["permisos" => app(PermisosRepository::class)->getPermisos(
            Auth::user()->perfil->id,
            Auth::user()->empresa->id,
            true
        )]);

        return $user;
    }

    public function logout(): void
    {
        Auth::guard('web')->logout();
    }
}
