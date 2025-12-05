<?php

namespace App\Http\Controllers\MediosDeCobro;

use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Http\Controllers\BaseController;
use App\Http\Requests\MediosDePago\GenerateOrderByDataRequest;
use App\Http\Requests\MediosDePago\GenerateOrderRequest;
use App\Http\Requests\MediosDePago\OrderPreviewRequest;
use App\Http\Requests\MediosDePago\TestConnectionRequest;
use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Models\ModoDeCobro;
use App\Models\VentaSucursalCobro;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoCajaDTOFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoExtendedFunctionalities;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\Factories\OrderDTOFactory;
use App\Services\MediosDeCobro\ModosDeCobroManager;
use Exception;
use Illuminate\Http\Request;
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

        $modosDeCobroManager->processEvent($request, MercadoPagoQRDriver::class);

        return 'ok';
    }

    public function generateOrderByData(GenerateOrderByDataRequest $orderPreviewRequest)
    {
        // For now, just echo back the validated payload as JSON
        $requestData = $orderPreviewRequest->validated();

        $modosDeCobroManager = app(ModosDeCobroManager::class);

        $orderDto = OrderDTOFactory::fromRequest($orderPreviewRequest);
        $ventaSucursalCobro = $modosDeCobroManager->generarOrden($orderDto);

        $modosDeCobroManager = app(ModosDeCobroManager::class);
        $modosDeCobroManager->generarCobro($ventaSucursalCobro);

        return [
            'link' =>  env('APP_URL_HTTP').'/medios-de-pago/order/'.$ventaSucursalCobro->idunicolegacy.'/legacy-preview',
            'ventaSucursalCobro' => $ventaSucursalCobro
        ];
    }

    public function orderLegacyPreview($idunicolegacy)
    {
        $ventaSucursalCobro = VentaSucursalCobro::where('idunicolegacy', $idunicolegacy)->first();
        if (!$ventaSucursalCobro) {
            return response('Orden no encontrada', 404);
        }

        //Tomo la configuracion ya validada
        $dataAccessor = new MedioDeCobroSucursalConfiguracionDataAccessor($ventaSucursalCobro->idsucursal, $ventaSucursalCobro->idmododecobro);
        $medioDeCobroSucursalConfiguracion = $dataAccessor->getConfiguracionValidated();

        //Creo el dto
        $mercadoPagoCajaDTOFactory = MercadoPagoCajaDTOFactory::fromArray($medioDeCobroSucursalConfiguracion->metadata['caja']);
        $qr = MercadoPagoExtendedFunctionalities::getOrCreateQrImage($mercadoPagoCajaDTOFactory);

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
        $medioDeCobroSucursalConfiguracion = '';
        try {
            $connectionData = new ConnectionDataDTO();
            $localId = config('medios_de_cobro.drivers.MercadoPagoQR.local_id');
            if (blank($localId)) {
                throw new Exception('No se encontro ningun medio de cobro para Mercado pago QR');
            }

            $medioDeCobroSucursalConfiguracion = MedioDeCobroSucursalConfiguracion::where('id', $request->get('configuracionId'))->first();

            if(blank($medioDeCobroSucursalConfiguracion))
            {
                throw new Exception('no se encontro MedioDeCobroSucursalConfiguracion');
            }

            $manager = new ModosDeCobroManager();
            $result = $manager->testConnection($medioDeCobroSucursalConfiguracion);

            $medioDeCobroSucursalConfiguracion = MedioDeCobroSucursalConfiguracion::where('id', $request->get('configuracionId'))
                ->first()
            ->toArray();

        }catch(Throwable $t){
            $errorMessage = $t->getMessage();
        }
        return [
            'connection_valid' => $result,
            'error' => $errorMessage,
            'configuracion' => $medioDeCobroSucursalConfiguracion
        ];
    }
}
