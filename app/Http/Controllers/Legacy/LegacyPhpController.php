<?php

namespace App\Http\Controllers\Legacy;

use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class LegacyPhpController extends BaseController
{
    public function handlePhpFile(Request $request)
    {
        // Get the requested PHP file name from the URL
        $path = $request->path();
        $filename = basename($path);

        // Check if the file exists in mtihweb/paginas
        $filePath = config('legacy.get_directorio') . 'paginas/' . $filename;

        if (file_exists($filePath)) {
            // Return a view that includes the PHP file
            return view('legacy.php-file', ['filePath' => $filePath]);
        } else {
            // Return a 404 error if the file doesn't exist
            abort(404, 'The requested PHP file does not exist: ' . $filename);
        }
    }

    public function handleWSDL(Request $request)
    {
        // Get the requested PHP file name from the URL
        $path = $request->path();
        $filename = basename($path);

        // Check if the file exists in mtihweb/paginas
        $filePath = config('legacy.get_directorio') . 'paginas/webservices/' . $filename;

        if (file_exists($filePath)) {
            // Return a view that includes the PHP file
            return view('legacy.php-file', ['filePath' => $filePath]);
        } else {
            // Return a 404 error if the file doesn't exist
            abort(404, 'The requested PHP file does not exist: ' . $filename);
        }
    }
}
