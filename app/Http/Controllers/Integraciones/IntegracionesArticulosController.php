<?php

namespace App\Http\Controllers\Integraciones;

use App\Http\Controllers\Controller;
use App\Models\Articulo;
use Illuminate\Http\Request;

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
        $articulo = Articulo::where('codigo', $codigo)
            ->where('activo', 1)
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

        $articulos = Articulo::where('descripcion', 'LIKE', '%' . $descripcion . '%')
            ->where('activo', 1)
            ->paginate(20);

        return response()->json($articulos);
    }
}
