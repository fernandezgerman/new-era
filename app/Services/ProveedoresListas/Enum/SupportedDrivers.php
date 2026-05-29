<?php

namespace App\Services\ProveedoresListas\Enum;
enum SupportedDrivers: string
{
    case File = 'file';


    public static function fromString(string $value): self
    {
        return match ($value) {
            self::File->value => self::File,
            default => throw new \InvalidArgumentException("El formato $value no es soportado."),
        };
    }
    public static function toArray(): array
    {
        return [
            self::File->value,
        ];
    }
}
