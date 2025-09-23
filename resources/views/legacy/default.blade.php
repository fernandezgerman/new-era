<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>

    @viteReactRefresh
    @vite(['resources/js/app.js'])
</head>
<body>
<div id="react-login-container1" data-message="{{ session('auth_result') }}"></div>
@php
    use App\Http\Exceptions\Legacy\Exception;
    include_once (config('legacy.get_directorio_publico').'principal.php');
@endphp

</body>
</html>
