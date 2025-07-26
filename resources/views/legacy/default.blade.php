<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @viteReactRefresh
    @vite(['resources/js/app.js'])
</head>
<body>
test-container: <div id="test-container"> </div>
@php
    include_once (config('legacy.get_directorio_publico').'principal.php');
@endphp
</body>
</html>
