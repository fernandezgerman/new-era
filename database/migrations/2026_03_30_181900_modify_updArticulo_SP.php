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

        DB::unprepared('drop procedure if exists updArticulo');

        DB::unprepared("
 CREATE PROCEDURE `updArticulo`(
    IN `p_id` BIGINT(20),
    IN `p_codigo` VARCHAR(20),
    IN `p_nombre` VARCHAR(120),
    IN `p_descripcion` VARCHAR(250),
    IN `p_aplicaPorcentajeMinimoUtilidad` INT(11),
    IN `p_activo` INT(11),
    IN `p_rubroid` BIGINT(20),
    IN `p_costo` DECIMAL(10, 3),
    IN `p_escompuesto` INT(1),
    IN `p_marca_id` BIGINT(20),
    IN `p_compra_detalle_id` BIGINT(20),
	in p_activo_hasta DATETIME,
	IN `p_disponibilidadespecial` tinyint,
	IN `p_usuario_logueado_id` BIGINT(20))
BEGIN

declare v_iddetalle_compra_anterior	bigint(20);
declare v_costo_anterior decimal(20,3);

SELECT costo, idcompradetalle INTO v_costo_anterior, v_iddetalle_compra_anterior FROM articulos where id = p_id;

  UPDATE
	articulos
SET
	codigo = p_codigo,
	nombre = p_nombre,
	descripcion = p_descripcion,
	aplicapminutilidad = p_aplicaPorcentajeMinimoUtilidad,
	activo = p_activo,
	idrubro = p_rubroid,
	costo = p_costo,
	fechamodificacion = now(),
	escompuesto = p_escompuesto,
	idmarca = p_marca_id,
	idcompradetalle = p_compra_detalle_id,
	activohasta = p_activo_hasta,
	disponibilidadespecial = p_disponibilidadespecial
WHERE
	id = p_id;

  call setCalcularListasDePrecios(p_id);



  if(not ifnull(v_iddetalle_compra_anterior, -1) = ifnull(p_compra_detalle_id, -1) or not p_costo = v_costo_anterior) then
    INSERT INTO articuloscostoshistorico(idarticulo,idcompradetalle,fechahora,medio, idusuario, precioauxiliar)values
	  (p_id, p_compra_detalle_id, now(), 'ARTICULOS UPDATE',  p_usuario_logueado_id, if(p_compra_detalle_id is null, p_costo, null));
  end if;



  SELECT
    art.*,
    rbr.id AS rubroId,
    rbr.nombre AS rubroNombre,
    aplicapminutilidad AS aplicaPorcentajeMinimoUtilidad,
    disponibilidadespecial
  FROM articulos AS art INNER JOIN rubros AS rbr ON art.idrubro = rbr.id
  WHERE
    art.id = p_id;


    call insHistoArticulo(p_id,
                             p_codigo,
                             p_nombre,
                             p_descripcion,
                             p_aplicaPorcentajeMinimoUtilidad,
                             p_activo,
                             p_rubroid,
                             p_costo,
                             p_escompuesto);


END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists updArticulo');

        DB::unprepared("
 CREATE PROCEDURE `updArticulo`(
    IN `p_id` BIGINT(20),
    IN `p_codigo` VARCHAR(20),
    IN `p_nombre` VARCHAR(120),
    IN `p_descripcion` VARCHAR(250),
    IN `p_aplicaPorcentajeMinimoUtilidad` INT(11),
    IN `p_activo` INT(11),
    IN `p_rubroid` BIGINT(20),
    IN `p_costo` DECIMAL(10, 3),
    IN `p_escompuesto` INT(1),
    IN `p_marca_id` BIGINT(20),
    IN `p_compra_detalle_id` BIGINT(20),
	in p_activo_hasta DATETIME,
	IN `p_disponibilidadespecial` tinyint,
	IN `p_usuario_logueado_id` BIGINT(20))
BEGIN

declare v_iddetalle_compra_anterior	bigint(20);
declare v_costo_anterior decimal(20,3);

SELECT costo, idcompradetalle INTO v_costo_anterior, v_iddetalle_compra_anterior FROM articulos where id = p_id;

  UPDATE
	articulos
SET
	codigo = p_codigo,
	nombre = p_nombre,
	descripcion = p_descripcion,
	aplicapminutilidad = p_aplicaPorcentajeMinimoUtilidad,
	activo = p_activo,
	idrubro = p_rubroid,
	costo = p_costo,
	fechamodificacion = now(),
	escompuesto = p_escompuesto,
	idmarca = p_marca_id,
	idcompradetalle = p_compra_detalle_id,
	activohasta = p_activo_hasta,
	disponibilidadespecial = p_disponibilidadespecial
WHERE
	id = p_id;

  call setCalcularListasDePrecios(p_id);



  if(not ifnull(v_iddetalle_compra_anterior, -1) = ifnull(p_compra_detalle_id, -1) or not p_costo = v_costo_anterior) then
    INSERT INTO articuloscostoshistorico(idarticulo,idcompradetalle,fechahora,medio, idusuario, precioauxiliar)values
	  (p_id, p_compra_detalle_id, now(), 'ARTICULOS UPDATE',  p_usuario_logueado_id, if(p_compra_detalle_id is null, p_costo, null));
  end if;



  SELECT
    art.*,
    rbr.id AS rubroId,
    rbr.nombre AS rubroNombre,
    aplicapminutilidad AS aplicaPorcentajeMinimoUtilidad,
    disponibilidadespecial
  FROM articulos AS art INNER JOIN rubros AS rbr ON art.idrubro = rbr.id
  WHERE
    art.id = p_id;


    call insHistoArticulo(p_id,
                             p_codigo,
                             p_nombre,
                             p_descripcion,
                             p_aplicaPorcentajeMinimoUtilidad,
                             p_activo,
                             p_rubroid,
                             p_costo,
                             p_escompuesto);


END");
    }
};
