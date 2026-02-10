<?php

namespace App\Services\MediosDeCobro\Factories;

use App\Http\Requests\MediosDePago\GenerateOrderByDataRequest;
use App\Http\Requests\MediosDePago\GenerateOrderRequest;
use App\Http\Requests\MediosDePago\OrderPreviewRequest;
use App\Models\Articulo;
use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Models\ModoDeCobro;
use App\Models\Sucursal;
use App\Models\User;
use App\Models\VentaSucursalCobro;
use App\Models\VentaSucursalCobroArticulo;
use App\Services\MediosDeCobro\DTOs\Collections\OrderDetalleDTOCollection;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\DTOs\OrderDetalleDTO;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroConfiguracionException;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroException;
use Exception;
use Illuminate\Support\Arr;

class ConnectionDataDTOFactory
{
    public static function fromVentaSucursalCobro(VentaSucursalCobro $venta): ConnectionDataDTO
    {
        $driverConfig = config('medios_de_cobro.drivers.'.$venta->modoDeCobro->driver);

        if (blank($driverConfig)) {
            throw new MediosDeCobroConfiguracionException('No se encontro el driver');
        }

        $configuracionPorSucursal = MedioDeCobroSucursalConfiguracion::where('idmododecobro', $driverConfig['config_id'] ?? $driverConfig['local_id'])
            ->where('idsucursal', $venta->idsucursal)
            ->first();

        if(blank($configuracionPorSucursal))
        {
            throw new MediosDeCobroConfiguracionException('No hay configuracion asociada a la sucursal y medio de cobro: '.$driverConfig['id']);
        }

        if(!($configuracionPorSucursal->habilitarconfiguracion))
        {
            throw new MediosDeCobroConfiguracionException('Sucursal no habilitada para el medio de cobro seleccionado');
        }
        $connectionData = new ConnectionDataDTO();

        $connectionData->token = $configuracionPorSucursal->metadata['token'];
        $connectionData->host = $driverConfig['host'];
        $connectionData->externalUserId = $configuracionPorSucursal->metadata['userId'];

        $connectionData->modoDeCobro = $venta->modoDeCobro;

        return $connectionData;

    }

    public static function fromMedioDeCobroSucursalConfiguracion(MedioDeCobroSucursalConfiguracion $configuracion): ConnectionDataDTO
    {
        $modoDeCobro = $configuracion->modoDeCobro;

        $driverConfig = config('medios_de_cobro.drivers.' . ($modoDeCobro->driver ?? null));

        if (blank($driverConfig)) {
            throw new MediosDeCobroConfiguracionException('No se encontro el driver');
        }

        if (!($configuracion->habilitarconfiguracion)) {
            throw new MediosDeCobroConfiguracionException('Sucursal no habilitada para el medio de cobro seleccionado');
        }

        $connectionData = new ConnectionDataDTO();
        $connectionData->token = $configuracion->metadata['token'] ?? ($configuracion->metadata['token'] ?? null);
        $connectionData->host = $driverConfig['host'];
        // Prefer array-style access but support object-style metadata as in other parts of the codebase
        $connectionData->externalUserId = $configuracion->metadata['userId'] ?? ($configuracion->metadata['userId'] ?? null);
        $connectionData->modoDeCobro = $modoDeCobro;

        return $connectionData;

    }
}
