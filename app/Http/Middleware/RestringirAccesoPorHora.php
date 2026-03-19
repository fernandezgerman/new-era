<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\AccesosPorHora;
use App\Http\Exceptions\OutOfWorkingHourException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class RestringirAccesoPorHora
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     *
     * @throws \App\Http\Exceptions\OutOfWorkingHourException
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            return $next($request);
        }

        $now = Carbon::now();
        $currentHour = (int) $now->format('H'); // Format HHmm as integer for comparison
        $currentDaySpanish = $this->getDayInSpanish($now->dayOfWeek);
        $todayDate = $now->format('Y-m-d');

        $records = AccesosPorHora::where(function ($query) use ($user) {
            $query->where(function ($q) use ($user) {
                $q->whereNull('targettype')
                  ->orWhere(function ($sq) use ($user) {
                      $sq->where('targettype', 'Usuario')
                         ->where('targetid', $user->id);
                  })
                  ->orWhere(function ($sq) use ($user) {
                      $sq->where('targettype', 'Perfil')
                         ->where('targetid', $user->idperfil);
                  });
            });
        })->get();

        $filteredRecords = $records->filter(function ($record) use ($currentHour, $currentDaySpanish, $todayDate) {
            // Check by hour→

            if (is_null($record->horadesde) && is_null($record->horahasta)) {
                $hourMatch = true;
            } else
            {
                $desde = (str_replace(':', '', $record->horadesde ))?? 0;
                $hasta = (str_replace(':', '', $record->horahasta)) ?? 24;

                if ($hasta < $desde) {
                    // Overnight range: e.g., 22:00 to 06:00
                    $hourMatch = ($currentHour >= $desde || $currentHour < $hasta);
                } else {
                    // Same day range: e.g., 09:00 to 18:00
                    $hourMatch = ($currentHour >= $desde && $currentHour < $hasta);
                }
            }

            if (!$hourMatch) {
                return false;
            }

            // Check by day
            $dayMatch = (is_null($record->diadelasemana) && is_null($record->fecha)) ||
                        ($record->diadelasemana === $currentDaySpanish) ||
                        ($record->fecha === $todayDate);

            return $dayMatch;
        });

        if ($filteredRecords->where('accion', 'Permitir')->isNotEmpty()) {
            return $next($request);
        }

        $restrictionRecord = $filteredRecords->where('accion', 'Restringir')->first();
        if ($restrictionRecord) {
            $message = "Restringido para el horario actual";

            $details = [];
            if ($restrictionRecord->horadesde !== null && $restrictionRecord->horahasta !== null) {
                $details[] = "Horario: {$restrictionRecord->horadesde} a {$restrictionRecord->horahasta}";
            }

            if ($restrictionRecord->diadelasemana) {
                $details[] = "Día: {$restrictionRecord->diadelasemana}";
            }

            if ($restrictionRecord->fecha) {
                $details[] = "Fecha: {$restrictionRecord->fecha}";
            }

            if (!empty($details)) {
                $message .= " (" . implode(', ', $details) . ")";
            }

            throw new OutOfWorkingHourException($message);
        }

        return $next($request);
    }

    /**
     * Get the day name in Spanish.
     *
     * @param int $dayOfWeek
     * @return string
     */
    private function getDayInSpanish(int $dayOfWeek): string
    {
        $days = [
            0 => 'Domingo',
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
        ];

        return $days[$dayOfWeek] ?? '';
    }
}
