<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use phpDocumentor\Parser\Exception;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class CustomAuth
{
    /**
     * Handle an incoming request.
     *
     * Expect JSON or x-www-form-urlencoded body containing 'user' and 'password'.
     * If a matching user does not exist or password is invalid, return 403.
     */
    public function handle(Request $request, Closure $next): Response
    {
        //ToDo: Create a custom way to auth the mercado pago notifications
        return $next($request);

        // Accept either 'user'/'password' or 'usuario'/'clave'
        $username = $request->input('user', $request->input('usuario'));
        $password = $request->input('password', $request->input('clave'));

        if (!$username || !$password) {
            throw new Exception('Missing credentials');
            /*
            return response()->json([
                'message' => 'Missing credentials',
            ], 403);*/
        }

        $query = User::query();
        $query->where('usuario', $username);
        $query->where('clave', $password);
        $query->where('activo', 1);

        $user = $query->first();

        if (!$user) {
            throw new Exception('User not found');
            /*
            return response()->json([
                'message' => 'User not found',
            ], 403); */
        }

        auth()->setUser($user);

        return $next($request);
    }
}
