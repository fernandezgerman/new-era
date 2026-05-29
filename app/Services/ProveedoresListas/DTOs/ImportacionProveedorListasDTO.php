<?php

namespace App\Services\ProveedoresListas\DTOs;

class ImportacionProveedorListasDTO
{
    public function __construct(
        public int $idproveedor,
        public ?int $idarticulo = null,
        public ?string $campo1 = null,
        public ?string $campo2 = null,
        public ?string $campo3 = null,
        public ?string $campo4 = null,
        public ?string $campo5 = null,
        public ?string $campo6 = null,
        public ?string $campo7 = null,
        public ?string $campo8 = null,
        public ?string $campo9 = null,
        public ?string $campo10 = null,
        public ?string $campo11 = null,
        public ?array $descripcionproceso = null,
    ) {
    }

    public function toArray(): array
    {
        return [
            'idproveedor' => $this->idproveedor,
            'idarticulo' => $this->idarticulo,
            'campo1' => $this->campo1,
            'campo2' => $this->campo2,
            'campo3' => $this->campo3,
            'campo4' => $this->campo4,
            'campo5' => $this->campo5,
            'campo6' => $this->campo6,
            'campo7' => $this->campo7,
            'campo8' => $this->campo8,
            'campo9' => $this->campo9,
            'campo10' => $this->campo10,
            'campo11' => $this->campo11,
            'descripcionproceso' => $this->descripcionproceso ? json_encode($this->descripcionproceso) : null,
        ];
    }

    public function setCamposFromArray(array $data): void
    {
        for ($i = 1; $i <= 11; $i++) {
            $key = $i;
            if (isset($data[$key])) {
                $propertyName = "campo$i";
                $this->$propertyName = (string) $data[$key];
            }
        }
    }
}
