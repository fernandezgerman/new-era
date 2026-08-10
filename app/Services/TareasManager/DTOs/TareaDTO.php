<?php

namespace App\Services\TareasManager\DTOs;

use App\Models\User;
use Carbon\Carbon;

class TareaDTO
{
    public function __construct(
        public string $estado,
        public string $name,
        public ?string $description,
        public Carbon $updated_at,
        public string $creador,
        public ?User $usuarioCreador = null,
        public int $id,
    ) {
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'estado' => $this->estado,
            'name' => $this->name,
            'description' => $this->description,
            'updated_at' => $this->updated_at->toDateTimeString(),
            'creador' => $this->creador,
            'usuario_creador' => $this->usuarioCreador?->toArray(),
        ];
    }
}
