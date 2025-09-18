<?php

namespace App\Http\Controllers\Legacy;

use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Log;

class DefaultController extends BaseController
{
    public function defaultView()
    {

        if(request()->get('withFrame') == 1)
        {
            return view('dashboard.default');
        }
        return view('legacy.default');
    }

    public function iframeView()
    {
        return view('legacy.default');
    }

    public function template()
    {
        return view('template.index');
    }
}
