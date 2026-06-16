<?php

namespace App\Services\OrdenesDeCompra;

use App\Collections\MarcaCollection;
use App\Collections\RubroCollection;
use App\DataAccessor\ArticuloDataAccessor;
use App\Models\Articulo;
use App\Models\Existencia;
use App\Models\OrdenDeCompra;
use App\Models\Proveedor;
use App\Models\Rubro;
use App\Models\Sucursal;
use App\Models\OrdenDeCompraEstado;
use App\Mail\OrdenDeCompraMail;
use Illuminate\Support\Facades\Mail;
use App\Services\OrdenesDeCompra\DTOs\AddOrdenDeCompraDTO;
use App\Services\OrdenesDeCompra\DTOs\ArticulosAOrdenarFilterDTO;
use App\Services\OrdenesDeCompra\DTOs\OrdenesDeCompraFilterDTO;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class OrdenesDeCompraManager
{
    public function getOrdenesDeCompra(OrdenesDeCompraFilterDTO $filters): LengthAwarePaginator
    {
        $query = OrdenDeCompra::query()
            ->with(['proveedor', 'sucursal', 'usuario', 'detalles.articulo.rubro', 'estados']);

        if (!empty($filters->proveedoresId)) {
            $query->whereIn('idproveedor', $filters->proveedoresId);
        }

        if (!empty($filters->sucursalesId)) {
            $query->whereIn('idsucursal', $filters->sucursalesId);
        }

        if (!empty($filters->usuarios)) {
            $query->whereIn('idusuario', $filters->usuarios);
        }

        if (!empty($filters->numeroOrden)) {
            $query->where('id', $filters->numeroOrden);
        }

        if ($filters->fechaDesde) {
            $query->where('fechahora', '>=', $filters->fechaDesde->startOfDay());
        }

        if ($filters->fechaHasta) {
            $query->where('fechahora', '<=', $filters->fechaHasta->endOfDay());
        }

        if ($filters->articuloId) {
            $query->whereHas('detalles', function ($q) use ($filters) {
                $q->where('idarticulo', $filters->articuloId);
            });
        }

        if ($filters->rubroId) {
            $query->whereHas('detalles.articulo', function ($q) use ($filters) {
                $q->where('idrubro', $filters->rubroId);
            });
        }

        $query->orderBy($filters->sort, $filters->sortDirection);

        return $query->paginate($filters->perPage, ['*'], 'page', $filters->page);
    }

    /**
     * @param ArticulosAOrdenarFilterDTO $filters
     * @return array
     */
    public function getArticulosParaGenerarOrdenDeCompra(ArticulosAOrdenarFilterDTO $filters)
    {

        $query = Articulo::query()
            ->whereIn('articulos.idrubro', $filters->rubros->pluck('id'))
            ->where('articulos.activo', 1);

        if ($filters->marcas) {
            $query->whereIn('articulos.idmarca', $filters->marcas->pluck('id'));
        }

        if ($filters->soloStockActivo) {
            $query->whereHas('existencias', function ($q) use ($filters) {
                $q->where('idsucursal', $filters->sucursal->id);
            });
        }

        if ($filters->soloVendidos) {
            $query->whereHas('ventas', function ($q) use ($filters) {
                $q->where('idsucursal', $filters->sucursal->id)
                    ->where('fechaenvio', '>=', Carbon::now()->subDays($filters->diasVentas)->startOfDay());
            });
        }

        $paginator = $query->with('marca', 'rubro')
            ->orderBy('articulos.nombre')
            ->paginate($filters->perPage, ['*'], 'page', $filters->page);

        $resultado = $paginator->toArray();
        $resultado['sucursal'] = $filters->sucursal;
        $resultado['articulos'] = [];

        $desdeUltimaCompra = Carbon::now()->subDays(config('ordenes-de-compra.dias_para_ultimas_compras'));
        $desdeUltimaListaDeProveedores = Carbon::now()->subDays(config('ordenes-de-compra.dias_para_listas_de_precios'));


        foreach ($paginator->items() as $articulo) {
            $articuloDataAccesor = new ArticuloDataAccessor($articulo);
            $articulo->load('rubro');

            $cantidadesVendidas = $articuloDataAccesor->getCantidadesVendida($filters->diasVentas, $filters->sucursal);
            $ultimaCompra = $articuloDataAccesor->getUltimaCompraDetalle($filters->sucursal);

            $ultimasComprasPorSucursal = $articuloDataAccesor->getUltimasComprasPorSucursal($desdeUltimaCompra);
            $listasDeProveedores = $articuloDataAccesor->getProveedoresListaPrecio($desdeUltimaListaDeProveedores);

            $collectionCompras = $ultimasComprasPorSucursal;
            if($ultimaCompra)
            {
                $collectionCompras = $collectionCompras->add($ultimaCompra);
            }
            $determinarBestProvider = $this->determinateBestProveedor($listasDeProveedores, $collectionCompras);

            $resultado['articulos'][] = [
                'articulos' => $articulo,
                'existencias' => $articuloDataAccesor->getExistencia($filters->sucursal),
                'costo_con_impuestos' => $articuloDataAccesor->getCostoConImpuestos(),
                'ultima_compra' => $ultimaCompra,
                'ventas' => [
                    'dias' => $filters->diasVentas,
                    'vendido' => $cantidadesVendidas,
                    'promedio' => $cantidadesVendidas / ($filters->diasVentas ?: 1)
                ],
                'proveedores' => [
                    'ultimas_compras' => $ultimasComprasPorSucursal,
                    'listas_precios' => $listasDeProveedores,
                    'default' => $ultimaCompra?->compra?->proveedor,
                    'recomendado' => $determinarBestProvider,
                ]
            ];
        }

        // Clean up 'data' from toArray() as we are using 'articulos' for the transformed items
        unset($resultado['data']);

        return $resultado;
    }

    public function addOrdenDeCompra(AddOrdenDeCompraDTO $dto): OrdenDeCompra
    {
        return DB::transaction(function () use ($dto) {
            $orden = OrdenDeCompra::create([
                'idproveedor' => $dto->idproveedor,
                'idsucursal' => $dto->idsucursal,
                'observaciones' => $dto->observaciones,
                'fechahora' => Carbon::now(),
                'idusuario' => $dto->idusuario,
            ]);

            foreach ($dto->detalles as $detalle) {
                $orden->detalles()->create([
                    'idarticulo' => $detalle['idarticulo'],
                    'cantidad' => $detalle['cantidad'],
                    'costoestimado' => $detalle['costoestimado'],
                ]);
            }

            $orden->estados()->create([
                'idestado' => config('ordenes-de-compra.id_estado_default'),
                'fechahora' => Carbon::now(),
                'idusuarioestado' => $dto->idusuario,
            ]);

            return $orden->load(['proveedor', 'sucursal', 'usuario', 'detalles.articulo', 'estados']);
        });
    }

    private function determinateBestProveedor(Collection $listas, Collection $ultimasCompras): ?Proveedor
    {
        $menorValor = null;
        $proveedorSeleccionado = null;

        foreach($ultimasCompras as $compraDetalle)
        {
            if($menorValor === null || $menorValor > $compraDetalle->costo_con_impuestos)
            {
                $menorValor = $compraDetalle->costo_con_impuestos;
                $proveedorSeleccionado = $compraDetalle->compra->proveedor;
            }
        }

        foreach($listas as $listaDetalle)
        {
            if($menorValor === null || $menorValor > $listaDetalle->precio)
            {
                $menorValor = $listaDetalle->precio;
                $proveedorSeleccionado = $listaDetalle->proveedorLista->proveedor;
            }
        }

        return $proveedorSeleccionado;
    }

    public function downloadPdf(int $id)
    {
        $orden = OrdenDeCompra::with(['proveedor', 'sucursal', 'usuario', 'detalles.articulo'])->findOrFail($id);

        return $this->generatePdf($orden)->download('Orden_de_Compra_' . $orden->id . '.pdf');
    }

    public function sendEmail(int $id, int $idusuario): void
    {
        $orden = OrdenDeCompra::with(['proveedor', 'sucursal', 'usuario', 'detalles.articulo'])->findOrFail($id);

        $this->sendEmailForOrden($orden, $idusuario);
    }

    private function sendEmailForOrden(OrdenDeCompra $orden, int $idusuario): void
    {
        if (!$orden->proveedor || empty($orden->proveedor->email)) {
            throw new \Exception('El proveedor no tiene un correo electrónico configurado.');
        }

        $pdf = $this->generatePdf($orden);
        $filename = 'Orden_de_Compra_' . $orden->id . '.pdf';

        Mail::to($orden->proveedor->email)->send(new OrdenDeCompraMail($orden, $pdf->output(), $filename));

        $orden->estados()->create([
            'idestado' => 2,
            'fechahora' => Carbon::now(),
            'idusuarioestado' => $idusuario,
        ]);
    }

    public function addAndSendEmail(AddOrdenDeCompraDTO $dto): OrdenDeCompra
    {
        $orden = $this->addOrdenDeCompra($dto);
        $this->sendEmailForOrden($orden, $dto->idusuario);

        return $orden;
    }

    private function generatePdf(OrdenDeCompra $orden)
    {
        $logoPath = public_path('img/light-logo.png');
        $logoData = null;
        if (file_exists($logoPath)) {
            $logoData = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
        }

        return \Barryvdh\DomPDF\Facade\Pdf::loadView('pdfs.orden-de-compra', [
            'orden' => $orden,
            'logo' => $logoData,
        ]);
    }
}
