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

        DB::unprepared('DROP procedure IF EXISTS `insAlertaArregloDeStock`');

        DB::unprepared("
CREATE procedure `insAlertaArregloDeStock`(IN p_idarreglo BIGINT(20))
begin

	DECLARE v_usuario VARCHAR(200);
    DECLARE v_sucursal VARCHAR(200);
    DECLARE v_sucursal_id bigint(20);
    DECLARE v_rubro VARCHAR(200);
    DECLARE v_diferencia DECIMAL(10,3);
    DECLARE v_idalerta BIGINT(20);
    DECLARE v_idalertainforme BIGINT(20);
    DECLARE v_fechahora DATETIME;
    DECLARE v_color VARCHAR(20);




    SELECT
		sum(if(valorrendido is null,0,valorrendido) - if(valorsistema is null,0,valorsistema)) AS diferencia,
        upper(concat(usr.nombre,' ',usr.apellido)),
        upper(suc.nombre),
        upper(rbr.nombre),
        max(rsd.fechahora) as fecha,
        suc.id
	INTO
		v_diferencia,
		v_usuario,
		v_sucursal,
        v_rubro,
        v_fechahora,
        v_sucursal_id
    FROM
		rendicionstockdetalle as rsd
        inner join rendicionesstock as rs on rsd.idrendicion = rs.id
        inner join sucursales as suc on rs.idsucursal = suc.id
        inner join usuarios as usr on rs.idusuario = usr.id
        inner join rubros as rbr on rs.idrubro = rbr.id
	WHERE
		idrendicion = p_idarreglo
	GROUP BY
		usr.nombre,usr.apellido,suc.nombre,rbr.nombre, suc.id;


    #Notifica arreglos positivos mayores a un monto
    IF v_diferencia > 100000 THEN

		INSERT INTO alertas(idalertatipo,fechahora,descripcion,color)
		VALUES(2,
				v_fechahora,
				concat(v_usuario,' cargo un arreglo positivo ($',v_diferencia,') en ' ,v_sucursal,' del rubro ',v_rubro),
				'AMARILLO'
				);

		set v_idalerta =@@identity;

		INSERT INTO alertasdestinatarios(idalerta,idusuario)
		SELECT
			v_idalerta,
			usr.id
		FROM
			usuarios as usr
			INNER JOIN usuariossucursales as us ON usr.id = us.idusuario AND us.idsucursal = v_sucursal_id AND us.activo = 1
		WHERE
			idperfil in (8,26,19, 33) and usr.activo  =1;


		INSERT INTO alertasinformes(idalerta,codigopagina,titulo)values(v_idalerta,'rendstockaver','Ver arreglos de stock');
		set v_idalertainforme=@@identity;

		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'busqueda','busqueda');
		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'inpPaginaVolver','inicio');
		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'inpRendicionId',p_idarreglo);
	end if;

	#Notifica como alerta arreglos menores a este monto
    IF v_diferencia < -100000 THEN

		SET v_color = 'NEGRO';
		#Alerta roja si el arreglo es menor a este valor
        if v_diferencia < -150000 THEN
			SET v_color = 'ROJO';
		end if;
		INSERT INTO alertas(idalertatipo,fechahora,descripcion,color)
		VALUES(2,
				now(),
				concat(v_usuario,' cargo un arreglo de <b>$',v_diferencia,'</b> en ' ,v_sucursal,' del rubro ',v_rubro),
				v_color
				);

		set v_idalerta =@@identity;

		INSERT INTO alertasdestinatarios(idalerta,idusuario)
		SELECT
			v_idalerta,
			usr.id
		FROM
			usuarios as usr
			INNER JOIN usuariossucursales as us ON usr.id = us.idusuario AND us.idsucursal = v_sucursal_id AND us.activo = 1
		WHERE
			idperfil in (8,26,19, 33) and usr.activo  =1;

		INSERT INTO alertasinformes(idalerta,codigopagina,titulo)values(v_idalerta,'rendstockaver','Ver arreglos de stock');
		set v_idalertainforme=@@identity;

		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'busqueda','busqueda');
		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'inpPaginaVolver','inicio');
		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'inpRendicionId',p_idarreglo);
	end if;
END ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists insAlertaArregloDeStock');

        DB::unprepared("
CREATE PROCEDURE `insAlertaArregloDeStock`(IN p_idarreglo BIGINT(20))
begin

	DECLARE v_usuario VARCHAR(200);
    DECLARE v_sucursal VARCHAR(200);
    DECLARE v_sucursal_id bigint(20);
    DECLARE v_rubro VARCHAR(200);
    DECLARE v_diferencia DECIMAL(10,3);
    DECLARE v_idalerta BIGINT(20);
    DECLARE v_idalertainforme BIGINT(20);
    DECLARE v_fechahora DATETIME;
    DECLARE v_color VARCHAR(20);




    SELECT
		sum(if(valorrendido is null,0,valorrendido) - if(valorsistema is null,0,valorsistema)) AS diferencia,
        upper(concat(usr.nombre,' ',usr.apellido)),
        upper(suc.nombre),
        upper(rbr.nombre),
        max(rsd.fechahora) as fecha,
        suc.id
	INTO
		v_diferencia,
		v_usuario,
		v_sucursal,
        v_rubro,
        v_fechahora,
        v_sucursal_id
    FROM
		rendicionstockdetalle as rsd
        inner join rendicionesstock as rs on rsd.idrendicion = rs.id
        inner join sucursales as suc on rs.idsucursal = suc.id
        inner join usuarios as usr on rs.idusuario = usr.id
        inner join rubros as rbr on rs.idrubro = rbr.id
	WHERE
		idrendicion = p_idarreglo
	GROUP BY
		usr.nombre,usr.apellido,suc.nombre,rbr.nombre, suc.id;


    IF v_diferencia > 400 THEN

		INSERT INTO alertas(idalertatipo,fechahora,descripcion,color)
		VALUES(2,
				v_fechahora,
				concat(v_usuario,' cargo un arreglo positivo ($',v_diferencia,') en ' ,v_sucursal,' del rubro ',v_rubro),
				'AMARILLO'
				);

		set v_idalerta =@@identity;

		INSERT INTO alertasdestinatarios(idalerta,idusuario)
		SELECT
			v_idalerta,
			usr.id
		FROM
			usuarios as usr
			INNER JOIN usuariossucursales as us ON usr.id = us.idusuario AND us.idsucursal = v_sucursal_id AND us.activo = 1
		WHERE
			idperfil in (8,26,19) and usr.activo  =1;


		INSERT INTO alertasinformes(idalerta,codigopagina,titulo)values(v_idalerta,'rendstockaver','Ver arreglos de stock');
		set v_idalertainforme=@@identity;

		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'busqueda','busqueda');
		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'inpPaginaVolver','inicio');
		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'inpRendicionId',p_idarreglo);
	end if;

    IF v_diferencia < -1499 THEN

		SET v_color = 'NEGRO';
        if v_diferencia < -3000 THEN
			SET v_color = 'ROJO';
		end if;
		INSERT INTO alertas(idalertatipo,fechahora,descripcion,color)
		VALUES(2,
				now(),
				concat(v_usuario,' cargo un arreglo de <b>$',v_diferencia,'</b> en ' ,v_sucursal,' del rubro ',v_rubro),
				v_color
				);

		set v_idalerta =@@identity;

		INSERT INTO alertasdestinatarios(idalerta,idusuario)
		SELECT
			v_idalerta,
			usr.id
		FROM
			usuarios as usr
			INNER JOIN usuariossucursales as us ON usr.id = us.idusuario AND us.idsucursal = v_sucursal_id AND us.activo = 1
		WHERE
			idperfil in (8,26,19) and usr.activo  =1;


		INSERT INTO alertasinformes(idalerta,codigopagina,titulo)values(v_idalerta,'rendstockaver','Ver arreglos de stock');
		set v_idalertainforme=@@identity;

		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'busqueda','busqueda');
		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'inpPaginaVolver','inicio');
		INSERT INTO alertasinformesparametros(idalertainforme,clave,valor)value(v_idalertainforme,'inpRendicionId',p_idarreglo);
	end if;
END");
    }
};


