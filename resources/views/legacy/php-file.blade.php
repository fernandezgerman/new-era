@php
    // Create an instance of clsIndicePaginas for all legacy endpoints
    include_once(config('legacy.get_directorio') . 'clsIndicePaginas.php');
    include_once(config('legacy.get_directorio').'clsIni.php');
    include_once(config('legacy.get_directorio_coneccion').'clsConnection.php');

    $objIni = new clsIni();
    $objIndice = new clsIndicePaginas();

    // Access the filePath variable passed from the controller
    include_once ($filePath ?? '');
@endphp
