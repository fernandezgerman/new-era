<?php

namespace App\Services\OrdenesDeCompra\DTOs;

class AddOrdenDeCompraDTO
{
    /**
     * @param int $idproveedor
     * @param int $idsucursal
     * @param string|null $observaciones
     * @param array $detalles Array of arrays with keys: idarticulo, cantidad, costoestimado
     * @param int|null $idusuario
     */
    public function __construct(
        public readonly int $idproveedor,
        public readonly int $idsucursal,
        public readonly ?string $observaciones,
        public readonly array $detalles,
        public readonly ?int $idusuario = null,
    ) {
    }

    public static function fromArray(array $data, ?int $idusuario = null): self
    {
        return new self(
            idproveedor: (int) $data['idproveedor'],
            idsucursal: (int) $data['idsucursal'],
            observaciones: $data['observaciones'] ?? null,
            detalles: $data['detalles'],
            idusuario: $idusuario
        );
    }
}
