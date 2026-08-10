<?php

namespace App\Services\Alertas\Factories;

use App\Models\User;
use App\Services\Alertas\DataAccessors\AlertasDataAccessor;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TareasSummaryFactory
{
    public static function makeFromUserId(int $usuarioId): AlertaSummaryDTO
    {
        // Alerta tipo 6 segun requerimiento
        $alertaTipoId = config('alertas.tareas_alerta_id');

        $user = User::find($usuarioId);
        $username = $user?->usuario;

        $dto = new AlertaSummaryDTO(0, $alertaTipoId);

        if (!$username) {
            return $dto;
        }

        $estados = config('planka.estados');
        $pendiente = $estados['pendiente'];
        $bloqueado = $estados['bloqueado'];
        $enProceso = $estados['en_proceso'];

        $results = DB::connection('planka')
            ->table('card')
            ->join('board', 'board.id', '=', 'card.board_id')
            ->join('list', 'card.list_id', '=', 'list.id')
            ->join('card_membership', 'card.id', '=', 'card_membership.card_id')
            ->join('user_account', 'card_membership.user_id', '=', 'user_account.id')
            ->where('user_account.username', $username)
            ->whereIn('list.name', [$pendiente, $bloqueado, $enProceso])
            ->select('list.name', DB::raw('count(1) as total'))
            ->groupBy('list.name')
            ->get();

        foreach ($results as $result) {
            if ($result->name === $pendiente) {
                $dto->negro = (int) $result->total;
            } elseif ($result->name === $enProceso) {
                $dto->azul = (int) $result->total;
            } elseif ($result->name === $bloqueado) {
                $dto->rojo = (int) $result->total;
            }
        }

        $dto->cantidad = $dto->azul + $dto->violeta + $dto->rojo + $dto->verde + $dto->amarillo + $dto->negro;

        return $dto;
    }
}
