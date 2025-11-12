<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models\MercadoPagoQROrderSql;

class MercadoPagoQROrderSqlFactory
{
    /**
     * Crea un modelo MercadoPagoQROrderSql (no persistido) a partir de un OrderDTO.
     *
     * Campos del modelo/tabla:
     * - ventasucursalcobroid: id local de la venta/cobro (usamos OrderDTO->localId)
     * - extarnalorderid: id de la orden en el gateway (notar el typo del nombre de columna en la migración)
     * - estado: estado reportado por el gateway o 'pending' por defecto
     * - externalorderdata: payload completo de la respuesta del gateway para auditoría
     */
    public static function fromOrderDTO(OrderDTO $orderDTO): MercadoPagoQROrderSql
    {
        $model = new MercadoPagoQROrderSql();

        $gateway = $orderDTO->gatewayResponse;
        $externalOrderId = $gateway?->id ?? ($gateway?->external_reference ?? null);
        $estado = $gateway?->status ?? 'pending';

        // Convert DTO object tree to plain array for JSON column
        $externalOrderData = $gateway ? json_decode(json_encode($gateway), true) : null;

        $model->fill([
            'ventasucursalcobroid' => $orderDTO->localId,
            'externalorderid'      => $externalOrderId,
            'estado'               => $estado,
            'externalorderdata'    => $externalOrderData,
        ]);

        return $model;
    }
}
