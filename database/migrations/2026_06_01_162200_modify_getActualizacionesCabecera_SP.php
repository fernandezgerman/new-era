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

        DB::unprepared('drop procedure if exists getActualizacionesCabecera');

        DB::unprepared("
 CREATE PROCEDURE `getActualizacionesCabecera`(IN `p_idSucursal` BIGINT(20))
BEGIN



	UPDATE versioncola as vc INNER JOIN motivosactualizaciones as ma ON vc.idmotivo = ma.id
  SET vc.estado = 2
  WHERE
      (estado = 0 OR estado IS NULL) AND
      DATE_SUB(vc.fechaapertura,INTERVAL ma.maximaespera * -1 MINUTE) < now();

  SELECT * FROM (
    SELECT
          #vrsa.id,
          max(vrsa.id) as id,
          max(vrs.version) as version,
          suc.id AS sucursalId,
          suc.nombre AS sucursalNombre,
          suc.descripcion AS sucursalDescripcion,
          vrs.idmotivoactualizacion AS motivoActualizacionId,
          ma.codigo AS motivoActualizacionCodigo,
          vrs.id AS idversion,
          max(vrsa.id) as maxIdActualizacion,
          CASE ma.codigo #CAmpo orden basado en prioridad de motivos de movimientos
			WHEN 'GET-MOVCAJA' THEN 1
          	WHEN 'GET-ESTMOVCAJA' THEN 2
          	WHEN 'GET-MODSBRCAJA' THEN 3
          	WHEN 'GET-ACOMPRA' THEN 4
          	WHEN 'GET-PRECIOS-TMP' THEN 5
          	ELSE 10
          	END as orden
      FROM
          (((versiones AS vrs INNER JOIN versionesactualizacion  AS vrsa ON vrs.id = vrsa.idversion)
          INNER JOIN sucursales AS suc ON vrsa.idsucursal = suc.id)
          INNER JOIN motivosactualizaciones AS ma ON vrs.idmotivoactualizacion = ma.id)
          LEFT JOIN (SELECT COUNT(1) totalencola,idmotivo FROM versioncola WHERE estado = 0 OR estado IS NULL  GROUP BY idmotivo )as resultadoencola
          ON vrs.idmotivoactualizacion = resultadoencola.idmotivo
          LEFT JOIN excepcionesactualizacion as ex_ac ON suc.id = ex_ac.idsucursal AND ma.id = ex_ac.idmotivoactualizacion
      WHERE
          ex_ac.idsucursal IS NULL AND
          (vrsa.actualizada = 0 OR vrsa.actualizada IS NULL) AND
          (ma.maximocola = 0 OR ma.maximocola > totalencola OR totalencola IS NULL ) AND
          vrsa.idsucursal = p_idSucursal AND
          vrsa.cerrada = 1 AND vrs.idmotivoactualizacion <> 18
      GROUP BY
          suc.nombre ,
          suc.descripcion ,
          vrs.idmotivoactualizacion,
          ma.codigo,
          vrs.id,
          suc.id
    UNION ALL
     SELECT
          -18 ,
          1 ,
          am.idsucursal,
          suc.nombre AS sucursalNombre,
          suc.descripcion AS sucursalDescripcion,
          18,
          'GET-ARTSTKVSB',
          1,
          max(am.id),
          9 as orden
     FROM

        ((SELECT MAX(fechahora) as fecha, idsucursal, idarticulo,max(id) as id FROM act_articulosstockvisiblemodificacion WHERE cerrada = 1 GROUP BY idsucursal, idarticulo)
        as am
        LEFT JOIN
        (SELECT MAX(fechahora) as fecha, idsucursal, idarticulo,max(id) as id FROM act_articulosstockvisibleactualizados as am GROUP BY idsucursal, idarticulo)
        as aa ON am.idarticulo = aa.idarticulo AND aa.idsucursal = am.idsucursal)
       INNER JOIN sucursales as suc ON am.idsucursal = suc.id
       LEFT JOIN excepcionesactualizacion as ex_ac ON p_idSucursal = ex_ac.idsucursal AND ex_ac.idmotivoactualizacion = 18
     WHERE
        ex_ac.idsucursal IS NULL AND
        am.idsucursal = p_idSucursal AND
        (am.fecha > aa.fecha OR aa.fecha IS NULL)
      GROUP BY
        am.idsucursal,
        suc.nombre,
        suc.descripcion
    )as tabla
    ORDER BY orden asc, id asc
    limit 0,1
     ;
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists getActualizacionesCabecera');

        DB::unprepared("
 CREATE PROCEDURE getActualizacionesCabecera(IN `p_idSucursal` BIGINT(20))
BEGIN
  UPDATE versioncola as vc INNER JOIN motivosactualizaciones as ma ON vc.idmotivo = ma.id
  SET vc.estado = 2
  WHERE
      (estado = 0 OR estado IS NULL) AND
      DATE_SUB(vc.fechaapertura,INTERVAL ma.maximaespera * -1 MINUTE) < now();

  SELECT * FROM (
    SELECT
          #vrsa.id,
          max(vrsa.id) as id,
          max(vrs.version) as version,
          suc.id AS sucursalId,
          suc.nombre AS sucursalNombre,
          suc.descripcion AS sucursalDescripcion,
          vrs.idmotivoactualizacion AS motivoActualizacionId,
          ma.codigo AS motivoActualizacionCodigo,
          vrs.id AS idversion,
          max(vrsa.id) as maxIdActualizacion
      FROM
          (((versiones AS vrs INNER JOIN versionesactualizacion  AS vrsa ON vrs.id = vrsa.idversion)
          INNER JOIN sucursales AS suc ON vrsa.idsucursal = suc.id)
          INNER JOIN motivosactualizaciones AS ma ON vrs.idmotivoactualizacion = ma.id)
          LEFT JOIN (SELECT COUNT(1) totalencola,idmotivo FROM versioncola WHERE estado = 0 OR estado IS NULL  GROUP BY idmotivo )as resultadoencola
          ON vrs.idmotivoactualizacion = resultadoencola.idmotivo
          LEFT JOIN excepcionesactualizacion as ex_ac ON suc.id = ex_ac.idsucursal AND ma.id = ex_ac.idmotivoactualizacion
      WHERE
          ex_ac.idsucursal IS NULL AND
          (vrsa.actualizada = 0 OR vrsa.actualizada IS NULL) AND
          (ma.maximocola = 0 OR ma.maximocola > totalencola OR totalencola IS NULL ) AND
          vrsa.idsucursal = p_idSucursal AND
          vrsa.cerrada = 1 AND vrs.idmotivoactualizacion <> 18
      GROUP BY
          suc.nombre ,
          suc.descripcion ,
          vrs.idmotivoactualizacion,
          ma.codigo,
          vrs.id,
          suc.id
    UNION ALL
     SELECT
          -18 ,
          1 ,
          am.idsucursal,
          suc.nombre AS sucursalNombre,
          suc.descripcion AS sucursalDescripcion,
          18,
          'GET-ARTSTKVSB',
          1,
          max(am.id)
     FROM

        ((SELECT MAX(fechahora) as fecha, idsucursal, idarticulo,max(id) as id FROM act_articulosstockvisiblemodificacion WHERE cerrada = 1 GROUP BY idsucursal, idarticulo)
        as am
        LEFT JOIN
        (SELECT MAX(fechahora) as fecha, idsucursal, idarticulo,max(id) as id FROM act_articulosstockvisibleactualizados as am GROUP BY idsucursal, idarticulo)
        as aa ON am.idarticulo = aa.idarticulo AND aa.idsucursal = am.idsucursal)
       INNER JOIN sucursales as suc ON am.idsucursal = suc.id
       LEFT JOIN excepcionesactualizacion as ex_ac ON p_idSucursal = ex_ac.idsucursal AND ex_ac.idmotivoactualizacion = 18
     WHERE
        ex_ac.idsucursal IS NULL AND
        am.idsucursal = p_idSucursal AND
        (am.fecha > aa.fecha OR aa.fecha IS NULL)
      GROUP BY
        am.idsucursal,
        suc.nombre,
        suc.descripcion
    )as tabla
    ORDER BY id asc
    limit 0,1
     ;
END");
    }
};
