<?php

namespace App\Validations;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Validator for inserting MedioDeCobroSucursalConfiguracion entities.
 *
 * Naming convention: App\\Validations\\{Entity}InsertValidation
 * This class will be auto-discovered by ApiResourceBaseInsert and its rules/messages
 * will be merged into the base rules for the insert operation.
 */
class MedioDeCobroSucursalConfiguracionPatchValidation
{
    /**
     * Return validation rules for the insert request.
     *
     * @param \Illuminate\Http\Request $request
     * @return array<string, mixed>
     */
    public function rules(Request $request): array
    {
        $idsucursal = $request->input('idsucursal');

        return [
            // Required base relations
            'id' => ['required', 'integer', 'exists:mediodecobrosucursalconfiguraciones,id'],
            'idsucursal' => ['required', 'integer', 'exists:sucursales,id'],
            'idmododecobro' => [
                'required',
                'integer',
                'exists:modosdecobro,id',
            ],

            // Flags
            'habilitarconfiguracion' => ['sometimes', 'boolean'],
            'transferirmonto' => ['sometimes', 'boolean'],
            'configuration_checked' => ['sometimes', 'boolean'],

            // Conditional metadata token when habilitarconfiguracion is true
            'metadata' => ['nullable', 'array'],
            'metadata.token' => ['nullable', 'string', 'required_if:habilitarconfiguracion, true'],
            'metadata.userId' => ['nullable', 'string', 'required_if:habilitarconfiguracion,true'],

            // Conditional requirements when transfer is enabled
            'idsucursalcajadestino' => ['nullable', 'integer', 'required_if:transferirmonto,1,true'],
            'idusuariocajadestino' => ['nullable', 'integer', 'required_if:transferirmonto,1,true'],
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'id.required' => 'Identificador de la configuracion es requerido.',
            'idsucursal.required' => 'La sucursal es obligatoria.',
            'idsucursal.exists' => 'La sucursal seleccionada no existe.',

            'idmododecobro.required' => 'El modo de cobro es obligatorio.',
            'idmododecobro.exists' => 'El modo de cobro seleccionado no existe.',
            'idmododecobro.unique' => 'Ya existe una configuración para esta sucursal y modo de cobro.',

            'habilitarconfiguracion.boolean' => 'El campo habilitarconfiguracion debe ser booleano.',
            'transferirmonto.boolean' => 'El campo transferirmonto debe ser booleano.',

            'metadata.token.required_if' => 'El token de app es obligatorio cuando la configuración está habilitada.',
            'metadata.userId.required_if' => 'El userId es obligatorio cuando la configuración está habilitada.',

            'idsucursalcajadestino.required_if' => 'La sucursal de caja destino es obligatoria cuando transferirmonto es verdadero.',
            'idusuariocajadestino.required_if' => 'El usuario de caja destino es obligatorio cuando transferirmonto es verdadero.',
        ];
    }
}
