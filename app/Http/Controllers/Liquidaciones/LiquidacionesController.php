<?php

namespace App\Http\Controllers\Liquidaciones;

use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class LiquidacionesController extends BaseController
{
    public function getValorizacionHistorico(Request $request)
    {
        $manager = app(\App\Services\Liquidaciones\LiquidacionesManager::class);

        return $manager->getHistoricoDeValorizaciones($request->sucursalesId ?? [] , null);
    }
}
