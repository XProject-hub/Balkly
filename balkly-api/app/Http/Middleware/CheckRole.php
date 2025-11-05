<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // For API routes, always return JSON (never redirect)
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated. Please login.',
            ], 401);
        }

        if (!in_array($request->user()->role, $roles)) {
            return response()->json([
                'message' => 'Forbidden. Admin access required.',
                'required_role' => $roles,
                'current_role' => $request->user()->role,
            ], 403);
        }

        return $next($request);
    }
}

