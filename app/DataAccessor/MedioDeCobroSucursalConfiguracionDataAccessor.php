<?php

namespace App\DataAccessor;

use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroConfiguracionException;

class MedioDeCobroSucursalConfiguracionDataAccessor extends DataAccessorBase
{
    private MedioDeCobroSucursalConfiguracion $medioDeCobroSucursalConfiguracion;
    public function __construct(int $idSucursal, int $idModoDeCobro)
    {
        $medioDeCobroSucursalConfiguracion = MedioDeCobroSucursalConfiguracion::where('idmododecobro', $idModoDeCobro)
            ->where('idsucursal', $idSucursal)
            ->orderBy('id', 'desc')
            ->first();

        if(!$medioDeCobroSucursalConfiguracion)
        {
            throw new MediosDeCobroConfiguracionException('No se encontró configuración para el medio de cobro y sucursal.');
        }
        $this->medioDeCobroSucursalConfiguracion = $medioDeCobroSucursalConfiguracion;

    }

    public function getConfiguracion(): MedioDeCobroSucursalConfiguracion
    {
        return $this->medioDeCobroSucursalConfiguracion;
    }

    public function getConfiguracionValidated(): MedioDeCobroSucursalConfiguracion
    {
        $config = $this->medioDeCobroSucursalConfiguracion;

        // Regla 1: habilitarconfiguracion debe ser true
        if (!$config->habilitarconfiguracion) {
            throw new MediosDeCobroConfiguracionException('La configuración del medio de cobro no está habilitada.');
        }

        // Regla 2: configuration_checked debe ser true
        if (!$config->configuration_checked) {
            throw new MediosDeCobroConfiguracionException('La configuración del medio de cobro no fue marcada como verificada.');
        }

        // Regla 3: metadata->store y metadata->caja no pueden ser null
        $metadata = $config->metadata ?? null;
        $store = null;
        $caja = null;

        if (is_array($metadata)) {
            $store = $metadata['store'] ?? null;
            $caja = $metadata['caja'] ?? null;
        } elseif (is_object($metadata)) {
            $store = $metadata->store ?? null;
            $caja = $metadata->caja ?? null;
        }

        if ($store === null || $caja === null) {
            throw new MediosDeCobroConfiguracionException('La configuración del medio de cobro es inválida: metadata.store y metadata.caja no pueden ser nulos.');
        }

        return $config;
    }
}
