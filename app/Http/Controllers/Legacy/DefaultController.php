<?php

namespace App\Http\Controllers\Legacy;

use App\Http\Controllers\BaseController;

class DefaultController extends BaseController
{
    public function defaultView()
    {

        return view('legacy.default');
    }
}
