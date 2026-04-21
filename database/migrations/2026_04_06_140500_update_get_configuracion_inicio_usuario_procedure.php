<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $procedure = "
            CREATE PROCEDURE `getConfiguracionInicioUsuario`(in p_idusuario bigint(20))
            begin
              declare v_idperfil bigint(20);
              declare v_idempresa bigint(20);

              SELECT
                idperfil, idempresa
              INTO
                v_idperfil,v_idempresa
              FROM
                usuarios
              WHERE
                id = p_idusuario;

              SELECT
              	ii.id as iditem,
                ii.codigo,
                ii.codigofuncion,
                ii.descripcion,
                ii.nombre,
                uii.habilitado,
                uii.numeroasociado
              FROM
                 (itemsinicio AS ii LEFT JOIN usuarioitemsinicio as uii ON ii.id = uii.iditem AND uii.idusuario =  p_idusuario)
                 INNER JOIN
                 ((funciones as fun INNER JOIN perfilfuncion as pf ON fun.id = pf.idfuncion) INNER JOIN
                 empresafuncion as ef ON  fun.id = ef.idfuncion AND ef.activo = 1) ON ii.codigofuncion = fun.codigo
              WHERE
                ef.idempresa = v_idempresa AND
                pf.idperfil = v_idperfil AND
                ii.activo = 1  and
            	not ifnull(ii.neweramenu,0) = 1
              ORDER BY
                ii.orden asc;
            END
        ";

        DB::unprepared("DROP PROCEDURE IF EXISTS `getConfiguracionInicioUsuario` ");
        DB::unprepared($procedure);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $procedure = "
            CREATE PROCEDURE `getConfiguracionInicioUsuario`(in p_idusuario bigint(20))
            begin
              declare v_idperfil bigint(20);
              declare v_idempresa bigint(20);

              SELECT
                idperfil, idempresa
              INTO
                v_idperfil,v_idempresa
              FROM
                usuarios
              WHERE
                id = p_idusuario;

              SELECT
              	ii.id as iditem,
                ii.codigo,
                ii.codigofuncion,
                ii.descripcion,
                ii.nombre,
                uii.habilitado,
                uii.numeroasociado
              FROM
                 (itemsinicio AS ii LEFT JOIN usuarioitemsinicio as uii ON ii.id = uii.iditem AND uii.idusuario =  p_idusuario)
                 INNER JOIN
                 ((funciones as fun INNER JOIN perfilfuncion as pf ON fun.id = pf.idfuncion) INNER JOIN
                 empresafuncion as ef ON  fun.id = ef.idfuncion AND ef.activo = 1) ON ii.codigofuncion = fun.codigo
              WHERE
                ef.idempresa = v_idempresa AND
                pf.idperfil = v_idperfil AND
                ii.activo = 1
              ORDER BY
                ii.orden asc;
            END
        ";

        DB::unprepared("DROP PROCEDURE IF EXISTS `getConfiguracionInicioUsuario` ");
        DB::unprepared($procedure);
    }
};
