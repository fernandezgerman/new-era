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

        DB::unprepared('DROP procedure IF EXISTS `getAlertasDetalle`');

        DB::unprepared("
CREATE  PROCEDURE `getAlertasDetalle`(
    IN p_idusuario BIGINT(20),
    IN p_idalertatipo BIGINT(20),
    IN p_todos TINYINT)
BEGIN
	declare v_numerocaja BIGINT(30);
    declare v_fechahoraapertura DATETIME;
IF p_idalertatipo = 1 THEN



SELECT
    MAX(numero),
    max(fechaapertura)
INTO
    v_numerocaja,
    v_fechahoraapertura
FROM
    cajas
WHERE
    idusuario = p_idusuario AND
    idsucursal = 2;

SELECT
    alt.id,
    alt.nombre,
    mc.idusuario as idAlerta,
    mc.fechahoramovimiento AS fechahora,
    DATE_FORMAT(mc.fechahoramovimiento,'%d/%m/%Y %H:%i') as fecha,
    if(idestado = 1 and mc.idusuario = p_idusuario,concat('Pendiente para ',usrd.apellido,' ',usrd.nombre,'. ($',mc.importe,')'),
       if(idestado = 1 and idusuariodestino = p_idusuario,concat('Movimiento para USTED de ',usre.apellido,' ',usre.nombre,'. ($',mc.importe,')'),
          if(idestado = 2 and mc.idusuario = p_idusuario,concat(usrd.apellido,' ',usrd.nombre,' APROBO el movimiento por ($',mc.importe,')'),
             concat(usrd.apellido,' ',usrd.nombre,' RECHAZO el movimiento por ($',mc.importe,')')
          )
       )
    ) as descripcion,
    1 as idalertatipo,
    if(idestado = 1 and mc.idusuario = p_idusuario,'NEGRO',
       if(idestado = 1 and mc.idusuariodestino = p_idusuario,'AZUL',
          if(idestado = 2 and mc.idusuario = p_idusuario,'VERDE',
             'ROJO'
          )
       )
    ) as color
FROM
    alertastipos as alt,
    movimientoscaja as mc
        LEFT JOIN usuarios as usrd ON mc.idusuariodestino = usrd.id
        LEFT JOIN usuarios as usre ON mc.idusuario = usre.id

    LEFT JOIN (SELECT fechahoramovimiento,MAX(fechahoraestado) as fe, idsucursal, idusuario
    FROM movimientoscajaestado as mce

    WHERE idusuario = p_idusuario and idsucursal = 2
    GROUP BY fechahoramovimiento,idsucursal, idusuario) as estados
on mc.fechahoramovimiento = estados.fechahoramovimiento AND
    mc.idusuario = estados.idusuario AND
    mc.idsucursal = estados.idsucursal
WHERE
    alt.id = 1 AND
    (
    (mc.idusuario = p_idusuario AND mc.idsucursal = 2 AND (
    (idestado = 2 AND v_numerocaja =  numerocaja) OR
    idestado = 1 OR
    (idestado = 3 AND fe >= v_fechahoraapertura)
    )
    ) OR
    (idusuariodestino = p_idusuario AND idestado= 1 AND mc.idsucursaldestino = 2
    )
    )

ORDER BY
    mc.fechahoramovimiento desc;
ELSE

SELECT
    alt.id,
    alt.nombre,
    ale.id as idAlerta,
    fechahora,
    DATE_FORMAT(fechahora,'%d/%m/%Y %H:%i') as fecha,
    descripcion,
    color,
    aled.id as idalertadestinatario,
    fechahoravisto,
    DATE_FORMAT(fechahoravisto,'%d/%m/%Y %H:%i') as fechavisto
FROM
    alertastipos as alt
        INNER JOIN alertas as ale ON alt.id = ale.idalertatipo
        INNER JOIN alertasdestinatarios as aled ON ale.id = aled.idalerta
WHERE aled.idusuario = p_idusuario AND
/*    (fechahoravisto IS NULL or  p_todos = 1) AND*/
    alt.id = p_idalertatipo
ORDER BY
    fechahora desc,alt.id,aled.id
LIMIT 100;

END IF;
END ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists getAlertasDetalle');

        DB::unprepared("
CREATE PROCEDURE `getAlertasDetalle`(
    IN p_idusuario BIGINT(20),
    IN p_idalertatipo BIGINT(20),
    IN p_todos TINYINT)
BEGIN
	declare v_numerocaja BIGINT(30);
    declare v_fechahoraapertura DATETIME;
IF p_idalertatipo = 1 THEN



SELECT
    MAX(numero),
    max(fechaapertura)
INTO
    v_numerocaja,
    v_fechahoraapertura
FROM
    cajas
WHERE
    idusuario = p_idusuario AND
    idsucursal = 2;

SELECT
    alt.id,
    alt.nombre,
    mc.idusuario as idAlerta,
    mc.fechahoramovimiento AS fechahora,
    DATE_FORMAT(mc.fechahoramovimiento,'%d/%m/%Y %H:%i') as fecha,
    if(idestado = 1 and mc.idusuario = p_idusuario,concat('Pendiente para ',usrd.apellido,' ',usrd.nombre,'. ($',mc.importe,')'),
       if(idestado = 1 and idusuariodestino = p_idusuario,concat('Movimiento para USTED de ',usre.apellido,' ',usre.nombre,'. ($',mc.importe,')'),
          if(idestado = 2 and mc.idusuario = p_idusuario,concat(usrd.apellido,' ',usrd.nombre,' APROBO el movimiento por ($',mc.importe,')'),
             concat(usrd.apellido,' ',usrd.nombre,' RECHAZO el movimiento por ($',mc.importe,')')
          )
       )
    ) as descripcion,
    1 as idalertatipo,
    if(idestado = 1 and mc.idusuario = p_idusuario,'NEGRO',
       if(idestado = 1 and mc.idusuariodestino = p_idusuario,'AZUL',
          if(idestado = 2 and mc.idusuario = p_idusuario,'VERDE',
             'ROJO'
          )
       )
    ) as color
FROM
    alertastipos as alt,
    movimientoscaja as mc
        LEFT JOIN usuarios as usrd ON mc.idusuariodestino = usrd.id
        LEFT JOIN usuarios as usre ON mc.idusuario = usre.id

    LEFT JOIN (SELECT fechahoramovimiento,MAX(fechahoraestado) as fe, idsucursal, idusuario
    FROM movimientoscajaestado as mce

    WHERE idusuario = p_idusuario and idsucursal = 2
    GROUP BY fechahoramovimiento,idsucursal, idusuario) as estados
on mc.fechahoramovimiento = estados.fechahoramovimiento AND
    mc.idusuario = estados.idusuario AND
    mc.idsucursal = estados.idsucursal
WHERE
    alt.id = 1 AND
    (
    (mc.idusuario = p_idusuario AND mc.idsucursal = 2 AND (
    (idestado = 2 AND v_numerocaja =  numerocaja) OR
    idestado = 1 OR
    (idestado = 3 AND fe >= v_fechahoraapertura)
    )
    ) OR
    (idusuariodestino = p_idusuario AND idestado= 1 AND mc.idsucursaldestino = 2
    )
    )

ORDER BY
    mc.fechahoramovimiento desc;
ELSE

SELECT
    alt.id,
    alt.nombre,
    ale.id as idAlerta,
    fechahora,
    DATE_FORMAT(fechahora,'%d/%m/%Y %H:%i') as fecha,
    descripcion,
    color,
    aled.id as idalertadestinatario,
    fechahoravisto,
    DATE_FORMAT(fechahoravisto,'%d/%m/%Y %H:%i') as fechavisto
FROM
    alertastipos as alt
        INNER JOIN alertas as ale ON alt.id = ale.idalertatipo
        INNER JOIN alertasdestinatarios as aled ON ale.id = aled.idalerta
WHERE aled.idusuario = p_idusuario AND
    (fechahoravisto IS NULL or  p_todos = 1) AND
    alt.id = p_idalertatipo
ORDER BY
    fechahora desc,alt.id,aled.id;
END IF;

END ");
    }
};


