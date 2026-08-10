<?php

namespace App\Services\TareasManager\Factories;

use App\Models\User;
use App\Services\TareasManager\DTOs\TareaDTO;
use Carbon\Carbon;
use stdClass;

class TareaDTOFactory
{
    public static function fromRaw(stdClass $raw): TareaDTO
    {
        $usuarioCreador = User::where('usuario', $raw->creador)->first();

        return new TareaDTO(
            estado: $raw->estado,
            name: $raw->name,
            description: $raw->description,
            updated_at: Carbon::parse($raw->created_at),
            creador: $raw->creador,
            usuarioCreador: $usuarioCreador,
            id: $raw->id,
        );
    }
}
