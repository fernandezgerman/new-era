<?php

namespace App\Services\Auditoria\Traits;

use App\Services\Auditoria\AuditoriaManager;
use App\Services\Auditoria\DTO\AuditoriaDTO;

trait Audicionable
{
    protected function auditar(string $evento,
                               string $auditableType,
                               ?int $auditableId,
                               array $oldValues = [],
                               ?array $newValues = []
    ): void
    {
        $auditoriaDTO = new auditoriaDTO(
            user_type:   'App\Models\User',
            user_id: auth()->id(),
            event: $evento,
            auditable_type: $auditableType,
            auditable_id: $auditableId,
            old_values: $oldValues,
            new_values: $newValues,
            url:request()->fullUrl(),
            ip_address: request()->ip(),
            user_agent: request()->userAgent(),
            tags: null,
            created_at: now(),
            updated_at: now()
        );

        app(AuditoriaManager::class)->audicionManual($auditoriaDTO);
    }
}
