<?php

namespace App\Http\Requests\Api;

class GetOrdenesDeCompraRequest extends AbstractApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort' => ['nullable', 'string', 'in:id,fechahora,idproveedor,idsucursal'],
            'sort_direction' => ['nullable', 'string', 'in:asc,desc'],
            'proveedoresId' => ['nullable', 'array'],
            'proveedoresId.*' => ['integer'],
            'sucursalesId' => ['nullable', 'array'],
            'sucursalesId.*' => ['integer'],
            'usuarios' => ['nullable', 'array'],
            'usuarios.*' => ['integer'],
            'numeroOrden' => ['nullable', 'string'],
            'fechaDesde' => ['nullable', 'date'],
            'fechaHasta' => ['nullable', 'date'],
            'articulo' => ['nullable', 'integer'], // ID del artículo
            'rubro' => ['nullable', 'integer'],    // ID del rubro
        ];
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        // Ensure arrays for multi-select filters if they come as strings
        foreach (['proveedoresId', 'sucursalesId', 'usuarios'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $this->merge([
                    $field => explode(',', $this->input($field)),
                ]);
            }
        }
    }
}
