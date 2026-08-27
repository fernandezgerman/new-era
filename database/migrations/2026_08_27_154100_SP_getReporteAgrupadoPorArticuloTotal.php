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

        DB::unprepared('drop procedure if exists getReporteAgrupadoPorArticuloTotal');

        DB::unprepared("
        CREATE PROCEDURE `getReporteAgrupadoPorArticuloTotal`(in p_ids_sucursales varchar(300),
 in p_ids_usuarios varchar(300),
 in p_ids_listas varchar(300),
 in p_id_rubro bigint(20),
 in p_codigo_articulo varchar(20),
 in p_fecha_desde date,
 in p_fecha_hasta date,
 in p_hora_desde time,
 in p_hora_hasta time,
 in p_id_usuario_login bigint(20),
 IN p_turno TINYINT(4)
 )
begin
DECLARE p_articulo_id BIGINT(20);
DECLARE v_id_desde bigint(20);
DECLARE v_id_hasta bigint(20);

SET v_id_desde = getVentaCacheIdDesde(date(p_fecha_desde));
SET v_id_hasta = getVentaCacheIdHasta(date(date_add(p_fecha_hasta,interval 1 day)));

SELECT id
INTO p_articulo_id
FROM articulos
WHERE codigo = p_codigo_articulo;

SELECT
    suc.nombre as sucursalnombre,
    suc.id as sucursalid,
    DATE_FORMAT(vs.fechaenvio,'%d/%m/%y %H:%i') as fechahora,
    DATE_FORMAT(vs.fechaenvio,'%y%m%d%H:%i') as fechahoraorden,
    (if(cantidad is null,0,cantidad)) as cantidad,
    (if(preciounitario  is null,0,preciounitario * cantidad)) as preciounitario,
    (if(vs.costo is null,0,vs.costo)) as costo,
    (if(vs.costosucursal is null,0,vs.costosucursal * cantidad)) as costosucursal,
    vs.id as idventasucursal
FROM
    (SELECT
    	if(p_turno = 2,
    		if(hour(fechaenvio)< 7,
    			date_add(fechaenvio, interval  (hour(fechaenvio) +1) * -1  hour) ,
    			fechaenvio),
    		fechaenvio) as fechaauxiliar,
    	idarticulo,
    	cantidad,
    	costosucursal,
    	preciounitario,
    	idlista,
    	idusuario,
    	idsucursal,
    	costo,
    	id,
    	fechaenvio
     FROM
    	ventassucursal
    WHERE
      (v_id_desde IS NULL OR id >= v_id_desde) AND
	  (v_id_hasta IS NULL OR id <= v_id_hasta)

    ) as vs
    INNER JOIN articulos as art ON vs.idarticulo = art.id
    INNER JOIN rubros as rbr ON art.idrubro = rbr.id
    INNER JOIN listas as lst ON vs.idlista = lst.id
    INNER JOIN sucursales as suc ON vs.idsucursal = suc.id
    INNER JOIN usuarios as usr ON vs.idusuario = usr.id
    INNER JOIN usuariossucursales as us ON vs.idsucursal = us.idsucursal
WHERE
	us.activo = 1 AND p_id_usuario_login = us.idusuario AND
     (v_id_desde IS NULL OR vs.id >= v_id_desde) AND
	(v_id_hasta IS NULL OR vs.id <= v_id_hasta) AND
    (p_codigo_articulo IS NULL OR art.id = p_articulo_id) AND
    (p_ids_sucursales IS NULL OR INSTR(concat(',',p_ids_sucursales,','),concat(',',suc.id,','))>0 ) AND
    (p_ids_usuarios IS NULL OR INSTR(concat(',',p_ids_usuarios,','),concat(',',usr.id,','))>0 ) AND
    (p_ids_listas IS NULL OR INSTR(concat(',',p_ids_listas,','),concat(',',lst.id,','))>0 ) AND
    (p_id_rubro IS NULL OR p_id_rubro = rbr.id) AND
    (p_fecha_desde IS NULL OR p_fecha_desde <= vs.fechaauxiliar) AND
    (p_fecha_hasta IS NULL OR DATE_ADD(p_fecha_hasta,INTERVAL 1 DAY) > vs.fechaauxiliar) AND
    (p_hora_desde IS NULL OR p_hora_desde <= time(vs.fechaenvio)) AND
    (p_hora_hasta IS NULL OR p_hora_hasta >= time(vs.fechaenvio))AND
    (p_turno IS NULL OR

	   (
	   		p_turno = 1 AND (hour(fechaauxiliar) >= 7 and hour(fechaauxiliar) < 19 )
	   	)
	   	OR
			(p_turno = 2 AND ( hour(fechaauxiliar) >= 19 OR hour(fechaauxiliar) < 7 )
		)

	 )
ORDER BY
    vs.fechaenvio asc;
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists getReporteAgrupadoPorArticuloTotal');
    }
};
