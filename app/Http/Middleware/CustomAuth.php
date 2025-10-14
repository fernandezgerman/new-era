<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
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

        // Accept either 'user'/'password' or 'usuario'/'clave'
        $username = $request->input('user', $request->input('usuario'));
        $password = $request->input('password', $request->input('clave'));

        if (!$username || !$password) {
            return response()->json([
                'message' => 'Missing credentials',
            ], 403);
        }

        $query = User::query();
        $query->where('usuario', $username);
        $query->where('clave', $password);
        $query->where('activo', 1);

        $user = $query->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 403);
        }

        auth()->setUser($user);

        return $next($request);
    }
}
