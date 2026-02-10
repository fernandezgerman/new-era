<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class CustomAuth
{
    /**
     * Handle an incoming request.
     *
     * Validate Sanctum token provided as query parameter 'token' and
     * authenticate the associated active user.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Read token from query string
        $tokenString = base64_decode($request->query('token'));

        if (!$tokenString) {
            // If no token provided, try to authenticate using usuario & clave from query params
            $usuario = $request->query('usuario');
            $clave   = $request->query('clave');

            if ($usuario && $clave) {
                $user = User::where('usuario', $usuario)
                    ->where('activo', 1)
                    ->first();

                if ($user && $clave === $user->clave) {
                    // Authenticate the request with the resolved user
                    Auth::setUser($user);
                    $request->setUserResolver(function () use ($user) {
                        return $user;
                    });

                    return $next($request);
                }

                return response()->json([
                    'message' => 'Credenciales invalidas o usuario inactivo '.$usuario.' '.$clave,
                ], 401);
            }

            return response()->json([
                'message' => 'Token requerido en query string (?token=...) o proporcione usuario y clave',
            ], 401);
        }

        // Resolve the personal access token using Sanctum
        $accessToken = PersonalAccessToken::findToken($tokenString);

        if (!$accessToken) {
            return response()->json([
                'message' => 'Token inválido',
            ], 401);
        }

        $tokenable = $accessToken->tokenable;

        if (!($tokenable instanceof User)) {
            return response()->json([
                'message' => 'Token no asociado a un usuario válido',
            ], 401);
        }

        if ((int) $tokenable->activo !== 1) {
            // Ensure user is active (activo = 1)
            return response()->json([
                'message' => 'Usuario inactivo',
            ], 401);
        }


        //$c = Carbon::instance($tokenable->expires_at);

        if (isset($accessToken->expires_at) && Carbon::parse($accessToken->expires_at)->isPast()) {
            // Ensure user is active (activo = 1)
            return response()->json([
                'message' => 'Expiro',
            ], 401);
        }


        // Authenticate the request with the resolved user
        Auth::setUser($tokenable);
        $request->setUserResolver(function () use ($tokenable) {
            return $tokenable;
        });

        return $next($request);
    }
}
