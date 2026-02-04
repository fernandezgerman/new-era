<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Factories;

use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Models\MercadoPagoPointOrderSql;

class MercadoPagoPointOrderSqlFactory
{
    /**
     * Crea un modelo MercadoPagoPointOrderSql (no persistido) a partir de un OrderDTO.
     *
     * Campos del modelo/tabla:
     * - ventasucursalcobroid: id local (OrderDTO->localId)
     * - externalorderid: id de la orden en el gateway
     * - estado: estado de la orden en el gateway (por defecto 'pending')
     * - externalorderdata: respuesta completa del gateway
     */
    public static function fromOrderDTO(OrderDTO $orderDTO): MercadoPagoPointOrderSql
    {
        $model = new MercadoPagoPointOrderSql();

        $gateway = $orderDTO->gatewayResponse;
        $externalOrderId = $gateway?->id ?? ($gateway?->external_reference ?? null);
        $estado = $gateway?->status ?? 'pending';

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
