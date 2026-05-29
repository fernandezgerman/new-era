<?php

namespace App\Services\ProveedoresListas\Enum;
enum SupportedFiles: string
{
    case PDF = 'pdf';
    case XLS = 'xls';
    case XLSX = 'xlsx';

    public static function fromString(string $value): self
    {
        return match ($value) {
            self::PDF->value => self::PDF,
            self::XLS->value => self::XLS,
            self::XLSX->value => self::XLSX,
            default => throw new \InvalidArgumentException("El formato $value no es soportado."),
        };
    }
    public static function toArray(): array
    {
        return [
            self::PDF->value,
            self::XLS->value,
            self::XLSX->value,
        ];
    }
}
