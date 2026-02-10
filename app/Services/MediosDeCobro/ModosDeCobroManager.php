<?php

namespace App\Services\MediosDeCobro;

use App\Events\Events\MediosDeCobro\MediosDeCobroStatusChangeEvent;
use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Models\ModoDeCobro;
use App\Models\Sucursal;
use App\Models\VentaSucursalCobro;
use App\Models\VentaSucursalCobroArticulo;
use App\Services\MediosDeCobro\Contracts\MedioDeCobroDriverInterface;
use App\Services\MediosDeCobro\Contracts\MedioDeCobroEventHandlerInterface;
use App\Services\MediosDeCobro\Contracts\MedioDeCobroQRDriverInterface;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRDynamoPersitanceException;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRIdempotencyKeyAlreadyTakenException;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRNotFoundException;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\DTOs\OrderDetalleDTO;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\DTOs\OrderPaymentDetailDTO;
use App\Services\MediosDeCobro\DTOs\WebhookEventDTO;
use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
use App\Services\MediosDeCobro\Enums\MedioDeCobroTipos;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroConnectionTestException;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroException;
use App\Services\MediosDeCobro\Factories\ConnectionDataDTOFactory;
use App\Services\MediosDeCobro\Factories\OrderDTOFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ModosDeCobroManager
{
    public function __construct()
    {

    }

    public function reembolsarOrden(VentaSucursalCobro $ventaSucursalCobro): VentaSucursalCobro
    {

        if($ventaSucursalCobro->created_at->isBefore(Carbon::now()->subMinutes(10)))
        {
            //throw new MediosDeCobroException('No se puede reembolsar una orden cuando pasaron más de 10 minutos');
        }

        db::transaction(function () use (&$ventaSucursalCobro) {
            $ventaSucursalCobro->estado = MedioDeCobroEstados::PROCESANDO_REEMBOLSO;
            $this->getDriverOrFail(
                ConnectionDataDTOFactory::fromVentaSucursalCobro($ventaSucursalCobro)
            )->refundOrder($ventaSucursalCobro->id);

            $ventaSucursalCobro->save();
        });

        return $ventaSucursalCobro;
    }

    public function generarOrden(OrderDTO $order): VentaSucursalCobro
    {

        $ventaSucursalCobro = new VentaSucursalCobro();

        db::transaction(function () use ($order, &$ventaSucursalCobro) {
            $ventaSucursalCobro->idusuario = $order->usuario->id;
            $ventaSucursalCobro->idsucursal = $order->sucursal->id;
            $ventaSucursalCobro->idmododecobro = $order->modoDeCobro?->id;
            $ventaSucursalCobro->idunicolegacy = $order->idunicolegacy;
            $ventaSucursalCobro->idmododecobro = $order->modoDeCobro?->id;
            $ventaSucursalCobro->tipo = MedioDeCobroTipos::NO_DETERMINADO->value;
            $ventaSucursalCobro->estado = MedioDeCobroEstados::NUEVA->value;

            $totalOrden = 0;
            foreach ($order->detalles as $detalle) {
                $totalOrden = $totalOrden + ($detalle->precio_unitario * $detalle->cantidad);
            }
            $ventaSucursalCobro->importe = $totalOrden;
            $ventaSucursalCobro->save();

            /** @var OrderDetalleDTO $detalle */
            foreach ($order->detalles as $detalle) {
                $ventaSucursalCobroDetalle = new VentaSucursalCobroArticulo();
                $ventaSucursalCobroDetalle->idventasucursalcobro = $ventaSucursalCobro->id;
                $ventaSucursalCobroDetalle->idarticulo = $detalle->articulo->id;
                $ventaSucursalCobroDetalle->cantidad = $detalle->cantidad;
                $ventaSucursalCobroDetalle->importe = $detalle->precio_unitario * $detalle->cantidad;
                $ventaSucursalCobroDetalle->idunicoventa = $detalle->id_unico_venta;
                $ventaSucursalCobroDetalle->save();
            }

        });

        return $ventaSucursalCobro;
    }

    private function getDriverOrFail(ConnectionDataDTO $subject): MedioDeCobroDriverInterface
    {
        $mc = $subject->modoDeCobro;

        $driverClass = config('medios_de_cobro.drivers.'.$mc->driver.'.class');

        if(!$driverClass)
        {
            throw new MediosDeCobroException('No se encontro la clase para le medio de pago: '.'modos_de_cobro.driver.'.$mc?->driver.'.class');
        }

        /** @var MedioDeCobroDriverInterface $driver */
        return app($driverClass, ['connectionDataDTO' => $subject]);

    }

    public function generarCobro(VentaSucursalCobro $ventaSucursalCobro): void
    {
        $orderDTO = OrderDTOFactory::fromVentaSucursalCobro($ventaSucursalCobro);
        try{
            $driver = $this->getDriverOrFail(
                ConnectionDataDTOFactory::fromVentaSucursalCobro($ventaSucursalCobro)
            );

            $driver->createOrder($orderDTO);

        }catch (MercadoPagoQRDynamoPersitanceException $e)
        {
            Log::error($e->getMessage(), $e->getTrace());
        }
        catch (MercadoPagoQRIdempotencyKeyAlreadyTakenException $e)
        {
            Log::warning('Modos de cobro error: '.$e->getMessage());
            return;
        }

        $ventaSucursalCobro->estado = MedioDeCobroEstados::PENDIENTE->value;
        $ventaSucursalCobro->save();
    }

    public function getQRImageURL(VentaSucursalCobro $ventaSucursalCobro): ?string
    {
        $driver = $this->getDriverOrFail(
            ConnectionDataDTOFactory::fromVentaSucursalCobro($ventaSucursalCobro)
        );

        if($driver instanceof MedioDeCobroQRDriverInterface)
        {
            return $driver->getQRImageURL(OrderDTOFactory::fromModel($ventaSucursalCobro));
        }
        return null;
    }

    public function processEvent(Request $request, $driverClass): void
    {
        $webhookEvent = new WebhookEventDTO($request->all());
        $newStatus = null;
        try{
            $newStatus = $driverClass::processEvent($webhookEvent);
        }catch(MercadoPagoQRNotFoundException|MediosDeCobroNotImplementedException|MediosDeCobroNotImplementedException $mercadoPagoQRNotFoundException)
        {
            Log::warning($mercadoPagoQRNotFoundException->getMessage());
        }

        if($newStatus !== null)
        {

            $ventaSucursalCobro = VentaSucursalCobro::where('id', $newStatus->localId)->first();
            if(!$newStatus->localId)
            {
                throw new MediosDeCobroException('No se pudo localizar una ventaSucursalCobro en la notificacion.');
            }

            if($ventaSucursalCobro->estado !== $newStatus->status->value)
            {
                $ventaSucursalCobro->estado = $newStatus->status->value;
                $ventaSucursalCobro->save();


                event(app(MediosDeCobroStatusChangeEvent::class, ['ventaSucursalCobro' => $ventaSucursalCobro]));
            }
        }
    }

    /**
     * @throws MediosDeCobroConnectionTestException
     */
    public function testConnection(MedioDeCobroSucursalConfiguracion $medioDeCobroSucursalConfiguracion): bool
    {
        try
        {

            $driver = $this->getDriverOrFail(
                ConnectionDataDTOFactory::fromMedioDeCobroSucursalConfiguracion(
                    $medioDeCobroSucursalConfiguracion
                )
            );

            $result = $driver->testConnection($medioDeCobroSucursalConfiguracion->idsucursal);

            if($result){
                $medioDeCobroSucursalConfiguracion->configuration_checked = true;
                $medioDeCobroSucursalConfiguracion->save();
            }

            return $result;

        }catch(\Exception $e){
            throw new MediosDeCobroConnectionTestException($e->getMessage());
        }
    }

    public function processTaxesAndFees(VentaSucursalCobro $ventaSucursalCobro): OrderPaymentDetailDTO
    {
        $driver = $this->getDriverOrFail(
            ConnectionDataDTOFactory::fromVentaSucursalCobro($ventaSucursalCobro)
        );

        $orderDTO = $driver->getOrder($ventaSucursalCobro->id);

        return $driver->syncPaymentDetails($orderDTO);
    }

}
