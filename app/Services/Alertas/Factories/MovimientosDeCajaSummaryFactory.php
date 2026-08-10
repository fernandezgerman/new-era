<?php

namespace App\Services\Alertas\Factories;

use App\Services\Alertas\DataAccessors\AlertasDataAccessor;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use Illuminate\Support\Collection;

class MovimientosDeCajaSummaryFactory
{
    public static function makeFromMovimientos(Collection $movimientos, int $usuarioId): AlertaSummaryDTO
    {
        $alertaSummary = new AlertaSummaryDTO(null, AlertasDataAccessor::ALERTA_TIPO_MOVIMIENTOS_ID);

        /** @var AlertaSummaryDTO $alertaSummary */
        $alertaSummary = $movimientos->reduce(function ($carry, $movimiento) use ($usuarioId) {
            $carry->cantidad++;
            $carry->negro += (int)$movimiento->idestado === 1 && $movimiento->idusuario === $usuarioId ? 1 : 0;
            $carry->azul += (int)$movimiento->idestado === 1 && $movimiento->idusuariodestino === $usuarioId ? 1 : 0;
            $carry->verde += (int)$movimiento->idestado === 2 && $movimiento->idusuario === $usuarioId ? 1 : 0;
            $carry->rojo += (int)$movimiento->idestado === 3 && $movimiento->idusuario === $usuarioId ? 1 : 0;
            $carry->amarillo = 0;
            $carry->violeta = 0;

            return $carry;

        }, $alertaSummary);

        return $alertaSummary;
    }
}
