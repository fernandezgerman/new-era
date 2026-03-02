<?php

namespace App\Http\Controllers\Cajas;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Caja\GetUltimaCajaRequest;
use App\Services\Cajas\CajaManager;

class CajaController extends BaseController
{
    public function ultimaCaja(GetUltimaCajaRequest $getUltimaCajaRequest)
    {
        // For now, just echo back the validated payload as JSON
        $getUltimaCajaRequest->validated();

        $caja = app(CajaManager::class)->getCajaAbierta(
            $getUltimaCajaRequest->idusuario,
            $getUltimaCajaRequest->idsucursal,
            false
        );

        if(!$caja){
            return [];
        }

        $caja->load([
            'compras' => function ($q) use ($caja) {
                $q->where('compras.idusuario', $caja->idusuario)
                    ->where('compras.idsucursal', $caja->idsucursal)
                    ->with('proveedor');
            },
            'pagos' => function ($q) use ($caja) {
                $q->where('pagos.idusuario', $caja->idusuario)
                    ->where('pagos.idsucursal', $caja->idsucursal)
                    ->with('proveedor');
            },
            'ventas' => function ($q) use ($caja) {
                $q->where('ventassucursal.idusuario', $caja->idusuario)
                    ->where('ventassucursal.idsucursal', $caja->idsucursal);
            },
            'movimientosCaja' => function ($q) use ($caja) {
                $q->where('movimientoscaja.idusuario', $caja->idusuario)
                    ->where('movimientoscaja.idsucursal', $caja->idsucursal)
                ->where('movimientoscaja.idestado', 2)
                    ->with('usuarioDestino')
                    ->with('usuario')
                    ->with('motivo')
                    ->with('estados')
                    ->with('sucursalDestino');
            },
            'movimientosCajaDestinatario' => function ($q) use ($caja) {
                $q->where('movimientoscaja.idusuariodestino', $caja->idusuario)
                    ->where('movimientoscaja.idsucursaldestino', $caja->idsucursal)
                    ->where('movimientoscaja.idestado', 2)
                    ->with('motivo')
                    ->with('usuario')
                    ->with('usuarioDestino')
                    ->with('estados')
                    ->with('sucursal');
            },
            'sucursal',
            'usuario',
        ]);

        return $caja;
    }

}
