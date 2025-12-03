<?php

namespace App\Services\Actualizaciones\Drivers\Legacy;

use App\Models\ExcepcionActualizacion;
use App\Models\MotivoActualizacion;
use App\Models\Sucursal;
use App\Models\Version;
use App\Models\VersionActualizacion;
use App\Services\Actualizaciones\Contracts\ActualizacionesDriverInterface;
use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use App\Services\Actualizaciones\DTO\OrdenDeActualizacionDTO;
use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ActualizacionesLegacyDriver implements ActualizacionesDriverInterface
{

    private function insActualizacionSucursal(int $idSucursal, ActualizacionIdentifierDTO $actualizacionIdentifierDTO): void
    {
        $motivoActualizacion = $this->getMotivoActualizacion($actualizacionIdentifierDTO->codigoMotivoActualizacion);

        $version = $this->getOrCreateVersion($motivoActualizacion);

        $exceptuada = $this->sucursalExceptuadaDeActualizar($idSucursal, $motivoActualizacion->id);

        if (!$exceptuada && !$this->actualizacionAlreadyInsertada($idSucursal, $actualizacionIdentifierDTO)) {
            VersionActualizacion::query()->insert([
                'idversion' => $version->id,
                'idsucursal' => $idSucursal,
                'iditem' => $actualizacionIdentifierDTO->idItem,
                'idfecha' => $actualizacionIdentifierDTO->idFecha ? $actualizacionIdentifierDTO->idFecha->format('Y-m-d H:i:s') : null,
                'idusuarioauxiliar' => $actualizacionIdentifierDTO->idUser,
                'cerrada' => $motivoActualizacion->cierreautomatico,
                'fechahoracierre' => Carbon::now(),
            ]);
        }

    }

    public function insActualizacion(OrdenDeActualizacionDTO $ordenDeActualizacionDTO): void
    {
        $actualizacionIdentifierDTO = $ordenDeActualizacionDTO->actualizacionIdentifier;

        $query = Sucursal::query()
            ->whereNot('id', config('general.central_sucursal_id'))
            ->where('activo', 1);

        if ($ordenDeActualizacionDTO->sucursalesId !== null) {
            $query->whereIn('id', $ordenDeActualizacionDTO->sucursalesId);
        }

        $sucursales = $query->get();

        foreach ($sucursales as $sucursal) {
            $this->insActualizacionSucursal($sucursal->id, $actualizacionIdentifierDTO);
        }
    }

    private function sucursalExceptuadaDeActualizar(int $idSucursal, int $idmotivoActualizacion): bool
    {
        return ExcepcionActualizacion::query()
            ->where('idsucursal', $idSucursal)
            ->where('idmotivoactualizacion', $idmotivoActualizacion)
            ->exists();
    }

    private function getMotivoActualizacion(CodigoMotivoActualizacion $codigoMotivoActualizacion): MotivoActualizacion
    {
        return MotivoActualizacion::query()
            ->where('codigo', $codigoMotivoActualizacion->value)
            ->first();
    }

    private function getOrCreateVersion(MotivoActualizacion $motivoActualizacion): Version
    {
        $version = Version::query()
            ->where('idmotivoactualizacion', $motivoActualizacion->id)
            ->orderBy('id', 'desc')
            ->first();

        if (blank($version)) {
            $nextVersion = (int)(Version::query()
                ->where('idmotivoactualizacion', $motivoActualizacion->id)
                ->max('version') ?? 0);
            $nextVersion = $nextVersion > 0 ? $nextVersion + 1 : 1;

            $version = new Version([
                'idmotivoactualizacion' => $motivoActualizacion->id,
                'version' => $nextVersion,
                'fechahoracreacion' => Carbon::now(),
                'cerrada' => true,
            ]);
            $version->save();
        }

        return $version;
    }

    private function actualizacionAlreadyInsertada(int $idSucursal, ActualizacionIdentifierDTO $actualizacionIdentifierDTO): bool
    {
        $query = VersionActualizacion::query()
            ->join('versiones', 'versionesactualizacion.idversion', '=', 'versiones.id')
            ->where('versionesactualizacion.idsucursal', $idSucursal)
            ->where('versiones.idmotivoactualizacion', $actualizacionIdentifierDTO->codigoMotivoActualizacion->value)
            ->where(function (Builder $w) {
                $w->where('versionesactualizacion.actualizada', '<>', 1)
                    ->orWhereNull('versionesactualizacion.actualizada');
            });

        if ($actualizacionIdentifierDTO->idItem !== null) {
            $query->where('versionesactualizacion.iditem', $actualizacionIdentifierDTO->idItem);
        }

        if ($actualizacionIdentifierDTO->idFecha !== null) {
            $query->where('versionesactualizacion.idfecha', $actualizacionIdentifierDTO->idFecha->format('Y-m-d H:i:s'));
        }

        if ($actualizacionIdentifierDTO->idUser !== null) {
            $query->where('versionesactualizacion.idusuarioauxiliar', $actualizacionIdentifierDTO->idUser);
        }


        return !blank($query->first());

    }


}
