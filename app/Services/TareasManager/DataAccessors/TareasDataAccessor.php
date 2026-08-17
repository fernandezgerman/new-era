<?php

namespace App\Services\TareasManager\DataAccessors;

use App\Models\User;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class TareasDataAccessor
{

    protected function getQueryBuilderForCard(): Builder
    {
        return DB::connection('planka')
            ->table('card')
            ->join('board', 'board.id', '=', 'card.board_id')
            ->join('list', 'card.list_id', '=', 'list.id')
            ->join('card_membership', 'card.id', '=', 'card_membership.card_id')
            ->join('user_account', 'card_membership.user_id', '=', 'user_account.id')
            ->join(DB::raw('user_account as creator'), 'card.creator_user_id', '=', 'creator.id');
    }

    public function getTareas(int $usuarioId): Collection
    {
        $user = User::find($usuarioId);
        $username = $user?->usuario;

        $estados = config('planka.estados');

        $pendiente = $estados['pendiente'];
        $bloqueado = $estados['bloqueado'];
        $enProceso = $estados['en_proceso'];

        $results = $this->getQueryBuilderForCard()
            ->where('user_account.username', $username)
            ->whereIn('list.name', [$pendiente, $bloqueado, $enProceso])
            ->select(DB::raw('list.name as estado'), 'card.id', 'card.name', 'card.description', db::raw("(card.created_at - INTERVAL '3 hours') as created_at"), DB::raw('creator.username as creador'))
            ->get();

        return $results->map(fn($raw) => \App\Services\TareasManager\Factories\TareaDTOFactory::fromRaw($raw));
    }

    public function getTareasPorCreador(int $usuarioId): Collection
    {

        $user = User::find($usuarioId);
        $username = $user?->usuario;

        $estados = config('planka.estados');

        $pendiente = $estados['pendiente'];
        $bloqueado = $estados['bloqueado'];
        $enProceso = $estados['en_proceso'];
        $terminado = $estados['terminado'];

        $results = $this->getQueryBuilderForCard()
            // Filtro por usuario que creo la tarea
            ->where('creator.username', $username)
            ->where(function ($query) use ($pendiente, $bloqueado, $enProceso, $terminado) {
                $query->whereIn('list.name', [$pendiente, $bloqueado, $enProceso]);
                $query->orWhere(function ($query) use ($terminado) {
                    $query->where('list.name', $terminado);
                    $query->where(db::raw("date(list_changed_at)"), Carbon::now()->format('Y-m-d'));
                });
            })
            ->select(DB::raw('list.name as estado'), 'card.id', 'card.name', 'card.description', 'card.created_at', DB::raw('creator.username as creador'))
            ->get();

        return $results->map(fn($raw) => \App\Services\TareasManager\Factories\TareaDTOFactory::fromRaw($raw)->toArray());
    }
}
