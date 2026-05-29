<?php

namespace App\Services\ProveedoresListas\Drivers;

use App\Models\ImportacionProveedorLista;
use App\Services\ProveedoresListas\Collecitons\ImportacionProveedorDTOCollection;
use App\Services\ProveedoresListas\Contracts\FileProcessorInterface;
use App\Services\ProveedoresListas\Contracts\ImportDriverInterface;
use App\Services\ProveedoresListas\DTOs\ImportacionProveedorListasDTO;
use App\Services\ProveedoresListas\DTOs\ImportDataDTO;
use App\Services\ProveedoresListas\Enum\SupportedFiles;
use App\Services\ProveedoresListas\Factories\FileProcessorFactory;

class FileDriver implements ImportDriverInterface
{

    protected FileProcessorInterface $fileProcessor;
    public function __construct(protected ImportDataDTO $importDataDTO){

        $extension = strtolower(pathinfo($importDataDTO->path, PATHINFO_EXTENSION));

        if (empty($extension) && file_exists($importDataDTO->path)) {
            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->file($importDataDTO->path);

            $extension = match ($mimeType) {
                'application/vnd.ms-excel', 'application/x-ole-storage' => 'xls',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
                'application/pdf' => 'pdf',
                default => '',
            };
        }

        $supportedFile = SupportedFiles::fromString($extension);
        $this->fileProcessor = FileProcessorFactory::make($supportedFile, $importDataDTO->path);
    }
    public function getRows(): ImportacionProveedorDTOCollection
    {

        $importacionProveedorDTOCollection = new ImportacionProveedorDTOCollection();
        foreach ($this->fileProcessor as $row) {
            $importacionProveedorDTO = new ImportacionProveedorListasDTO($this->importDataDTO->proveedor->id);            // Processing logic will go here
            $importacionProveedorDTO->setCamposFromArray($row);

            $importacionProveedorDTOCollection->add($importacionProveedorDTO);
        }
        return $importacionProveedorDTOCollection;
    }
}
