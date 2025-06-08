<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>

</head>
<body>
@php
    include_once (config('legacy.get_directorio_publico').'principal.php');
@endphp
</body>
</html>
