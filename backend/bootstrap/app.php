<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Auth\Middleware\Authenticate;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //

    //         $middleware->group('api', [
    //     EnsureFrontendRequestsAreStateful::class,
    //     'throttle:api',
    //     \Illuminate\Routing\Middleware\SubstituteBindings::class,
    // ]);
    $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
        ]);
        
    $middleware->alias([
        'auth' => Authenticate::class,
        'auth:sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'role' => \App\Http\Middleware\RoleMiddleware::class,
        'cors' => \App\Http\Middleware\CorsMiddleware::class,
        'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
