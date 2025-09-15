@php
    // Create an instance of clsIndicePaginas for all legacy endpoints
    include_once(config('legacy.get_directorio') . 'clsIndicePaginas.php');
    include_once(config('legacy.get_directorio').'clsIni.php');
    include_once(config('legacy.get_directorio_coneccion').'clsConnection.php');
    include_once(config('legacy.get_directorio_utiles').'clsNumeraciones.php');
    $objIni = new clsIni();
    $objIndice = new clsIndicePaginas();

    // Access the filePath variable passed from the controller
    include_once ($filePath ?? '');
@endphp
