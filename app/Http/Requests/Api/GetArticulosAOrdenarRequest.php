<?php

namespace App\Http\Requests\Api;

class GetArticulosAOrdenarRequest extends AbstractApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rubros' => ['required', 'array', 'min:1'],
            'rubros.*' => ['integer', 'exists:rubros,id'],
            'sucursal' => ['required', 'integer', 'exists:sucursales,id'],
            'diasventas' => ['required', 'integer', 'min:1'],
            'marcas' => ['nullable', 'array'],
            'marcas.*' => ['integer', 'exists:marcas,id'],
            'soloStockActivo' => ['nullable', 'boolean'],
            'soloVendidos' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        // Ensure arrays for multi-select filters if they come as strings
        foreach (['rubros', 'marcas'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $this->merge([
                    $field => explode(',', $this->input($field)),
                ]);
            }
        }
    }
}
