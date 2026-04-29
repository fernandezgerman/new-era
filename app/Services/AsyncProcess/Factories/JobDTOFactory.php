<?php

namespace App\Services\AsyncProcess\Factories;

use App\Services\AsyncProcess\DTOs\JobDTO;
use App\Services\AsyncProcess\Enums\AvailableAsyncProcess;
use App\Services\AsyncProcess\Exceptions\AsyncProcessNotExistException;
use App\Services\AsyncProcess\Interfaces\AsyncProcessDTOInterface;
use App\Services\ProcesamientoDeCostos\ProcesamientoDeCostosManager;
use App\Services\Test\TestManager;

class JobDTOFactory
{
    public static function make(AsyncProcessDTOInterface $asyncProcessDTO): JobDTO
    {
        $service = match ($asyncProcessDTO->getAsyncProcessName()->value) {
            AvailableAsyncProcess::PROCESAR_COMPRA->value => ProcesamientoDeCostosManager::class,
            AvailableAsyncProcess::ACTUALIZAR_REFERENCIAS_COSTOS->value => ProcesamientoDeCostosManager::class,
            AvailableAsyncProcess::ACTUALIZAR_REFERENCIAS_COSTOS_POR_DETALLES->value => ProcesamientoDeCostosManager::class,
            AvailableAsyncProcess::TEST->value => TestManager::class,
            default => throw new AsyncProcessNotExistException('No existe le proceso que desea ingresar en la cola'),
        };

        $method = match ($asyncProcessDTO->getAsyncProcessName()->value) {
            AvailableAsyncProcess::PROCESAR_COMPRA->value => 'procesarCostosDeCompra',
            AvailableAsyncProcess::ACTUALIZAR_REFERENCIAS_COSTOS->value => 'actualizarReferenciaDeCostos',
            AvailableAsyncProcess::ACTUALIZAR_REFERENCIAS_COSTOS_POR_DETALLES->value => 'actualizarReferenciaDeCostoscompraDetallesIds',
            AvailableAsyncProcess::TEST->value => 'logMessage',
            default => throw new AsyncProcessNotExistException('No existe el metodo en el servicio'),
        };

        return new JobDTO(
            service: $service,
            method: $method,
            parameters: $asyncProcessDTO->toArray()
        );
    }
}
