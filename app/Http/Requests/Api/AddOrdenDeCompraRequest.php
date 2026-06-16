<?php

namespace App\Http\Requests\Api;

class AddOrdenDeCompraRequest extends AbstractApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'idproveedor' => ['required', 'integer', 'exists:proveedores,id'],
            'idsucursal' => ['required', 'integer', 'exists:sucursales,id'],
            'observaciones' => ['nullable', 'string'],
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.idarticulo' => ['required', 'integer', 'exists:articulos,id'],
            'detalles.*.cantidad' => ['required', 'numeric', 'min:0'],
            'detalles.*.costoestimado' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
