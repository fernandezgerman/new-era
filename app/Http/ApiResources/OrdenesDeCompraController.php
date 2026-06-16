<?php

namespace App\Http\ApiResources;

use App\Http\Requests\Api\AddOrdenDeCompraRequest;
use App\Http\Requests\Api\GetArticulosAOrdenarRequest;
use App\Http\Requests\Api\GetOrdenesDeCompraRequest;
use App\Models\Marca;
use App\Models\Rubro;
use App\Models\Sucursal;
use App\Services\OrdenesDeCompra\DTOs\AddOrdenDeCompraDTO;
use App\Services\OrdenesDeCompra\DTOs\ArticulosAOrdenarFilterDTO;
use App\Services\OrdenesDeCompra\DTOs\OrdenesDeCompraFilterDTO;
use App\Services\OrdenesDeCompra\OrdenesDeCompraManager;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Auth;

class OrdenesDeCompraController extends AbstractApiHandler
{
    public function __construct(
        private readonly OrdenesDeCompraManager $manager
    ) {
    }

    /**
     * List purchase orders with filtering, sorting and pagination.
     *
     * @param GetOrdenesDeCompraRequest $request
     *      - page (int, optional): Page number (default: 1).
     *      - per_page (int, optional): Items per page (default: 50).
     *      - sort (string, optional): Column to sort by (id, fechahora, idproveedor, idsucursal).
     *      - sort_direction (string, optional): Sort direction (asc, desc).
     *      - proveedoresId (array, optional): Filter by supplier IDs.
     *      - sucursalesId (array, optional): Filter by branch IDs.
     *      - usuarios (array, optional): Filter by user IDs.
     *      - numeroOrden (string, optional): Filter by order ID.
     *      - fechaDesde (date, optional): Start date filter.
     *      - fechaHasta (date, optional): End date filter.
     *      - articulo (int, optional): Filter by article ID.
     *      - rubro (int, optional): Filter by category ID.
     *
     * @return JsonResponse
     *      - 200 OK: Returns a paginated collection of OrdenDeCompra with relations (proveedor, sucursal, usuario, detalles, estados).
     *
     *      Example JSON response:
     *      {
     *          "current_page": 1,
     *          "data": [
     *              {
     *                  "id": 1,
     *                  "idproveedor": 10,
     *                  "idsucursal": 1,
     *                  "observaciones": "First order",
     *                  "fechahora": "2026-06-03T18:00:00.000000Z",
     *                  "idusuario": 5,
     *                  "proveedor": {
     *                      "id": 10,
     *                      "nombre": "Supplier Name"
     *                  },
     *                  "sucursal": {
     *                      "id": 1,
     *                      "nombre": "Main Branch"
     *                  },
     *                  "usuario": {
     *                      "id": 5,
     *                      "nombre": "John",
     *                      "apellido": "Doe",
     *                      "nombre_completo": "John Doe"
     *                  },
     *                  "detalles": [
     *                      {
     *                          "id": 1,
     *                          "idarticulo": 100,
     *                          "idordendecompra": 1,
     *                          "cantidad": "10.000000",
     *                          "costoestimado": "150.500"
     *                      }
     *                  ],
     *                  "estados": [
     *                      {
     *                          "id": 1,
     *                          "idordendecompra": 1,
     *                          "idestado": 1,
     *                          "fechahora": "2026-06-03T18:00:00.000000Z",
     *                          "idusuarioestado": 5
     *                      }
     *                  ]
     *              }
     *          ],
     *          "first_page_url": "http://localhost/api/ordenes-de-compra?page=1",
     *          "from": 1,
     *          "last_page": 1,
     *          "last_page_url": "http://localhost/api/ordenes-de-compra?page=1",
     *          "links": [...],
     *          "next_page_url": null,
     *          "path": "http://localhost/api/ordenes-de-compra",
     *          "per_page": 50,
     *          "prev_page_url": null,
     *          "to": 1,
     *          "total": 1
     *      }
     */
    public function index(GetOrdenesDeCompraRequest $request): JsonResponse
    {
        $dto = OrdenesDeCompraFilterDTO::fromArray($request->validated());
        $data = $this->manager->getOrdenesDeCompra($dto);

        return $this->sendResponse($data);
    }

