<?php

namespace App\Http\Requests\Promociones;

use Illuminate\Foundation\Http\FormRequest;

class SetPromocionArticulosRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'articulos' => 'required|array|min:1',
            'articulos.*.id' => 'nullable|integer|exists:promocionesarticulos,id',
            'articulos.*.promocion_id' => 'required|integer|exists:promociones,id',
            'articulos.*.articulo_id' => 'required|integer|exists:articulos,id',
            'articulos.*.porcentaje' => 'required|numeric',
            'articulos.*.cantidad' => 'required|numeric',
            'articulos.*.precio' => 'required|numeric',
            'articulos.*.activo' => 'required|integer|in:0,1',
        ];
    }
}
