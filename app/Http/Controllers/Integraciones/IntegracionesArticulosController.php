<?php

namespace App\Http\Controllers\Integraciones;

use App\Http\Controllers\Controller;
use App\Models\Articulo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IntegracionesArticulosController extends Controller
{
    /**
     * Retorna el artículo que coincide exactamente con el código proporcionado.
     *
     * @param string $codigo El código único del artículo a buscar.
     * @return \Illuminate\Http\JsonResponse 200 con los datos del artículo, o 404 si no se encuentra.
     */
    public function showByCodigo($codigo)
    {
        $articulo = Articulo::join('rubros', 'articulos.idrubro', '=', 'rubros.id')
            ->where('articulos.codigo', $codigo)
            ->where('articulos.activo', 1)
            ->where('rubros.esrubrogastos', '<>', 1)
            ->select('articulos.*')
            ->first();

        if (!$articulo) {
            return response()->json([
                'message' => 'Artículo no encontrado'
            ], 404);
        }

        return response()->json($articulo);
    }

    /**
     * Busca artículos por descripción con paginación de 20 resultados por página.
     *
     * @param string $descripcion El texto de búsqueda (mínimo 3 caracteres).
     * @return \Illuminate\Http\JsonResponse 200 con los resultados paginados, o 422 si la búsqueda es muy corta.
     */
    public function searchByDescripcion($descripcion)
    {
        if (strlen($descripcion) < 3) {
            return response()->json([
                'message' => 'La búsqueda debe tener al menos 3 caracteres'
            ], 422);
        }

        $descripcionUpper = strtoupper($descripcion);

        $articulos = Articulo::join('rubros', 'articulos.idrubro', '=', 'rubros.id')
            ->where(DB::raw('ucase(articulos.descripcion) LIKE %' . $descripcionUpper . '%'))
            ->where('articulos.activo', 1)
            ->where('rubros.esrubrogastos', '<>', 1)
            ->select('articulos.*')
            ->paginate(20);

        return response()->json($articulos);
    }
}
