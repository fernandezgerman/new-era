<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use phpDocumentor\Parser\Exception;
use Symfony\Component\HttpFoundation\Response;

class MobileRedirect
{
    /**
     * Handle an incoming request.
     * Redirect all requests coming from a mobile device to MOBILE_REDIRECT_TO env URL.
     */
    public function handle(Request $request, Closure $next): Response
    {

        $target = config('app.mobile_redirect_to', env('MOBILE_REDIRECT_TO'));

        // If not configured, do nothing
        if (empty($target)) {
            return $next($request);
        }

        // Avoid redirect loops: if we are already on the target host, continue
        $currentHost = $request->getHost();
        $targetHost = parse_url($target, PHP_URL_HOST);
        if ($targetHost && strcasecmp($currentHost, $targetHost) === 0) {
            return $next($request);
        }

        // Detect mobile using simple User-Agent heuristics
        $ua = strtolower($request->userAgent() ?? '');
        $isMobile = false;
        if ($ua) {
            $mobileIndicators = [
                'iphone','ipod','ipad','android','blackberry','bb10','mini','windows ce','palm','mobile','silk','kindle','opera mobi','opera mini','fennec','webos','nokia','samsung','htc','huawei','xiaomi','miui','redmi','mobi'
            ];
            foreach ($mobileIndicators as $kw) {
                if (strpos($ua, $kw) !== false) {
                    $isMobile = true;
                    break;
                }
            }
        }

        // Additionally, respect an explicit query override ?desktop=1 to skip redirect
        if ($request->query('desktop') == '1') {
            $isMobile = false;
        }

        if ($isMobile) {

            return redirect()->away($target);
        }

        return $next($request);
    }
}
