<?php

namespace App\Services\ProveedoresListas\FileProcessors;

use App\Services\ProveedoresListas\Contracts\FileProcessorInterface;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\RowIterator;

class FileProcessorXLS implements FileProcessorInterface
{
    use FileProcessorTrait;

    protected string $fullPath;
    protected $spreadsheet;
    protected $worksheet;
    protected RowIterator $rowIterator;
    protected mixed $currentRow = null;
    protected int $currentKey = 0;

    public function __construct(protected string $path)
    {
        if (file_exists($this->path)) {
            $this->fullPath = $this->path;
        } elseif (file_exists(storage_path($this->path))) {
            $this->fullPath = storage_path($this->path);
        } else {
            $this->fullPath = storage_path('app/' . $this->path);
        }

        $reader = IOFactory::createReaderForFile($this->fullPath);
        $reader->setReadDataOnly(true);
        $this->spreadsheet = $reader->load($this->fullPath);
        $this->worksheet = $this->spreadsheet->getActiveSheet();
        $this->rowIterator = $this->worksheet->getRowIterator();
    }

    public function current(): mixed
    {
        return $this->currentRow;
    }

    public function next(): void
    {
        $this->currentRow = null;

        while ($this->rowIterator->valid()) {
            $row = $this->rowIterator->current();
            $this->rowIterator->next();

            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);

            $data = [];
            $columnIndex = 1;
            foreach ($cellIterator as $cell) {
                if ($columnIndex > 11) break;

                $value = $cell->getValue();

                if (is_string($value) && str_starts_with($value, '=')) {
                    try {
                        $value = $cell->getCalculatedValue();
                    } catch (\Exception $e) {
                        // fallback to raw value if calculation fails
                    }
                }

                $data[($columnIndex)] = $this->truncateValue($value);
                $columnIndex++;
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
        $this->rowIterator->rewind();
        $this->currentKey = 0;
        $this->next();
    }
}
