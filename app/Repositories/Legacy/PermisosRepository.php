<?php

namespace App\Repositories\Legacy;

use Illuminate\Support\Facades\DB;

class PermisosRepository
{
    /**
     * Get permissions for a profile.
     *
     * @param int $perfilId The profile ID
     * @param int $todas Whether to include all functions (1) or only those assigned to the profile (0)
     * @param int $empresaId The company ID
     * @return array An array of permissions with function codes as keys and "PERMITIDO" or "RESTRINGIDO" as values
     */
    public function getPermisos(int $perfilId, int $empresaId, bool $todas = true): array
    {
        $permisos = [];

        // This query replicates the logic of the getPerfilFunciones stored procedure
        $funciones = DB::table('funciones as fun')
            ->join('modulos as mdl', 'fun.idmodulo', '=', 'mdl.id')
            ->leftJoin('perfilfuncion as pf', function ($join) use ($perfilId) {
                $join->on('fun.id', '=', 'pf.idfuncion')
                    ->where('pf.idperfil', '=', $perfilId);
            })
            ->select(
                'fun.id as idfuncion',
                DB::raw('CASE WHEN pf.idfuncion IS NULL THEN 0 ELSE 1 END as activo'),
                'fun.codigo',
                'fun.nombre',
                'fun.pagina',
                'mdl.descripcion as modulo',
                'mdl.id as idmodulo',
                'fun.observaciones'
            )
            ->where('fun.activa', '=', 1)
            ->where(function ($query) use ($todas) {
                if (!$todas) {
                    $query->whereNotNull('pf.idperfil');
                }
            })
            ->orderBy('mdl.descripcion')
            ->orderBy('fun.nombre')
            ->get();

        // Build the permissions array
        foreach ($funciones as $funcion) {
            if ($funcion->activo == 1) {
                $permisos[$funcion->codigo] = "PERMITIDO";
            } else {
                $permisos[$funcion->codigo] = "RESTRINGIDO";
            }
        }

        return $permisos;
    }
}
