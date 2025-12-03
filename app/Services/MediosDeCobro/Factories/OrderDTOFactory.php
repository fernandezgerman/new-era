<?php

namespace App\Services\MediosDeCobro\Factories;

use App\Http\Requests\MediosDePago\GenerateOrderByDataRequest;
use App\Http\Requests\MediosDePago\GenerateOrderRequest;
use App\Http\Requests\MediosDePago\OrderPreviewRequest;
use App\Models\Articulo;
use App\Models\ModoDeCobro;
use App\Models\Sucursal;
use App\Models\User;
use App\Models\VentaSucursalCobro;
use App\Models\VentaSucursalCobroArticulo;
use App\Services\MediosDeCobro\DTOs\Collections\OrderDetalleDTOCollection;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\DTOs\OrderDetalleDTO;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroException;
use Illuminate\Support\Arr;

class OrderDTOFactory
{
    /**
     * Crea un OrderDTO a partir de un modelo VentaSucursalCobro existente.
     * - Mapea usuario, sucursal y modo de cobro desde sus relaciones.
     * - Construye los detalles a partir de ventasucursalcobroarticulos.
     */
    public static function fromVentaSucursalCobro(VentaSucursalCobro $venta): OrderDTO
    {
        $dto = new OrderDTO();

        // Relaciones básicas
        $dto->usuario = $venta->usuario;   // App\Models\User
        $dto->sucursal = $venta->sucursal; // App\Models\Sucursal
        $dto->modoDeCobro = $venta->mododecobro; // App\Models\ModoDeCobro
        $dto->idempotencyKey = (env('APP_DEBUG') ? 'prod' : 'dev').$venta->id;
        $dto->localId = $venta->id;
        $dto->externalId = null;

        // Detalles
        $detalles = new OrderDetalleDTOCollection();

        // Asegurar que tenemos los artículos cargados
        $venta->loadMissing(['articulos.articulo']);

        /** @var VentaSucursalCobroArticulo $linea */
        foreach ($venta->articulos as $linea) {
            $d = new OrderDetalleDTO();
            $d->articulo = $linea->articulo; // App\Models\Articulo
            $d->cantidad = (float) $linea->cantidad;
            // precio_unitario se infiere de importe / cantidad para mantener compatibilidad
            $cantidad = (float) $linea->cantidad ?: 1.0;
            $precioUnitario = (float) $linea->importe / $cantidad;
            $d->precio_unitario = $precioUnitario;
            $d->id_unico_venta = (string) $linea->idunicoventa;
            $detalles->push($d);
        }

        $dto->detalles = $detalles;

        // Respuesta de gateway no aplica al reconstruir desde DB.
        $dto->gatewayResponse = null;

        return $dto;
    }
    public static function fromRequest(OrderPreviewRequest|GenerateOrderByDataRequest $request): OrderDTO
    {
        $data = $request->validated();
        return self::fromArray($data);
    }

    /**
     * Construye un OrderDTO a partir de un array compatible con GenerateOrderRequest::rules().
     *
     * Estructura esperada:
     * - usuario: string
     * - clave: string
     * - idsucursal: int (existe en tabla sucursales)
     * - idmododecobro: int (existe en tabla modosdecobro)
     * - items: array<{
     *      idunicoventa: string,
     *      codigo: string (codigo de Articulo),
     *      descripcion: string,
     *      cantidad: int>0,
     *      importe: float>=0
     *   }>
     *
     * Reglas:
     * - Usuario se busca por usuario y clave (legacy schema). Si no existe: excepción.
     * - Articulo se busca por codigo. Si no existe: excepción (no creamos registros fantasmas).
     */
    public static function fromArray(array $data): OrderDTO
    {
        // Usuario
        $usuario = User::where('usuario', $data['usuario'] ?? null)
            ->first();
        if (!$usuario) {
            throw new MediosDeCobroException('Sucursal no encontrado.');
        }

        // Sucursal
        $sucursal = Sucursal::find($data['idsucursal'] ?? null);
        if (!$sucursal) {
            throw new MediosDeCobroException('Sucursal no encontrada.');
        }

        // Modo de cobro
        $modoDeCobro = ModoDeCobro::find($data['idmododecobro'] ?? null);

        // Detalles
        $detallesCollection = new OrderDetalleDTOCollection();
        foreach ($data['items'] as $item) {
            $articulo = false;
            // Buscar artículo por código
            if( isset($item['idarticulo'])){
                $articulo = Articulo::where('id', $item['idarticulo'] ?? null)->first();
            }else{
                throw new MediosDeCobroException('Articulo no encontrado, id: '. $item['idarticulo']);
            }

            $cantidad = (float) ($item['cantidad'] ?? 0);
            $importe = (float) ($item['importe'] ?? 0);
            $precioUnitario = $cantidad > 0 ? $importe / $cantidad : 0.0;

            $detalle = new OrderDetalleDTO();
            $detalle->articulo = $articulo;
            $detalle->cantidad = $cantidad;
            $detalle->precio_unitario = $precioUnitario;
            $detalle->id_unico_venta = (string) ($item['idunicoventa'] ?? '');

            $detallesCollection->push($detalle);
        }

        // Armar DTO
        $dto = new OrderDTO();
        $dto->usuario = $usuario;
        $dto->idunicolegacy = Arr::get($data, 'idunicoventasucursallegacy');
        $dto->sucursal = $sucursal;
        $dto->modoDeCobro = $modoDeCobro;
        $dto->detalles = $detallesCollection;
        $dto->gatewayResponse = null;

        return $dto;
    }
}
