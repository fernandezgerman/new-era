<?php

namespace App\Services\ProveedoresListas\Factories;

use App\Services\ProveedoresListas\Contracts\ImportDriverInterface;
use App\Services\ProveedoresListas\Drivers\FileDriver;
use App\Services\ProveedoresListas\DTOs\ImportDataDTO;
use App\Services\ProveedoresListas\Enum\SupportedDrivers;

class DriverFactory
{
    public static function make(ImportDataDTO $importDataDTO): ImportDriverInterface
    {
        return match ($importDataDTO->driver) {
            SupportedDrivers::File => new FileDriver($importDataDTO),
            default => throw new \InvalidArgumentException("El formato {$importDataDTO->driver->value} no es soportado por el DriverFactory."),
        };
    }
}
