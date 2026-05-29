<?php

namespace App\Http\Controllers\Importaciones;

use App\Http\Controllers\Controller;
use App\Http\Requests\DefinirColumnasRequest;
use App\Http\Requests\ImportarListaFileRequest;
use App\Models\ImportacionProveedorListaCabecera;
use App\Models\Proveedor;
use App\Models\ProveedorLista;
use App\Services\ProveedoresListas\DTOs\FuncionalidadDeColumnasDTO;
use App\Services\ProveedoresListas\DTOs\ImportDataDTO;
use App\Services\ProveedoresListas\Enum\SupportedDrivers;
use App\Services\ProveedoresListas\ProveedoresListasManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ImportacionListasController extends Controller
{
    public function __construct(
        protected ProveedoresListasManager $proveedoresListasManager
    ) {
    }

    /**
     * Importar una lista de precios desde un archivo para un proveedor específico.
     *
     * @param ImportarListaFileRequest $request
     * @param int $idproveedor
     * @return JsonResponse
     *
     * @request_body {
     *   "file": "file|required|mimes:xls,xlsx,csv"
     * }
     *
     * @response {
     *   "cabecera": {
     *     "id": 1,
     *     "idusuario": 1,
     *     "estado": "PENDIENTE",
     *     "created_at": "2026-05-27T19:31:00.000000Z",
     *     "updated_at": "2026-05-27T19:31:00.000000Z"
     *   },
     *   "detalles": {
     *     "current_page": 1,
     *     "data": [
     *       {
     *         "id": 1,
     *         "idimportacionproveedorlistacabecera": 1,
     *         "idproveedor": 132,
     *         "idarticulo": null,
     *         "campo1": "valor1",
     *         "campo2": "valor2",
     *         ...
     *       }
     *     ],
     *     "first_page_url": "...",
     *     "from": 1,
     *     "last_page": 1,
     *     "last_page_url": "...",
     *     "links": [...],
     *     "next_page_url": null,
     *     "path": "...",
     *     "per_page": 40,
     *     "prev_page_url": null,
     *     "to": 1,
     *     "total": 1
     *   }
     * }
     */
    public function importarPorArchivo(ImportarListaFileRequest $request, int $idproveedor): JsonResponse
    {
        set_time_limit(180);
        $proveedor = Proveedor::findOrFail($idproveedor);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        if ($file->getMimeType() === 'application/x-ole-storage' && empty($extension)) {
            $extension = 'xls';
        }

        $fileName = \Illuminate\Support\Str::random(40) . ($extension ? '.' . $extension : '');
        $path = $file->storeAs('listas', $fileName);
        $fullPath = Storage::path($path);

        $importDataDTO = new ImportDataDTO(
            proveedor: $proveedor,
            path: $fullPath,
            driver: SupportedDrivers::File
        );

        $importacionDTO = $this->proveedoresListasManager->importarRegistros($importDataDTO);

        Storage::delete($path);

        $detallesPaginados = $importacionDTO->cabecera->detalles()
            ->paginate(40);

        return response()->json([
            'cabecera' => $importacionDTO->cabecera,
            'detalles' => $detallesPaginados
        ]);
    }

    /**
     * Obtiene los detalles de una pre-carga paginados (40 por página).
     *
     * Endpoint: GET /api/importar/listas/pre-carga/{idcabecera}/detalles
     *
     * Query Parameters:
     * - page: int (Opcional, default 1)
     *
     * @response {
     *   "current_page": 1,
     *   "data": [ ... ],
     *   "first_page_url": "...",
     *   "from": 1,
     *   "last_page": 5,
     *   "last_page_url": "...",
     *   "links": [...],
     *   "next_page_url": "...",
     *   "path": "...",
     *   "per_page": 40,
     *   "prev_page_url": null,
     *   "to": 40,
     *   "total": 180
     * }
     */
    public function getDetallesPreCarga(int $idcabecera): JsonResponse
    {
        $cabecera = ImportacionProveedorListaCabecera::findOrFail($idcabecera);

        $detallesPaginados = $cabecera->detalles()
            ->paginate(40);

        return response()->json($detallesPaginados);
    }

    /**
     * Definir las funcionalidades de las columnas para una importación específica.
     *
     * @param DefinirColumnasRequest $request
     * @param int $idcabecera
     * @return JsonResponse
     *
     * @request_body {
     *   "precio": "campo9",
     *   "descripcion": "campo2",
     *   "codigo1": "campo1",
     *   "codigo2": null,
     *   "codigo3": null,
     *   "codigos_con_coma": null
     * }
     *
     * @response {
     *   "lista": {
     *     "id": 1,
     *     "idusuario": 1,
     *     "estado": "PENDIENTE",
     *     "config": {
     *       "precio": "campo9",
     *       "descripcion": "campo2",
     *       "codigo1": "campo1",
     *       "codigo2": null,
     *       "codigo3": null,
     *       "codigos_con_coma": null
     *     },
     *     ...
     *   },
     *   "detalles": {
     *     "current_page": 1,
     *     "data": [
     *       {
     *         "id": 1,
     *         "idarticulo": 55,
     *         "campo1": "COD001",
     *         "descripcionproceso": null,
     *         ...
     *       }
     *     ],
     *     "per_page": 40,
     *     "total": 1,
     *     ...
     *   }
     * }
     */
    public function definirColumnas(DefinirColumnasRequest $request, int $idcabecera): JsonResponse
    {
        set_time_limit(180);
        $cabecera = ImportacionProveedorListaCabecera::findOrFail($idcabecera);

        $dto = new FuncionalidadDeColumnasDTO(
            precio: $request->input('precio'),
            descripcion: $request->input('descripcion'),
            codigo1: $request->input('codigo1'),
            codigo2: $request->input('codigo2'),
            codigo3: $request->input('codigo3'),
            codigosConComa: $request->input('codigos_con_coma')
        );

        $proveedorLista = $this->proveedoresListasManager->definirColumnas($cabecera, $dto);

        $detallesPaginados = $proveedorLista->detalles()
            ->with('articulo')
            ->paginate(40);

        return response()->json([
            'lista' => $proveedorLista->makeHidden('detalles'),
            'detalles' => $detallesPaginados
        ]);
    }

    /**
     * Obtiene los detalles de una lista de proveedor paginados (40 por página).
     *
     * Endpoint: GET /api/importar/listas/{idlista}/detalles
     *
     * Query Parameters:
     * - page: int (Opcional, default 1)
     *
     * @response {
     *   "current_page": 1,
     *   "data": [
     *     {
     *       "id": 1,
     *       "idproveedorlista": 1,
     *       "idarticulo": 55,
     *       "descripciondelproveedor": "Producto X",
     *       "precio": "123.45",
     *       "articulo": { "id": 55, "codigo": "COD001", "nombre": "..." }
     *     }
     *   ],
     *   "per_page": 40,
     *   "total": 1,
     *   ...
     * }
     */
    public function getDetallesLista(int $idlista): JsonResponse
    {
        $lista = ProveedorLista::findOrFail($idlista);

        $detallesPaginados = $lista->detalles()
            ->with('articulo')
            ->paginate(40);

        return response()->json($detallesPaginados);
    }
}
