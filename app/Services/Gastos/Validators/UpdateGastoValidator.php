<?php

namespace App\Services\Gastos\Validators;

use App\DTOs\EditarGastoDTO;
use App\Models\Caja;
use App\Models\GastoDetalle;
use App\Models\LiquidacionPeriodo;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class UpdateGastoValidator
{
    public function validar(
        EditarGastoDTO $editarGastoDTO
    ): void
    {
        $gastoDetalle = GastoDetalle::where('id', $editarGastoDTO->idCompraDetalle)
            ->where('idcabecera', $editarGastoDTO->idCompra)
            ->first();

        if (!$gastoDetalle) {
            return;
        }

        // Si el importe no cambia, no aplicamos estas validaciones
        if ((float)$gastoDetalle->precio === (float)$editarGastoDTO->importe) {
            return;
        }

        // 1 - idestado from cajas is = 1 for the gasto and the user changes the importe
        $gasto = $gastoDetalle->compra;
        if ($gasto && $gasto->numerocaja !== null) {
            $caja = Caja::where('idsucursal', $gasto->idsucursalcaja)
                ->where('idusuario', $gasto->idusuariocaja)
                ->where('numero', $gasto->numerocaja)
                ->first();

            if ($caja && (int)$caja->idestado === 1) {
                throw ValidationException::withMessages([
                    'importe' => ['No se puede modificar el importe de un gasto cuya caja ya está cerrada.']
                ]);
            }
        }

        // 2 - The idestado from LiquidacionPeriodo is 1 and the user changes the importe
        $periodosCerrados = LiquidacionPeriodo::whereHas('gastos', function ($query) use ($editarGastoDTO) {
            $query->where('compras.id', $editarGastoDTO->idCompra);
        })
        ->where('idestado', 1)
        ->exists();

        if ($periodosCerrados) {
            throw ValidationException::withMessages([
                'importe' => ['No se puede modificar el importe de un gasto que pertenece a un periodo de liquidación cerrado.']
            ]);
        }
    }
}
