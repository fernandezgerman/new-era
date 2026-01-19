<?php

namespace App\Http\Controllers\RendicionesStock;

use App\Http\Controllers\BaseController;
use App\Http\Requests\RendicionesStock\RendicionesStockArticulosPendientesRequest;
use App\Http\Requests\RendicionesStock\RendicionesStockCreateRequest;
use App\Http\Requests\RendicionesStock\RendicionesStockRendirRequest;
use App\Models\Articulo;
use App\Models\RendicionStock;
use App\Models\Rubro;
use App\Models\Sucursal;
use App\Services\RendicionesStock\Enums\RendicionStockEstados;
use App\Services\RendicionesStock\RendicionesStockManager;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;


class RendicionesStockController extends BaseController
{
    public function __construct(protected RendicionesStockManager $rendicionesStockManager)
    {

    }
    public function create(RendicionesStockCreateRequest $rendicionesStockCreateRequest)
    {
        /** @var Rubro $rubro */
        $rubro = get_entity_or_fail('Rubro', $rendicionesStockCreateRequest->idrubro);
        /** @var Sucursal $sucursal */
        $sucursal = get_entity_or_fail('Sucursal', $rendicionesStockCreateRequest->idsucursal);
        $rendicionStock = $this->rendicionesStockManager->abrirRendicionStock($rubro, $sucursal);

        return $rendicionStock;
    }

    public function listToday()
    {
        $aux = $this->rendicionesStockManager->getRendicionesStock(
            Auth::user(), null, Carbon::now(), RendicionStockEstados::PENDIENTE
        );

        return $aux->load('sucursal','usuario', 'rubro');
    }

    public function rendicionArticulosPendientes(
        int $rendicionId,RendicionesStockArticulosPendientesRequest $rendicionesStockArticulosPendientesRequest
    )
    {
        /** @var RendicionStock $rendicion */
        $rendicion = get_entity_or_fail('RendicionStock', $rendicionId);

        return $this->rendicionesStockManager->getArticulosPendientes($rendicion);
    }

    public function rendicionArticulosRendidos(int $rendicionId,RendicionesStockArticulosPendientesRequest $rendicionesStockArticulosPendientesRequest)
    {
        /** @var RendicionStock $rendicion */
        $rendicion = get_entity_or_fail('RendicionStock', $rendicionId);

        return $this->rendicionesStockManager->getArticulosRendidos($rendicion);
    }

    public function rendirArticulo(int $rendicionId, RendicionesStockRendirRequest $rendicionesStockRendirRequest)
    {
        /** @var Articulo $articulo */
        $articulo = get_entity_or_fail('Articulo', $rendicionesStockRendirRequest->idarticulo);
        /** @var RendicionStock $rendicion */
        $rendicion = get_entity_or_fail('RendicionStock', $rendicionId);

        return $this->rendicionesStockManager->rendirArticulo(
            $rendicion,
            $articulo,
            $rendicionesStockRendirRequest->cantidad
        );
    }

}
