<?php

use Illuminate\Http\Request;

if (! function_exists('is_mobile_request')) {
    /**
     * Detects whether the current HTTP request appears to come from a mobile device.
     *
     * Heuristics used (order matters):
     * - Presence of X-Wap-Profile/Profile headers
     * - Accept header contains "wap"
     * - User-Agent contains common mobile keywords
     * - Excludes obvious desktop/bot indicators
     *
     * Note: This is a best-effort, header-based detection suitable for most cases.
     * For mission-critical accuracy, consider integrating a dedicated library like Mobile-Detect.
     *
     * @param Request|null $request Optional request. If null, the current request() helper is used.
     * @return bool
     */
    function is_mobile_request(?Request $request = null): bool
    {
        // Resolve the current request if none provided
        $request ??= request();

        // Quick header-based signals
        if ($request->headers->has('X-Wap-Profile') || $request->headers->has('Profile')) {
            return true;
        }

        $accept = (string) $request->header('Accept', '');
        if (stripos($accept, 'wap') !== false) {
            return true;
        }

        // Analyze User-Agent
        $ua = strtolower((string) $request->header('User-Agent', ''));
        if ($ua === '') {
            // With no UA, err on the side of non-mobile
            return false;
        }

        // Exclude obvious bots/crawlers and desktops early
        $botIndicators = [
            'bot', 'crawl', 'spider', 'slurp', 'bingpreview', 'mediapartners-google'
        ];
        foreach ($botIndicators as $needle) {
            if (str_contains($ua, $needle)) {
                return false;
            }
        }

        // Common desktop OS indicators to down-rank false positives
        $desktopIndicators = [
            'windows nt', // desktop Windows
            'macintosh',  // macOS desktop
            'x11; linux x86', 'x11; ubuntu', 'x11; fedora', 'x11; arch',
        ];
        foreach ($desktopIndicators as $needle) {
            if (str_contains($ua, $needle)) {
                // Still allow if UA also includes very strong mobile terms like "mobi" or specific phones
                $strongMobile = ['mobi', 'iphone', 'iemobile', 'windows phone'];
                foreach ($strongMobile as $sm) {
                    if (str_contains($ua, $sm)) {
                        return true;
                    }
                }
                return false;
            }
        }

        // Mobile keywords list (phones and tablets)
        $mobileKeywords = [
            // Generic
            'mobile', 'mobi', 'phone', 'touch',
            // Apple
            'iphone', 'ipod', 'ipad',
            // Android
            'android', 'silk', 'kindle',
            // Windows
            'windows phone', 'iemobile',
            // Others
            'blackberry', 'bb10', 'playbook',
            'webos', 'hpwos',
            'opera mini', 'opera mobi',
            'nokia', 'samsung', 'htc', 'huawei', 'xiaomi', 'redmi', 'oneplus', 'oppo', 'vivo',
            'lenovo a', 'motorola', 'moto', 'zte', 'sony ericsson',
            'tablet', 'nexus 7', 'nexus 10', 'kfapwi', 'kftt', // Kindle Fire variants
            'fennec'
        ];

        foreach ($mobileKeywords as $needle) {
            if (str_contains($ua, $needle)) {
                return true;
            }
        }

        return false;
    }
}
