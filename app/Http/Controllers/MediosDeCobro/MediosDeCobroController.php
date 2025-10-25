<?php

namespace App\Http\Controllers\MediosDeCobro;

use App\Http\Controllers\BaseController;
use App\Http\Requests\MediosDePago\GenerateOrderRequest;
use App\Http\Requests\MediosDePago\OrderPreviewRequest;
use App\Models\ModoDeCobro;
use App\Models\VentaSucursalCobro;
use App\Services\MediosDeCobro\Factories\OrderDTOFactory;
use App\Services\MediosDeCobro\ModosDeCobroManager;

class MediosDeCobroController extends BaseController
{
    public function orderPreview(OrderPreviewRequest $orderPreviewRequest)
    {
        // For now, just echo back the validated payload as JSON
        $requestData = $orderPreviewRequest->validated();

        //dd($requestData);
        $modosDeCobro = ModoDeCobro::where('activo', true)->get();

        $modosDeCobroManager = app(ModosDeCobroManager::class);
        $ventaSucursalCobro = $modosDeCobroManager->generarOrden(
            OrderDTOFactory::fromRequest($orderPreviewRequest)
        );

        $data = [
            'data' => $requestData,
            'modosDeCobro' => $modosDeCobro,
            'ventaSucursalCobro' => $ventaSucursalCobro
        ];

        return view('mediosDePago.MercadoPago.order-preview',compact('data'));
    }

    public function orderGenerate(GenerateOrderRequest $orderPreviewRequest)
    {

        $ventaSucursalCobro = VentaSucursalCobro::where('id', $orderPreviewRequest->get('idventassucursalcobro'))->first();

        $ventaSucursalCobro->idmododecobro = $orderPreviewRequest->get('idmododecobro');
        $ventaSucursalCobro->save();

        $modosDeCobroManager = app(ModosDeCobroManager::class);
        $modosDeCobroManager->generarCobro($ventaSucursalCobro);

        return view('mediosDePago.MercadoPago.order-waiting-payment',compact('ventaSucursalCobro'));
    }
}
