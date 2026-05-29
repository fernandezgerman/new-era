<?php

namespace App\Services\ProveedoresListas\Factories;

use App\Services\ProveedoresListas\Contracts\FileProcessorInterface;
use App\Services\ProveedoresListas\Enum\SupportedFiles;
use App\Services\ProveedoresListas\FileProcessors\FileProcessorPDF;
use App\Services\ProveedoresListas\FileProcessors\FileProcessorXLS;
use App\Services\ProveedoresListas\FileProcessors\FileProcessorXLSX;

class FileProcessorFactory
{
    public static function make(SupportedFiles $supportedFiles, string $path): FileProcessorInterface
    {
        return match ($supportedFiles) {
            SupportedFiles::PDF => new FileProcessorPDF($path),
            SupportedFiles::XLS => new FileProcessorXLS($path),
            SupportedFiles::XLSX => new FileProcessorXLSX($path),
            default => throw new \InvalidArgumentException("El formato {$supportedFiles->value} no es soportado por el FileProcessorFactory."),
        };
    }
}
