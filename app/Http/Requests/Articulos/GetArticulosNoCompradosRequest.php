<?php

namespace App\Http\Requests\Articulos;

use App\Http\Requests\Api\AbstractApiRequest;

class GetArticulosNoCompradosRequest extends AbstractApiRequest
{
    public function rules(): array
    {
        return [
            'diasUltimaCompra' => ['required', 'integer', 'min:1'],
            'idarticulo' => ['nullable', 'integer', 'exists:articulos,id'],
            'idsucursal' => ['nullable', 'integer', 'exists:sucursales,id'],
            'idrubro' => ['nullable', 'integer', 'exists:rubros,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'diasUltimaCompra.required' => 'Los días desde la última compra son obligatorios.',
            'diasUltimaCompra.integer' => 'Los días desde la última compra deben ser un número entero.',
            'diasUltimaCompra.min' => 'Los días desde la última compra deben ser al menos 1.',
            'idarticulo.integer' => 'El artículo debe ser un número entero.',
            'idarticulo.exists' => 'El artículo seleccionado no existe.',
            'idsucursal.integer' => 'La sucursal debe ser un número entero.',
            'idsucursal.exists' => 'La sucursal seleccionada no existe.',
            'idrubro.integer' => 'El rubro debe ser un número entero.',
            'idrubro.exists' => 'El rubro seleccionado no existe.',
        ];
    }
}
