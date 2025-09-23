<?php

namespace App\Http\Exceptions\Legacy;

use Illuminate\Support\Facades\Log;

class Exception extends \Exception
{
    public function __construct($message = "", $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        Log::error($message . json_encode(request()->get('traking_data')), $this->getTrace());

    }
}
