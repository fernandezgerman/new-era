<?php

namespace App\Services\Alertas;

use App\Models\Alerta;
use App\Models\User;

class AlertasManager
{
    public function MarcarAlertasComoLeidas(User $user, array $alertaTipoId = null, int $alertaId = null, $marcarComoLeida = true): void
    {

        if ($alertaTipoId === null && $alertaId === null) {
            throw new \Exception('Debe especificar al menos un tipo de alerta o un id de alerta para amrcarlas como leidas');
        }

        $query = Alerta::query()
            ->join('alertasdestinatarios', 'alertasdestinatarios.idalerta', '=', 'alertas.id')
            ->where('idusuario', $user->id);

        if ($alertaTipoId) {
            $query->where('idalertatipo', $alertaTipoId);
        }

        if ($alertaId) {
            $query->where('alertas.id', $alertaId);
        }

        $query->update(['fechahoravisto' => $marcarComoLeida ? now() : null]);
    }
}
