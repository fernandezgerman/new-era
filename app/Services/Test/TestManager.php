<?php

namespace App\Services\Test;

use Illuminate\Support\Facades\Log;
use phpDocumentor\Parser\Exception;

class TestManager
{
    public function logMessage(string $mensaje)
    {
        //throw new Exception('Async Test exception');
        Log::info($mensaje);
    }
}
