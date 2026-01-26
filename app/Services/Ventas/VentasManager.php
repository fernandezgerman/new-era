<?php

namespace App\Services\Ventas;

use App\Models\User;
use App\Models\VentaSucursal;
use App\Models\VentaSucursalAnulacion;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\Cajas\CajaManager;
use Illuminate\Support\Carbon;
use phpDocumentor\Parser\Exception;

class VentasManager
{
    public function __construct(private ActualizacionesManager $actualizacionesManager)
    {

    }

    public function anularVentaPorIdUnico(User $usuario, string $idUnicoVenta): void
    {
        $ventaSucursalAnulacion = new VentaSucursalAnulacion();

        $venta = VentaSucursal::where('idventa', $idUnicoVenta)->first();

        if(blank($venta))
        {
            throw new Exception('No se encontro la venta para anular con el idunico: ' . $idUnicoVenta);
        }

        $ventaSucursalAnulacion->idunicoventaanulada = $venta->idventa;
        $ventaSucursalAnulacion->idusuarioanulo = $venta->idusuario;
        $ventaSucursalAnulacion->idusuariocaja = $venta->idusuario;
        $ventaSucursalAnulacion->idsucursalcaja = $venta->idsucursal;
        $ventaSucursalAnulacion->idarticulo = $venta->idarticulo;
        $ventaSucursalAnulacion->idlista = $venta->idlista;
        $ventaSucursalAnulacion->cantidad = $venta->cantidad * -1;
        $ventaSucursalAnulacion->preciounitario = $venta->preciounitario;
        $ventaSucursalAnulacion->costo = $venta->costo;
        $ventaSucursalAnulacion->fechahora = Carbon::now()->format('Y-m-d H:i:s');
        $ventaSucursalAnulacion->costosucursal = $venta->costosucursal;

        $ventaSucursalAnulacion->save();

        $this->actualizacionesManager->insertarActualizacion($ventaSucursalAnulacion, $ventaSucursalAnulacion->sucursal);

    }
}
