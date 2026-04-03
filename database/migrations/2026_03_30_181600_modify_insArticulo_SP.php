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

        DB::unprepared('drop procedure if exists insArticulo');

        DB::unprepared("
CREATE PROCEDURE `insArticulo`(
    IN `p_codigo` VARCHAR(20),
    IN `p_nombre` VARCHAR(120),
    IN `p_descripcion` VARCHAR(250),
    IN `p_aplicaPorcentajeMinimoUtilidad` INT(11),
    IN `p_activo` INT(11),
    IN `p_rubroid` BIGINT(20),
    IN `p_costo` DECIMAL(10,3),
    IN `p_escompuesto` INT(1),
    IN p_marca_id BIGINT(20),
    in p_activo_hasta DATETIME,
	IN `p_disponibilidadespecial` tinyint,
	IN `p_usuario_logueado_id` BIGINT(20)
	)
BEGIN
DECLARE v_idart BIGINT(20);
DECLARE v_idmarca BIGINT(20);


	if(p_marca_id IS NULL)THEN
		set v_idmarca  =1;
	ELSE
		set v_idmarca  = p_marca_id;
	END IF;

	INSERT INTO articulos(
		codigo,
		nombre,
		descripcion,
		aplicapminutilidad,
		activo,
		idrubro,
		costo,
		fechamodificacion,
		fechacreacion,
		escompuesto,
		idmarca,
		activohasta,
		disponibilidadespecial
	)
	VALUES (
		p_codigo,
		p_nombre,
		p_descripcion,
		p_aplicaPorcentajeMinimoUtilidad,
		p_activo,
		p_rubroid,
		p_costo,
		now(),
		now(),
		p_escompuesto,
		v_idmarca,
		p_activo_hasta,
		p_disponibilidadespecial);

	SET v_idart = @@identity;

	 INSERT INTO articuloscostoshistorico(idarticulo,idcompradetalle,fechahora,medio, idusuario, precioauxiliar)values
	  (v_idart, null, now(), 'ARTICULOS INSERT',  p_usuario_logueado_id, p_costo);

      call insHistoArticulo(v_idart,
                             p_codigo,
                             p_nombre,
                             p_descripcion,
                             p_aplicaPorcentajeMinimoUtilidad,
                             p_activo,
                             p_rubroid,
                             p_costo,
                             p_escompuesto);

     call setCalcularListasDePrecios(v_idart);
     call insActualizacion('GET-ART', v_idart);

  SELECT
    art.*,
    rbr.id AS rubroId,
    rbr.nombre AS rubroNombre,
    aplicapminutilidad AS aplicaPorcentajeMinimoUtilidad,
    disponibilidadespecial
  FROM articulos AS art INNER JOIN rubros AS rbr ON art.idrubro = rbr.id
  WHERE
    art.id = v_idart;

END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists insArticulo');

        DB::unprepared("
CREATE PROCEDURE `insArticulo`(
    IN `p_codigo` VARCHAR(20),
    IN `p_nombre` VARCHAR(120),
    IN `p_descripcion` VARCHAR(250),
    IN `p_aplicaPorcentajeMinimoUtilidad` INT(11),
    IN `p_activo` INT(11),
    IN `p_rubroid` BIGINT(20),
    IN `p_costo` DECIMAL(10,3),
    IN `p_escompuesto` INT(1),
    IN p_marca_id BIGINT(20),
    in p_activo_hasta DATETIME,
	IN `p_disponibilidadespecial` tinyint,
	IN `p_usuario_logueado_id` BIGINT(20)
	)
BEGIN
DECLARE v_idart BIGINT(20);
DECLARE v_idmarca BIGINT(20);


	if(p_marca_id IS NULL)THEN
		set v_idmarca  =1;
	ELSE
		set v_idmarca  = p_marca_id;
	END IF;

	INSERT INTO articulos(
		codigo,
		nombre,
		descripcion,
		aplicapminutilidad,
		activo,
		idrubro,
		costo,
		fechamodificacion,
		fechacreacion,
		escompuesto,
		idmarca,
		activohasta,
		disponibilidadespecial
	)
	VALUES (
		p_codigo,
		p_nombre,
		p_descripcion,
		p_aplicaPorcentajeMinimoUtilidad,
		p_activo,
		p_rubroid,
		p_costo,
		now(),
		now(),
		p_escompuesto,
		v_idmarca,
		p_activo_hasta,
		p_disponibilidadespecial);

	SET v_idart = @@identity;

	 INSERT INTO articuloscostoshistorico(idarticulo,idcompradetalle,fechahora,medio, idusuario, precioauxiliar)values
	  (v_idart, null, now(), 'ARTICULOS INSERT',  p_usuario_logueado_id, p_costo);

      call insHistoArticulo(v_idart,
                             p_codigo,
                             p_nombre,
                             p_descripcion,
                             p_aplicaPorcentajeMinimoUtilidad,
                             p_activo,
                             p_rubroid,
                             p_costo,
                             p_escompuesto);

     call setCalcularListasDePrecios(v_idart);
     call insActualizacion('GET-ART', v_idart);

  SELECT
    art.*,
    rbr.id AS rubroId,
    rbr.nombre AS rubroNombre,
    aplicapminutilidad AS aplicaPorcentajeMinimoUtilidad,
    disponibilidadespecial
  FROM articulos AS art INNER JOIN rubros AS rbr ON art.idrubro = rbr.id
  WHERE
    art.id = v_idart;

END");
    }
};
