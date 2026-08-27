<?php

namespace App\Http\Requests\BalanceGeneral;

use Illuminate\Foundation\Http\FormRequest;

class GetBalanceGeneralPorSucursalRequest extends FormRequest
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
            'dateFrom' => ['required_without:idPeriodoLiquidacionDesde', 'nullable', 'date', 'date_format:Y-m-d'],
            'dateTo' => ['required_without:idPeriodoLiquidacionHasta', 'nullable', 'date', 'date_format:Y-m-d', 'after_or_equal:dateFrom'],
            'idPeriodoLiquidacionDesde' => ['required_without:dateFrom', 'nullable', 'integer', 'exists:liquidacionesperiodo,id'],
            'idPeriodoLiquidacionHasta' => ['required_without:dateTo', 'nullable', 'integer', 'exists:liquidacionesperiodo,id'],
            'sucursales' => ['nullable', 'array'],
            'sucursales.*' => ['integer', 'exists:sucursales,id'],
        ];
    }
}
