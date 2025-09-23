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
        $req = Request();
        if(!$req)
        {
            return;
        }
        $logger->info('REQUEST DATA:' . json_encode([
            'meta' => [
                    'method' => $req->method(),
                    'uri' => $req->getPathInfo(),
                    'full_url' => $req->fullUrl(),
                    'ip' => $req->ip(),
                    'ips' => method_exists($req, 'ips') ? $req->ips() : null,
                ],
            'request_all' => $req->all(),
            'auth_user' => auth()->user()->toArray(),
            ]));
    }

}
