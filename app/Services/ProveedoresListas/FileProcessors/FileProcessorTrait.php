<?php

namespace App\Services\ProveedoresListas\FileProcessors;

trait FileProcessorTrait
{
    /**
     * Truncate value to max 250 characters.
     */
    protected function truncateValue(mixed $value): ?string
    {
        if ($value === null) return null;
        $strValue = trim((string)$value);
        if ($strValue === '') return null;
        return mb_substr($strValue, 0, 250);
    }

    /**
     * Check if the row data is empty.
     */
    protected function isRowEmpty(array $data): bool
    {
        foreach ($data as $value) {
            if ($value !== null && trim($value) !== '') {
                return false;
            }
        }
        return true;
    }
}
