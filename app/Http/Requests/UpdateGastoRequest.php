<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGastoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'idperiodo'          => ['required', 'integer', 'exists:liquidacionesperiodo,id'],
            'idperiodo_anterior' => ['nullable', 'integer', 'exists:liquidacionesperiodo,id'],
            'idarticulo'         => ['required', 'integer', 'exists:articulos,id'],
            'id_compra_detalle'  => ['required', 'integer', 'exists:comprasdetalle,id'],
        ];
    }
}
