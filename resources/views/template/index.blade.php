<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @viteReactRefresh
    @vite(['resources/template/template/src/index.js'])
</head>
<body>
<div id="app"> </div>
</body>
</html>
