<?php

namespace App\Http\Controllers\MediosDeCobro;

use App\Http\Controllers\BaseController;
use App\Http\Exceptions\Api\Exceptions\ApiValidationException;
use App\Http\Requests\MediosDePago\GenerateOrderByDataRequest;
use App\Http\Requests\MediosDePago\GenerateOrderRequest;
use App\Http\Requests\MediosDePago\OrderPreviewRequest;
use App\Http\Requests\MediosDePago\TestConnectionRequest;
use App\Models\ModoDeCobro;
use App\Models\VentaSucursalCobro;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\Factories\OrderDTOFactory;
use App\Services\MediosDeCobro\ModosDeCobroManager;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;


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

    public function processEvent(Request $request)
    {
        $modosDeCobroManager = app(ModosDeCobroManager::class);

        $modosDeCobroManager->processEvent($request, app(MercadoPagoQRDriver::class));

        return 'ok';
    }

    public function generateOrderByData(GenerateOrderByDataRequest $orderPreviewRequest)
    {
        // For now, just echo back the validated payload as JSON
        $requestData = $orderPreviewRequest->validated();

        $modosDeCobroManager = app(ModosDeCobroManager::class);

        $ventaSucursalCobro = $modosDeCobroManager->generarOrden(
            OrderDTOFactory::fromRequest($orderPreviewRequest)
        );


        $modosDeCobroManager = app(ModosDeCobroManager::class);
        $modosDeCobroManager->generarCobro($ventaSucursalCobro);

        return [
            'link' => url('medios-de-pago/order/'.$ventaSucursalCobro->idunicolegacy.'/legacy-preview'),
            'ventaSucursalCobro' => $ventaSucursalCobro
        ];
    }

    public function orderLegacyPreview($idunicolegacy)
    {
        $ventaSucursalCobro = VentaSucursalCobro::where('idunicolegacy', $idunicolegacy)->first();
        if (!$ventaSucursalCobro) {
            return response('Orden no encontrada', 404);
        }
        //ToDo: cargar el QR correcto
        $qr = "https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png";
        return view('mediosDePago.MercadoPago.legacy-preview', compact('ventaSucursalCobro','qr'));
    }

    public function getOrder($idventasucursalcobro)
    {
        return VentaSucursalCobro::where('id', $idventasucursalcobro)->first();
    }

    public function testQRConnection(TestConnectionRequest $request): array
    {
        $result = false;
        $errorMessage = '';
        try {
            $connectionData = new ConnectionDataDTO();
            $localId = config('medios_de_cobro.drivers.MercadoPagoQR.local_id');
            if (blank($localId)) {
                throw new Exception('No se encontro ningun medio de cobro para Mercado pago QR');
            }
            $connectionData->modoDeCobro = ModoDeCobro::where('id', $localId)->first();
            $connectionData->token = $request->get('token');

            $manager = new ModosDeCobroManager();
            $result = $manager->testConnection($connectionData);
        }catch(Throwable $t){
            $errorMessage = $t->getMessage();
        }
        return [
            'connection_valid' => $result,
            'error' => $errorMessage
        ];
    }
}
