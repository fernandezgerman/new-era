<?php

namespace App\Http\Requests\MediosDePago;

use App\Http\Requests\Api\AbstractApiRequest;
use App\Services\MediosDeCobro\Enums\TiposMedioDeCobro;

class OrderPreviewRequest extends AbstractApiRequest
{
    public function rules(): array
    {
        $tipos = array_map(fn($c) => $c->value, TiposMedioDeCobro::cases());

        return [
            'usuario' => ['required', 'string'],
            'clave' => ['required', 'string'],
            'idsucursal' => ['required', 'integer', 'exists:sucursales,id'],
            'type' => ['required', 'string', 'in:' . implode(',', $tipos)],

            'items' => ['required', 'array', 'min:1'],
            'items.*.idunicoventa' => ['required', 'string'],
            'items.*.descripcion' => ['required', 'string'],
            'items.*.cantidad' => ['required', 'integer', 'min:1'],
            'items.*.importe' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'usuario.required' => 'El usuario es obligatorio.',
            'usuario.string' => 'El usuario debe ser un texto.',

            'clave.required' => 'La clave es obligatoria.',
            'clave.string' => 'La clave debe ser un texto.',

            'idsucursal.required' => 'La sucursal es obligatoria.',
            'idsucursal.integer' => 'La sucursal debe ser un número entero.',
            'idsucursal.exists' => 'La sucursal seleccionada no existe.',

            'type.required' => 'El tipo de medio de cobro es obligatorio.',
            'type.string' => 'El tipo de medio de cobro debe ser un texto.',
            'type.in' => 'El tipo de medio de cobro no es válido.',

            'items.required' => 'Debe enviar al menos un ítem.',
            'items.array' => 'Los ítems deben enviarse como una lista.',
            'items.min' => 'Debe enviar al menos un ítem.',

            'items.*.idunicoventa.required' => 'El idúnico de venta es obligatorio para cada ítem.',
            'items.*.idunicoventa.string' => 'El idúnico de venta debe ser un texto.',

            'items.*.descripcion.required' => 'La descripción es obligatoria para cada ítem.',
            'items.*.descripcion.string' => 'La descripción debe ser un texto.',

            'items.*.cantidad.required' => 'La cantidad es obligatoria para cada ítem.',
            'items.*.cantidad.integer' => 'La cantidad debe ser un número entero.',
            'items.*.cantidad.min' => 'La cantidad debe ser al menos 1.',

            'items.*.importe.required' => 'El importe es obligatorio para cada ítem.',
            'items.*.importe.numeric' => 'El importe debe ser un número.',
            'items.*.importe.min' => 'El importe no puede ser negativo.',
        ];
    }
}
