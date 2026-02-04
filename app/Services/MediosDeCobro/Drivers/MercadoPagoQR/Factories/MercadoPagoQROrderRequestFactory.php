<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroConfiguracionException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class MercadoPagoQROrderRequestFactory
{
    public static function make(OrderDTO $orderDTO): array
    {
        $data = MercadoPagoOrderRequestFactory::makeOrderBase($orderDTO);

        //Obtiene el external identifier de la caja
        $driverConfig = config('medios_de_cobro.drivers.' . $orderDTO->modoDeCobro->driver);
        $medioDeCobroSucursalConfiguracionDataAccessor = new MedioDeCobroSucursalConfiguracionDataAccessor($orderDTO->sucursal->id, $driverConfig['config_id']);
        $medioDeCobroSucursalConfiguracion = $medioDeCobroSucursalConfiguracionDataAccessor->getConfiguracionValidated();
        $externalPosId = Arr::get($medioDeCobroSucursalConfiguracion->metadata, 'caja.external_id');

        if (!$externalPosId) {
            throw new MediosDeCobroConfiguracionException('No se encontro la caja para enviar la orden');
        }

        $description = 'Order QR - Sucursal ' . $orderDTO->sucursal->id;

        return [
            ...$data,
            [
                'description' => $description,
                'qr' => [
                    'external_pos_id' => $externalPosId,
                    'mode' => 'static',
                ],
            ]
        ];
    }
}
