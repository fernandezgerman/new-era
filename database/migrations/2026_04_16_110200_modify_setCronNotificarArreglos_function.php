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

        DB::unprepared('DROP procedure IF EXISTS `setCronNotificarArreglos`');

        DB::unprepared("
CREATE PROCEDURE `setCronNotificarArreglos`()
begin


    DECLARE vb_termina BOOL DEFAULT FALSE;
    DECLARE v_fecha_desde datetime;
    DECLARE v_fecha_aux datetime;
    DECLARE v_rendicion_id bigint(20);



    DECLARE v_arreglos CURSOR FOR
	SELECT
        idrendicion,
        max(fechahasta.valorfecha)
    FROM
		rendicionstockdetalle as rsd
        inner join rendicionesstock AS rs on rsd.idrendicion = rs.id,
        (SELECT valorfecha from parametros where clave='ULIMA_FECHA_ARREGLO') as fechahasta,
        (SELECT valorfecha from parametros where clave='ULIMA_FECHA_ARREGLO_ANTERIOR') as fechadesde,
        (select min(id) as minid from rendicionesstock where fechaapertura > date(now()) ) as minTable
	WHERE
		idestado = 10 and rs.id >= minTable.minid
	GROUP BY
		idrendicion
	HAVING

		max(fechahasta.valorfecha) >= max(fechahora) AND
        max(fechadesde.valorfecha) < max(fechahora) AND
		(sum(if(valorrendido is null,0,valorrendido) - if(valorsistema is null,0,valorsistema)) > 100000 or
         sum(if(valorrendido is null,0,valorrendido) - if(valorsistema is null,0,valorsistema)) < -100000);


    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET vb_termina = TRUE;



    SELECT valorfecha INTO v_fecha_desde FROM parametros WHERE clave = 'ULIMA_FECHA_ARREGLO';

	OPEN v_arreglos;
	   Recorre_Cursor: LOOP
			FETCH v_arreglos INTO v_rendicion_id,v_fecha_aux;
			IF vb_termina THEN
				LEAVE Recorre_Cursor;
			END IF;
            SET v_fecha_desde = v_fecha_aux;
			CALL `insAlertaArregloDeStock`(v_rendicion_id);


		END LOOP;
	  CLOSE v_arreglos;

	UPDATE parametros SET valorfecha = v_fecha_desde WHERE clave = 'ULIMA_FECHA_ARREGLO_ANTERIOR';
    UPDATE parametros SET valorfecha = now() WHERE clave = 'ULIMA_FECHA_ARREGLO';

END ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists setCronNotificarArreglos');

        DB::unprepared("
CREATE PROCEDURE `setCronNotificarArreglos`()
begin


    DECLARE vb_termina BOOL DEFAULT FALSE;
    DECLARE v_fecha_desde datetime;
    DECLARE v_fecha_aux datetime;
    DECLARE v_rendicion_id bigint(20);
    DECLARE v_arreglos CURSOR FOR
	SELECT
        idrendicion,
        max(fechahasta.valorfecha)
    FROM
		rendicionstockdetalle as rsd
        inner join rendicionesstock AS rs on rsd.idrendicion = rs.id,
        (SELECT valorfecha from parametros where clave='ULIMA_FECHA_ARREGLO') as fechahasta,
        (SELECT valorfecha from parametros where clave='ULIMA_FECHA_ARREGLO_ANTERIOR') as fechadesde
	WHERE
		idestado = 10
	GROUP BY
		idrendicion
	HAVING
		max(fechahasta.valorfecha) >= max(fechahora) AND
        max(fechadesde.valorfecha) < max(fechahora) AND
		(sum(if(valorrendido is null,0,valorrendido) - if(valorsistema is null,0,valorsistema)) > 100 or
         sum(if(valorrendido is null,0,valorrendido) - if(valorsistema is null,0,valorsistema)) < -1500);

    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET vb_termina = TRUE;


    SELECT valorfecha INTO v_fecha_desde FROM parametros WHERE clave = 'ULIMA_FECHA_ARREGLO';

	OPEN v_arreglos;
	   Recorre_Cursor: LOOP
			FETCH v_arreglos INTO v_rendicion_id,v_fecha_aux;
			IF vb_termina THEN
				LEAVE Recorre_Cursor;
			END IF;
            SET v_fecha_desde = v_fecha_aux;
			CALL `insAlertaArregloDeStock`(v_rendicion_id);


		END LOOP;
	  CLOSE v_arreglos;

	UPDATE parametros SET valorfecha = v_fecha_desde WHERE clave = 'ULIMA_FECHA_ARREGLO_ANTERIOR';
    UPDATE parametros SET valorfecha = now() WHERE clave = 'ULIMA_FECHA_ARREGLO';
END");
    }
};


