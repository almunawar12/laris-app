<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $userRole = strtolower($request->user()?->role ?? '');
        $allowedRoles = array_map('strtolower', $roles);

        if (!in_array($userRole, $allowedRoles)) {
            abort(403, 'Akses ditolak. Peran Anda (' . $userRole . ') tidak memiliki izin untuk halaman ini.');
        }

        return $next($request);
    }
}
