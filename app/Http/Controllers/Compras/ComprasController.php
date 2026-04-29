<?php

namespace App\Http\Controllers\Compras;

use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Http\Controllers\BaseController;
use App\Http\Requests\MediosDePago\GenerateOrderByDataRequest;
use App\Http\Requests\MediosDePago\GenerateOrderRequest;
use App\Http\Requests\MediosDePago\OrderPreviewRequest;
use App\Http\Requests\MediosDePago\ReembolsarOrderByDataRequest;
use App\Http\Requests\MediosDePago\TestConnectionRequest;
use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Models\ModoDeCobro;
use App\Models\VentaSucursalCobro;
use App\Services\AsyncProcess\AsyncProcessManager;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoCajaDTOFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
use App\Services\MediosDeCobro\Factories\OrderDTOFactory;
use App\Services\MediosDeCobro\ModosDeCobroManager;
use Exception;
use Illuminate\Http\Request;
use Throwable;


class ComprasController extends BaseController
{
    public function procesarCompra(int $compraId)
    {
        $asyncProcesamientoDeCompra = new  \App\Services\AsyncProcess\DTOs\AsyncProcessProcesarCompraDTO(
            compraId: $compraId
        );

        AsyncProcessManager::handle($asyncProcesamientoDeCompra);

        return ['response' =>'ok'];
    }
}
