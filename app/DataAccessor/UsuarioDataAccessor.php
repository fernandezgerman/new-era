<?php

namespace App\DataAccessor;

use App\Models\Funcion;
use App\Models\User;
use App\Models\Modulo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
class UsuarioDataAccessor extends DataAccessorBase
{
    public function __construct(private User $user)
    {

    }

    public function getAllowedSucursales(): Collection
    {
        return DB::table('sucursales')
            ->select('sucursales.id', 'sucursales.nombre')
            ->join('usuariossucursales', 'sucursales.id', '=', 'usuariossucursales.idsucursal')
            ->where('sucursales.activo', 1)
            ->where('usuariossucursales.idusuario', $this->user->id)
            ->get();
    }

    public function getMenu(): Collection
    {
        $empresaId = $this->user->idempresa ?? null;
        $perfilId = $this->user->idperfil ?? null;

        $menues = collect([]);

        $modulos = Modulo::query()->orderBy('descripcion', 'asc')->get();

        foreach ($modulos as $modulo) {
            $modulo->funciones = Funcion::query()
                ->join('perfilfuncion', 'funciones.id', '=', 'perfilfuncion.idfuncion')
                ->join('empresafuncion', 'funciones.id', '=', 'empresafuncion.idfuncion')
                ->where('empresafuncion.activo',1)
                ->where('perfilfuncion.idperfil', $perfilId)
                ->where('menu',1)
                ->where('idempresa',$empresaId)
                ->where('idmodulo',$modulo->id)
                ->orderBy('funciones.nombre', 'asc')
                ->get();

            if ($modulo->funciones->count() > 0) {
                $menues->push($modulo);
            }
        }

        return $menues;
    }

    public function getAlertas(int $alertaTipoId = null)
    {
        $userId = $this->user->id;

        // Equivalent to variables v_numerocaja and v_fechahoraapertura from the SP
        $cajaRow = DB::table('cajas')
            ->selectRaw('MAX(numero) as numerocaja, MAX(fechaapertura) as fechahoraapertura')
            ->where('idusuario', $userId)
            ->where('idsucursal', 2)
            ->first();

        $vNumeroCaja = $cajaRow?->numerocaja ?? null;
        $vFechaHoraApertura = $cajaRow?->fechahoraapertura ?? null;

        // Build query reproducing the stored procedure logic using bound parameters
        $sql = "
            SELECT
                alt.codigo,
                alt.nombre,
                alt.id,
                alt.bloqueante,
                alertas.negro,
                alertas.azul,
                alertas.verde,
                alertas.rojo,
                alertas.amarillo
            FROM alertastipos AS alt
            LEFT JOIN (
                SELECT cantidad, idalertatipo, negro, azul, verde, rojo, amarillo FROM (
                    SELECT
                        COUNT(1) AS cantidad,
                        ale.idalertatipo AS idalertatipo,
                        SUM(IF(ale.color = 'NEGRO', 1, 0)) AS negro,
                        SUM(IF(ale.color = 'AZUL' OR ale.color IS NULL, 1, 0)) AS azul,
                        SUM(IF(ale.color = 'VERDE', 1, 0)) AS verde,
                        SUM(IF(ale.color = 'ROJO', 1, 0)) AS rojo,
                        SUM(IF(ale.color = 'AMARILLO', 1, 0)) AS amarillo
                    FROM alertas AS ale
                    INNER JOIN alertasdestinatarios AS aled ON ale.id = aled.idalerta
                    WHERE aled.idusuario = ?
                      AND aled.fechahoravisto IS NULL
                    GROUP BY ale.idalertatipo
                ) a
                UNION ALL
                SELECT
                    COUNT(1) AS cantidad,
                    1 AS idalertatipo,
                    SUM(IF(mc.idestado = 1 AND mc.idusuario = ?, 1, 0)) AS negro,
                    SUM(IF(mc.idestado = 1 AND mc.idusuariodestino = ?, 1, 0)) AS azul,
                    SUM(IF(mc.idestado = 2 AND mc.idusuario = ?, 1, 0)) AS verde,
                    SUM(IF(mc.idestado = 3 AND mc.idusuario = ?, 1, 0)) AS rojo,
                    0 AS amarillo
                FROM movimientoscaja AS mc
                LEFT JOIN (
                    SELECT fechahoramovimiento, MAX(fechahoraestado) AS fe, idsucursal, idusuario
                    FROM movimientoscajaestado AS mce
                    WHERE mce.idusuario = ? AND mce.idsucursal = 2
                    GROUP BY fechahoramovimiento, idsucursal, idusuario
                ) AS estados
                ON mc.fechahoramovimiento = estados.fechahoramovimiento
                   AND mc.idusuario = estados.idusuario
                   AND mc.idsucursal = estados.idsucursal
                WHERE (
                    (mc.idusuario = ? AND mc.idsucursal = 2 AND (
                        (mc.idestado = 2 AND ? = mc.numerocaja) OR
                        mc.idestado = 1 OR
                        (mc.idestado = 3 AND estados.fe >= ?)
                    ))
                    OR
                    (mc.idusuariodestino = ? AND mc.idestado = 1 AND mc.idsucursaldestino = 2)
                )
            ) AS alertas ON alt.id = alertas.idalertatipo
            WHERE (? IS NULL OR ? = alt.id)
            ORDER BY alt.codigo
        ";

        $bindings = [
            // First subquery (alertas)
            $userId,
            // Second subquery (movimientoscaja counts)
            $userId, // for negro
            $userId, // for azul
            $userId, // for verde
            $userId, // for rojo
            $userId, // for estados subquery filter
            $userId, // mc.idusuario = ? in WHERE
            $vNumeroCaja, // compare numerocaja
            $vFechaHoraApertura, // compare fe >= apertura
            $userId, // idusuariodestino
            // WHERE filter for tipo alerta
            $alertaTipoId,
            $alertaTipoId,
        ];

        $rows = DB::select($sql, $bindings);
        return collect($rows);
    }
}
