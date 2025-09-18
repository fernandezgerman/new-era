<?php

namespace App\Services\Alertas\Transformers;

use App\Contracts\Transformer;
use App\Services\Alertas\DTOs\AlertaDetalleDTO;
use App\Services\Alertas\DTOs\AlertaDetalleInformeDTO;
use App\Services\Alertas\DTOs\AlertaDetalleInformeParametroDTO;
use Carbon\Carbon;

class AlertaDetalleDTOToLegacyResponseTransformer implements Transformer
{
    public function transform(AlertaDetalleDTO $dto)
    {
        $fechaHora = $dto->fechaHora; // Carbon|null
        $fechaHoraVisto = $dto->fechaHoraVisto; // Carbon|null

        $informes = [];
        $informesCollection = $dto->alertaDetalleInforme ?? collect();
        $informes = $informesCollection->map(function($informe) {
            // Ensure correct typing
            /** @var AlertaDetalleInformeDTO $informe */
            $parametros = [];
            $parametrosCollection = $informe->parametros ?? collect();
            foreach ($parametrosCollection as $parametro) {
                /** @var AlertaDetalleInformeParametroDTO $parametro */
                $parametros[] = [
                    'id' => isset($parametro->id) ? (string)$parametro->id : null,
                    'idalertainforme' => isset($informe->id) ? (string)$informe->id : null,
                    'clave' => $parametro->clave,
                    'type' => $parametro->type,
                    'valor' => isset($parametro->valor) ? (string)$parametro->valor : null,
                ];
            }

            return [
                'idalerta' => isset($informe->alertaId) ? (string)$informe->alertaId : null,
                'codigopagina' => $informe->codigoPagina,
                'nombre' => $informe->nombre,
                'id' => isset($informe->id) ? (string)$informe->id : null,
                'parametros' => $parametros,
                'totalParametros' => count($parametros),
            ];
        })->toArray();


        $response = [
            'id' => isset($dto->id) ? (string)$dto->id : null,
            'nombre' => $dto->nombre,
            'idAlerta' => isset($dto->id) ? (string)$dto->id : null, // Fallback to dto id as alert identifier
            'fechahora' => $fechaHora?->format('Y-m-d H:i:s'),
            'fecha' => $fechaHora?->format('d/m/Y H:i'),
            'descripcion' => $dto->descripcion,
            'color' => $dto->color?->value,
            'idalertadestinatario' => isset($dto->alertaDestinatarioId) ? (string)$dto->alertaDestinatarioId : null,
            'fechahoravisto' => $fechaHoraVisto?->format('Y-m-d H:i:s'),
            'fechavisto' => $fechaHoraVisto?->format('d/m/Y H:i'),
            'tiempoTranscurrido' => $this->humanDiffEs($fechaHora, Carbon::now()),
            'informes' => $informes,
            'totalInformes' => count($informes),
        ];

        return $response;
    }

    private function humanDiffEs(?Carbon $from, Carbon $to): ?string
    {
        // Re-implemented from scratch based on clsNumeraciones::tiempoTranscurridoFechas
        // using Carbon parameters instead of DateTime. Returns a Spanish human-readable
        // difference limited to two largest units.
        if ($from === null) {
            return null;
        }

        // Ensure both are Carbon instances and $to >= $from for positive diff components
        $start = $from->copy();
        $end = $to->copy();
        if ($end->lt($start)) {
            [$start, $end] = [$end, $start];
        }

        $diff = $start->diff($end); // DateInterval-like with y,m,d,h,i,s
        $parts = [];

        if ($diff->y > 0) {
            $parts[] = $diff->y . ' ' . ($diff->y === 1 ? 'año' : 'años');
        }
        if ($diff->m > 0) {
            $parts[] = $diff->m . ' ' . ($diff->m === 1 ? 'mes' : 'meses');
        }
        if (count($parts) < 2 && $diff->d > 0) {
            $parts[] = $diff->d . ' ' . ($diff->d === 1 ? 'día' : 'días');
        }
        if (count($parts) < 2 && $diff->h > 0) {
            $parts[] = $diff->h . ' ' . ($diff->h === 1 ? 'hora' : 'horas');
        }
        if (count($parts) < 2 && $diff->i > 0) {
            $parts[] = $diff->i . ' ' . ($diff->i === 1 ? 'minuto' : 'minutos');
        }
        if (count($parts) === 0) {
            // If minutes are zero and nothing else added, show seconds
            $parts[] = $diff->s . ' segundos';
        }

        // Join with comma and space, but ensure at most two units
        return implode(', ', array_slice($parts, 0, 2));
    }
}


