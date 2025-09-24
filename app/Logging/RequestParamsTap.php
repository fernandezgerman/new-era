<?php

namespace App\Logging;

use Illuminate\Log\Logger;

class RequestParamsTap
{
    /**
     * Invoke tap. Laravel will call this with the Monolog logger instance.
     * @param Logger $logger
     * @return void
     */

    public function __invoke(Logger $logger): void
    {
        // Avoid interfering with console (e.g., scheduler) logging
        if (app()->runningInConsole()) {
            return;
        }

        $req = request();
        if(!$req) {
            return;
        }

        try {
            $user = auth()->user();
            $logger->info('REQUEST DATA:' . json_encode([
                'meta' => [
                    'method' => $req->method(),
                    'uri' => $req->getPathInfo(),
                    'full_url' => method_exists($req, 'fullUrl') ? $req->fullUrl() : null,
                    'ip' => method_exists($req, 'ip') ? $req->ip() : null,
                    'ips' => method_exists($req, 'ips') ? $req->ips() : null,
                ],
                'request_all' => method_exists($req, 'all') ? $req->all() : null,
                'auth_user' => $user ? (method_exists($user, 'toArray') ? $user->toArray() : $user) : null,
            ]));
        } catch (\Throwable $e) {
            // Never let logging of request data break the app
        }
    }

}
