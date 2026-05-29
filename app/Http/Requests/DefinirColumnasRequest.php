<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DefinirColumnasRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'precio' => ['required', 'string'],
            'descripcion' => ['required', 'string'],
            'codigos_con_coma'  => ['nullable', 'string', 'required_without_all:codigo1,codigo2,codigo3'],
            'codigo1' => ['nullable', 'string', 'required_without_all:codigo2,codigo3,codigos_con_coma'],
            'codigo2' => ['nullable', 'string', 'required_without_all:codigo1,codigo3,codigos_con_coma'],
            'codigo3' => ['nullable', 'string', 'required_without_all:codigo1,codigo2,codigos_con_coma'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'codigo1.required_without_all' => 'Al menos uno de los códigos (1, 2 o 3) es obligatorio.',
            'codigo2.required_without_all' => 'Al menos uno de los códigos (1, 2 o 3) es obligatorio.',
            'codigo3.required_without_all' => 'Al menos uno de los códigos (1, 2 o 3) es obligatorio.',
            'codigos_con_coma.required_without_all' => 'Al menos uno de los códigos (1, 2 o 3) es obligatorio.',
        ];
    }
}
