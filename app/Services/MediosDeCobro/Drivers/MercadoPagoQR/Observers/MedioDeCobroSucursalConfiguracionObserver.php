<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Observers;

use App\Models\MedioDeCobroSucursalConfiguracion;

class MedioDeCobroSucursalConfiguracionObserver
{
    /**
     * Handle the model "updating" event.
     *
     * Conditions:
     * - If metadata.token changes, or
     * - If metadata.userId changes, or
     * - If habilitarconfiguracion is being set to false
     * then:
     *   - clear metadata.caja and metadata.store values
     *   - set configuration_checked to false
     */
    public function updating(MedioDeCobroSucursalConfiguracion $model): void
    {
        // Prepare original and current metadata as arrays
        $originalMetadata = $model->getOriginal('metadata') ?: [];
        if (is_string($originalMetadata)) {
            $decoded = json_decode($originalMetadata, true);
            $originalMetadata = json_last_error() === JSON_ERROR_NONE ? ($decoded ?: []) : [];
        }
        $currentMetadata = $model->metadata ?: [];

        // Extract tokens and user ids safely
        $originalToken = is_array($originalMetadata) ? ($originalMetadata['token'] ?? null) : null;
        $currentToken = is_array($currentMetadata) ? ($currentMetadata['token'] ?? null) : null;

        $originalUserId = is_array($originalMetadata) ? ($originalMetadata['userId'] ?? null) : null;
        $currentUserId = is_array($currentMetadata) ? ($currentMetadata['userId'] ?? null) : null;

        // Detect if habilitarconfiguracion is being set to false in this update
        $disablingConfig = $model->isDirty('habilitarconfiguracion') && $model->habilitarconfiguracion === false;

        // Detect changes in token/userId
        $tokenChanged = $originalToken !== $currentToken;
        $userIdChanged = $originalUserId !== $currentUserId;

        if ($tokenChanged || $userIdChanged || $disablingConfig) {
            // Ensure we operate on an array
            if (!is_array($currentMetadata)) {
                $currentMetadata = [];
            }

            // Clear caja and store values
            unset($currentMetadata['caja'], $currentMetadata['store']);

            // Apply changes to the model prior to save
            $model->metadata = $currentMetadata;
            $model->configuration_checked = false;
        }
    }
}
