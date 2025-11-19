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

        DB::unprepared('DROP PROCEDURE IF EXISTS `getRentabilidadSucursal`');

        DB::unprepared("
CREATE  PROCEDURE `getRentabilidadSucursal`(in p_sucursales varchar(500),
                                         in p_fechadesde datetime,
                                         in p_fechahasta datetime,
                                         in p_horadesde datetime,
                                         in p_horahasta datetime,
                                         in p_rubroid bigint(20),
                                         in p_articulocodigo varchar(200),
                                         in p_usuario_logueado bigint(20),
                                         in p_orden tinyint(4),
                                         in p_marcaid bigint(20)
                                         )
BEGIN

	DECLARE v_id_desde bigint(20);
    DECLARE v_id_hasta bigint(20);

    SET v_id_desde = getVentaCacheIdDesde(date(p_fechadesde));
    SET v_id_hasta = getVentaCacheIdHasta(date(p_fechahasta));




SELECT
  id,
  sucursalnombre,
  ((tventa - tcosto) / tcosto * 100) as porcentajeGanancia,
  ((tventa - tcosto) / tventa * 100) as rentabilidad,
  (tventa - tcosto) as ganancia,
  tcosto as costo,
  tventa as venta,
  treg,
  tregconimp,
  tcostoimp,
  ((tventa - tcostoimp) / tcostoimp * 100) as porcentajeGananciaImp,
  ((tventa - tcostoimp) / tventa * 100) as rentabilidadImp,
  (tventa - tcostoimp) as gananciaImp
FROM
  (
    SELECT
      suc.id,
      suc.nombre as sucursalnombre,
      SUM(vs.costosucursal * vs.cantidad ) as tcosto,
      SUM(vs.preciounitario * vs.cantidad) as tventa,
      sum(vs.cantidad * if(cc.importe is null,vs.costosucursal,cc.importe)) as tcostoimp,
      sum(if(cc.importe is null,0,1)) as tregconimp,
      count(1) as treg
    FROM
      ((sucursales as suc INNER JOIN ventassucursal as vs ON suc.id = vs.idsucursal)
      INNER JOIN usuariossucursales as us ON vs.idsucursal = us.idsucursal)
      INNER JOIN articulos as art ON vs.idarticulo = art.id
      LEFT JOIN ventassucursalextra as vse ON vs.id = vse.idventa
      LEFT JOIN comprasdetalle as cd on vse.idcompradetalle = cd.id
      LEFT JOIN costoscompra as cc ON cd.id = cc.iddetalle AND cc.idtipocosto = 1
    WHERE
      (v_id_desde IS NULL OR vs.id >= v_id_desde) AND
      (v_id_hasta IS NULL OR vs.id <= v_id_hasta) AND
      us.activo = 1 AND p_usuario_logueado = us.idusuario AND
      (p_sucursales IS null or INSTR(p_sucursales,concat(',',suc.id,','))>0 )and
      (p_rubroid IS NULL OR art.idrubro = p_rubroid) AND
      (p_marcaid IS NULL OR art.idmarca = p_marcaid) AND
      (p_articulocodigo IS NULL OR art.codigo = p_articulocodigo) AND
      (p_fechadesde is null or p_fechadesde  <= vs.fechacreacion)AND
      (p_fechahasta is null or p_fechahasta   >= vs.fechacreacion) AND
      (p_horadesde IS NULL OR time(vs.fechacreacion) >= time(p_horadesde)) AND
      (p_horahasta IS NULL OR time(vs.fechacreacion) <= time(p_horahasta))
    GROUP BY
      suc.id,
      suc.nombre
    )as tabla
ORDER BY CASE p_orden
  WHEN 0 THEN
     sucursalnombre
  WHEN 3 THEN
     ((tventa - tcosto) / tcosto)
  WHEN 4 THEN
     (tventa - tcosto )
end
;
END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Down simply drops the procedure; if you want to restore previous version, paste the old body here.
        DB::unprepared('DROP PROCEDURE IF EXISTS `getReporteArreglosPorSemana`');
    }
};
