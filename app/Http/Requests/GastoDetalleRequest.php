<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GastoDetalleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'idperiodo'  => ['required', 'integer', 'exists:liquidacionesperiodo,id'],
            'idarticulo' => ['required', 'integer', 'exists:articulos,id'],
            'idsucursal' => ['required', 'integer', 'exists:sucursales,id'],
        ];
    }
}
