<?php

namespace App\Services\ProveedoresListas\FileProcessors;

use App\Services\ProveedoresListas\Contracts\FileProcessorInterface;
use App\Services\ProveedoresListas\Exceptions\DependencyIsMissingException;

class FileProcessorPDF implements FileProcessorInterface
{
    use FileProcessorTrait;

    private string $fullPath;
    private string $tempTextFile;
    private $fileHandler;
    private mixed $currentRow = null;
    private int $currentKey = 0;

    public function __construct(protected string $path)
    {
        $this->fullPath = $path;
        if (!file_exists($this->fullPath)) {
            $this->fullPath = storage_path('app/' . $path);
        }

        if (!file_exists($this->fullPath)) {
            throw new \Exception("El archivo PDF no existe en la ruta proporcionada: {$path}");
        }
        $output = [];
        $returnVar = 0;
        exec("which pdftotext", $output, $returnVar);
        if ($returnVar != 0) {
            throw new DependencyIsMissingException('pdftotext is not installed');
        }

        $this->tempTextFile = tempnam(sys_get_temp_dir(), 'pdf_import_');
        exec("pdftotext -layout " . escapeshellarg($this->fullPath) . " " . escapeshellarg($this->tempTextFile));

        $this->fileHandler = fopen($this->tempTextFile, "r");

        if (!$this->fileHandler) {
            throw new \Exception("Error al abrir el archivo PDF temporal: " . $this->tempTextFile);
        }
    }

    public function __destruct()
    {
        if ($this->fileHandler) {
            fclose($this->fileHandler);
        }
        if (isset($this->tempTextFile) && file_exists($this->tempTextFile)) {
            unlink($this->tempTextFile);
        }
    }

    public function current(): mixed
    {
        return $this->currentRow;
    }

    public function next(): void
    {
        $this->currentRow = null;

        while (($line = fgets($this->fileHandler)) !== false) {
            $line = trim($line);
            if (empty($line)) continue;

            $columns = preg_split('/\s{2,}/', $line);

            $data = [];
            foreach ($columns as $index => $colValue) {
                if (($index + 1) > 11) break;
                $data[($index + 1)] = $this->truncateValue($colValue);
            }

            if (!$this->isRowEmpty($data)) {
                $this->currentRow = $data;
                $this->currentKey++;
                return;
            }
        }
    }

    public function key(): mixed
    {
        return $this->currentKey;
    }

    public function valid(): bool
    {
        return $this->currentRow !== null;
    }

    public function rewind(): void
    {
        rewind($this->fileHandler);
        $this->currentKey = 0;
        $this->next();
    }
}
