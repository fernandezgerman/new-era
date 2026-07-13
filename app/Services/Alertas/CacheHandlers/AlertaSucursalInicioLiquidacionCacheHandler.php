<?php

namespace App\Services\Alertas\CacheHandlers;

use App\Models\Sucursal;
use App\Services\Alertas\DTOs\AlertaSucursalLiquidacionDTO;
use App\Services\Cache\CacheHandler\CacheHandler;
use App\Services\Cache\Enums\CacheExpire;
use Illuminate\Support\Carbon;

class AlertaSucursalInicioLiquidacionCacheHandler extends CacheHandler
{

    public function __construct(protected Sucursal $sucursal)
    {
    }

    protected function getExpireTime(): ?CacheExpire
    {
        return null;
    }

    protected function getKey(): string
    {
        return 'alerta_sucursal_inicio_liquidacion_' . $this->sucursal->id;
    }

    public function setValue(mixed $value): void
    {
        $alertaSucursalLiquidacionDTO = new AlertaSucursalLiquidacionDTO($value, Carbon::now());
        parent::setValue($alertaSucursalLiquidacionDTO);
    }

    public function getValue(): AlertaSucursalLiquidacionDTO
    {
        $value = parent::getValue();

        return $value ?? new AlertaSucursalLiquidacionDTO([], Carbon::now());
    }

}
