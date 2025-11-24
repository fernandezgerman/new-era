<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @if(config('legacy.tailwind.pages-to-include-tailwind.'.Request()->get('pagina')))
        @vite('resources/css/app.css')
    @endif
    @viteReactRefresh
    @vite(['resources/js/app.js'])
</head>
<body>
<div id="react-login-container1" data-message="{{ session('auth_result') }}"></div>
@php
    include_once (config('legacy.get_directorio_publico').'principal.php');
@endphp

</body>
</html>
