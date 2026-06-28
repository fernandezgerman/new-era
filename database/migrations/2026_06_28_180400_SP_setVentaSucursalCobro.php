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

        DB::unprepared('drop procedure if exists setVentaSucursalCobro');

        DB::unprepared("
 CREATE PROCEDURE `setVentaSucursalCobro`(
	in p_idmododecobro bigint(20),
	in p_fechahora datetime,
	in p_usuarioid bigint(20),
	in p_sucursalid bigint(20),
	in p_descripcion varchar(100),
	in p_idunicocobro varchar(200),
	in p_importe decimal(20,3))
BEGIN
	declare v_cobro_en_bd varchar(200);

	SELECT
		idunicocobro
	INTO
		v_cobro_en_bd
	FROM
		ventassucursalcobros
	WHERE
		idunicocobro = p_idunicocobro
	LIMIT 1;

	If NOT v_cobro_en_bd IS NULL THEN
		SELECT 0 as insertado, 'EL cobro ya fue insertado' as mensaje ;
	ELSE

		INSERT
		INTO ventassucursalcobros(
				idmododecobro,
				fechahora,
				idusuario,
				idsucursal,
				descripcion,
				importe,
				idusuarioaudito ,
				idestado,
				fechahoraenvio,
				idunicocobro)
		VALUES (p_idmododecobro,
				p_fechahora,
				p_usuarioid,
				p_sucursalid,
				p_descripcion,
				p_importe,
				null,
				0,
				now(),
				p_idunicocobro);

		select
			id as insertado,
			id,
			idmododecobro,
			fechahora,
			idusuario,
			idsucursal,
			descripcion,
			importe,
			idusuarioaudito ,
			idestado,
			fechahoraenvio,
			idunicocobro
		from
			ventassucursalcobros
		where id = @@identity;
	END IF;
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists setVentaSucursalCobro');

        DB::unprepared("
  CREATE PROCEDURE `setVentaSucursalCobro`(
	in p_idmododecobro bigint(20),
	in p_fechahora datetime,
	in p_usuarioid bigint(20),
	in p_sucursalid bigint(20),
	in p_descripcion varchar(100),
	in p_idunicocobro varchar(200),
	in p_importe decimal(20,3))
BEGIN
	declare v_cobro_en_bd varchar(200);

	SELECT
		idunicocobro
	INTO
		v_cobro_en_bd
	FROM
		ventassucursalcobros
	WHERE
		idunicocobro = p_idunicocobro;

	If NOT v_cobro_en_bd IS NULL THEN
		SELECT 0 as insertado, 'EL cobro ya fue insertado' as mensaje ;
	ELSE

		INSERT
		INTO ventassucursalcobros(
				idmododecobro,
				fechahora,
				idusuario,
				idsucursal,
				descripcion,
				importe,
				idusuarioaudito ,
				idestado,
				fechahoraenvio,
				idunicocobro)
		VALUES (p_idmododecobro,
				p_fechahora,
				p_usuarioid,
				p_sucursalid,
				p_descripcion,
				p_importe,
				null,
				0,
				now(),
				p_idunicocobro);

		select
			id as insertado,
			id,
			idmododecobro,
			fechahora,
			idusuario,
			idsucursal,
			descripcion,
			importe,
			idusuarioaudito ,
			idestado,
			fechahoraenvio,
			idunicocobro
		from
			ventassucursalcobros
		where id = @@identity;
	END IF;
END");
    }
};