    /**
     * Get articles to order based on sales history and current stock.
     *
     * @param GetArticulosAOrdenarRequest $request
     *      - rubros (array, mandatory): At least one Rubro ID.
     *      - sucursal (int, mandatory): Sucursal ID.
     *      - diasventas (int, mandatory): Days of sales history to analyze.
     *      - marcas (array, optional): Filter by Marca IDs.
     *      - soloStockActivo (bool, optional): Filter articles with stock in the given sucursal.
     *      - soloVendidos (bool, optional): Filter articles with sales in the given period.
     *      - page (int, optional): Page number (default: 1).
     *      - per_page (int, optional): Items per page (default: 20).
     *
     * @return JsonResponse
     *      - 200 OK: Returns a list of articles with their stock, sales, and supplier info, including pagination metadata.
     *
     *      Example JSON response:
     *      {
     *          "current_page": 1,
     *          "articulos": [
     *              {
     *                  "articulos": {
     *                      "id": 21327,
     *                      "idrubro": 1,
     *                      "codigo": "7790040144088",
     *                      "nombre": "(NO) Traviata tripack 324gr",
     *                      ...
     *                  },
     *                  ...
     *              }
     *          ],
     *          "first_page_url": "http://localhost/api/ordenes-de-compra/articulos-a-ordenar?page=1",
     *          "from": 1,
     *          "last_page": 1,
     *          "last_page_url": "http://localhost/api/ordenes-de-compra/articulos-a-ordenar?page=1",
     *          "links": [...],
     *          "next_page_url": null,
     *          "path": "http://localhost/api/ordenes-de-compra/articulos-a-ordenar",
     *          "per_page": 20,
     *          "prev_page_url": null,
     *          "to": 1,
     *          "total": 1,
     *          "sucursal": { ...Sucursal data... }
     *      }
     */
    public function getArticulosAOrdenar(GetArticulosAOrdenarRequest $request): JsonResponse
    {
        $dto = ArticulosAOrdenarFilterDTO::fromArray($request->validated());

        $data = $this->manager->getArticulosParaGenerarOrdenDeCompra($dto);

        return $this->sendResponse($data);
    }

    /**
     * Create a new purchase order.
     *
     * @param AddOrdenDeCompraRequest $request
     *      - idproveedor (int, mandatory): Supplier ID.
     *      - idsucursal (int, mandatory): Branch ID.
     *      - observaciones (string, optional): Notes about the order.
     *      - detalles (array, mandatory): List of items to order.
     *          - idarticulo (int, mandatory): Article ID.
     *          - cantidad (numeric, mandatory): Quantity.
     *          - costoestimado (numeric, mandatory): Estimated cost per unit.
     *
     * @return JsonResponse
     *      - 200 OK: Returns the created OrdenDeCompra with its relations.
     */
    public function add(AddOrdenDeCompraRequest $request): JsonResponse
    {
        $dto = AddOrdenDeCompraDTO::fromArray(
            $request->validated(),
            Auth::id()
        );

        $orden = $this->manager->addOrdenDeCompra($dto);

        return $this->sendResponse($orden);
    }

    /**
     * Create a new purchase order and send it by email.
     *
     * @param AddOrdenDeCompraRequest $request
     *      - idproveedor (int, mandatory): Supplier ID.
     *      - idsucursal (int, mandatory): Branch ID.
     *      - observaciones (string, optional): Notes about the order.
     *      - detalles (array, mandatory): List of items to order.
     *          - idarticulo (int, mandatory): Article ID.
     *          - cantidad (numeric, mandatory): Quantity.
     *          - costoestimado (numeric, mandatory): Estimated cost per unit.
     *
     * @return JsonResponse
     *      - 200 OK: Returns the created OrdenDeCompra with its relations.
     *      - 500 Internal Server Error: If the supplier has no email or an error occurred during sending.
     */
    public function addAndSendEmail(AddOrdenDeCompraRequest $request): JsonResponse
    {
        try {
            $dto = AddOrdenDeCompraDTO::fromArray(
                $request->validated(),
                Auth::id()
            );

            $orden = $this->manager->addAndSendEmail($dto);

            return $this->sendResponse('Orden de compra creada y enviada exitosamente.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * Download a purchase order in PDF format.
     *
     * @param int $id The ID of the purchase order to download.
     *
     * @return \Illuminate\Http\Response|\Symfony\Component\HttpFoundation\Response
     *      - 200 OK: Returns the PDF file as a stream for download.
     *      - 404 Not Found: If the purchase order ID does not exist.
     */
    public function downloadPdf(int $id)
    {
        return $this->manager->downloadPdf($id);
    }

    /**
     * Send a purchase order by email to the supplier.
     *
     * @param int $id The ID of the purchase order to send.
     *
     * @return JsonResponse
     *      - 200 OK: If the email was sent successfully.
     *      - 404 Not Found: If the purchase order ID does not exist.
     *      - 500 Internal Server Error: If the supplier has no email or an error occurred during sending.
     */
    public function sendEmail(int $id): JsonResponse
    {
        try {
            $this->manager->sendEmail($id, Auth::id());
            return $this->sendResponse( 'Orden de compra enviada exitosamente.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }
}
