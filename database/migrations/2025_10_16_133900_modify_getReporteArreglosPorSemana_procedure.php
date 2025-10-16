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

        DB::unprepared('DROP PROCEDURE IF EXISTS `getReporteArreglosPorSemana`');

        DB::unprepared("
CREATE PROCEDURE `getReporteArreglosPorSemana`(
in p_ids_sucursales varchar(300),
 in p_ids_usuarios varchar(300),
 in p_ids_rubros varchar(300),
 in p_codigo_articulo varchar(20),
 in p_fecha_hasta date,
 in p_hora_desde time,
 in p_hora_hasta time,
 in p_semanas bigint(20)
)
BEGIN
    DECLARE v_semana_desde BIGINT(20);
    DECLARE v_anio_desde BIGINT(20);
    DECLARE v_semana_hasta BIGINT(20);
    DECLARE v_anio_hasta BIGINT(20);
    DECLARE p_articulo_id BIGINT(20);
    DECLARE v_dias_semanas BIGINT(20);
    DECLARE v_ultima_semana BIGINT(20);

   	DECLARE v_fecha_desde DATE;
  	DECLARE v_fecha_hasta DATE;

    IF p_semanas IS NULL THEN
        SELECT 7 * 7 INTO v_dias_semanas;
    ELSE
        SELECT (p_semanas - 1) * 7 INTO v_dias_semanas;
    END IF;



   	SET v_fecha_desde = adddate(adddate(p_fecha_hasta,interval v_dias_semanas * -1 day), INTERVAL 2-DAYOFWEEK(adddate(p_fecha_hasta,interval v_dias_semanas * -1 day)) DAY);
    SET v_fecha_hasta = adddate(p_fecha_hasta, INTERVAL 8-DAYOFWEEK(p_fecha_hasta) DAY);

    SELECT id
    INTO p_articulo_id
    FROM articulos
    WHERE codigo = p_codigo_articulo;



    SELECT week(date_add(concat(year(p_fecha_hasta),'-01-01'), interval -1 DAY),3)
    INTO v_ultima_semana;



    SELECT
        rbr.nombre as rubroNombre,
        rbr.id as rubroId,
        sum(cantidad) as cantidad,
        sum(preciounitario) as preciounitario,
        sum(costo) as costo,
        semana,
        anio,
        anioPrimerDia,
        primerDiaSemana,
        ultimoDiaSemana,
        sum(pendiente) as cantidadPendientes,
        sum(terminado) as cantidadTerminados
    FROM
        (
        SELECT
            rbr.nombre as rubroNombre,
            rbr.id as rubroId,
            (rsd.valorrendido - rsd.valorsistema) as cantidad,
            if(valorPrecio  is null,0,valorPrecio ) as preciounitario,
            if(rsd.valorCosto is null,0,rsd.valorCosto) as costo ,
            week(rs.fechaapertura,3) as semana ,

			year(DATE_FORMAT(TIMESTAMPADD(DAY,(0-WEEKDAY(rs.fechaapertura)),rs.fechaapertura),'%d/%m/%y')) as anio,
            DATE_FORMAT(TIMESTAMPADD(DAY,(0-WEEKDAY(rs.fechaapertura)),rs.fechaapertura),'%d/%m/%y') as primerDiaSemana,
            DATE_FORMAT(TIMESTAMPADD(DAY,(6-WEEKDAY(rs.fechaapertura)),rs.fechaapertura),'%d/%m/%y') as ultimoDiaSemana ,
            DATE_FORMAT(TIMESTAMPADD(DAY,(0-WEEKDAY(rs.fechaapertura)),rs.fechaapertura),'%Y') as anioPrimerDia ,

            if(rs.idestado = 10,1,0) as terminado,
            if(rs.idestado = 1,1,0) as pendiente
        FROM
            rendicionesstock as rs
            INNER JOIN usuarios as usr ON rs.idusuario = usr.id
            INNER JOIN rubros as rbr ON rs.idrubro = rbr.id
            INNER JOIN sucursales as suc ON rs.idsucursal = suc.id
            INNER JOIN estadosmovimientoscaja AS estados ON rs.idestado = estados.id
            left JOIN (
                    SELECT
                        sum(if(cantidadrendida is null,0,cantidadrendida)) as valorrendido,
                        sum(if(cantidadsistema is null,0,cantidadsistema))  as valorsistema,
                        sum( (if(cantidadrendida is null,0,cantidadrendida) - if(cantidadsistema is null,0,cantidadsistema)) * ( costo)) as valorCosto,
                        sum( (if(cantidadrendida is null,0,cantidadrendida) - if(cantidadsistema is null,0,cantidadsistema)) * ( precioventa)) as valorPrecio,
                        rsd2.idrendicion
                    FROM rendicionstockdetalle AS rsd2
                    	INNER JOIN rendicionesstock as rs2 on rsd2.idrendicion = rs2.id
                    WHERE
                        (p_codigo_articulo IS NULL OR rsd2.idarticulo = p_articulo_id) AND
                        (p_ids_sucursales IS NULL OR INSTR(concat(',',p_ids_sucursales,','),concat(',',rs2.idsucursal,','))>0 ) AND
			            (p_ids_usuarios IS NULL OR INSTR(concat(',',p_ids_usuarios,','),concat(',',rs2.idusuario,','))>0 ) AND
			            (p_ids_rubros IS NULL OR INSTR(concat(',',p_ids_rubros,','),concat(',',rs2.idrubro,','))>0 ) AND
			            date(rs2.fechaapertura) >= v_fecha_desde AND
			            date(rs2.fechaapertura) <= v_fecha_hasta AND
			            (p_hora_desde IS NULL OR p_hora_desde <= time(rs2.fechaapertura)) AND
			            (p_hora_hasta IS NULL OR p_hora_hasta >= time(rs2.fechaapertura))
                    GROUP BY
                        rsd2.idrendicion
                        ) as rsd ON rs.id = rsd.idrendicion

        WHERE

            (p_ids_sucursales IS NULL OR INSTR(concat(',',p_ids_sucursales,','),concat(',',suc.id,','))>0 ) AND
            (p_ids_usuarios IS NULL OR INSTR(concat(',',p_ids_usuarios,','),concat(',',usr.id,','))>0 ) AND
            (p_ids_rubros IS NULL OR INSTR(concat(',',p_ids_rubros,','),concat(',',rbr.id,','))>0 ) AND
            date(rs.fechaapertura) >= v_fecha_desde AND
            date(rs.fechaapertura) <= v_fecha_hasta AND

            (p_hora_desde IS NULL OR p_hora_desde <= time(rs.fechaapertura)) AND
            (p_hora_hasta IS NULL OR p_hora_hasta >= time(rs.fechaapertura))
    ) as tabla
    RIGHT JOIN rubros as rbr on tabla.rubroId = rbr.id
    WHERE
        rbr.esrubrogastos = 0 or rbr.esrubrogastos is null
    GROUP BY
        rbr.id,rbr.nombre,semana,anio,primerDiaSemana,ultimoDiaSemana,anioPrimerDia

    ORDER BY
        rubroNombre,anio,semana
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
