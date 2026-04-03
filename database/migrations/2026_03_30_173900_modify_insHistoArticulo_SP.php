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

        DB::unprepared('drop procedure if exists insHistoArticulo');

        DB::unprepared("
CREATE PROCEDURE `insHistoArticulo`
(IN `p_id` BIGINT(20), IN `p_codigo` VARCHAR(20), IN `p_nombre` VARCHAR(120), IN `p_descripcion` VARCHAR(120), IN `p_aplicaPorcentajeMinimoUtilidad` INT(11), IN `p_activo` INT(11), IN `p_rubroid` BIGINT(20), IN `p_costo` DECIMAL(10, 3), IN `p_escompuesto` INT(1))
BEGIN
INSERT
	INTO
	histoarticulos(
  id,
  idrubro,
  codigo,
  nombre,
  descripcion,
  aplicapminutilidad,
  activo,
  fechacreacion,
  costo,
  escompuesto,
  idhisto
)
VALUES (
  p_id,
  p_rubroid,
  p_codigo,
  p_nombre,
  p_descripcion,
  p_aplicaPorcentajeMinimoUtilidad,
  p_activo,
  now(),
  p_costo,
  p_escompuesto,
  (
SELECT
	IF(ISNULL(MAX(ha.idhisto)), 0, MAX(ha.idhisto))
FROM
	histoarticulos as ha
WHERE
	ha.id = p_id ) + 1
  );
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists insHistoArticulo');

        DB::unprepared("
CREATE PROCEDURE `insHistoArticulo`
(IN `p_id` BIGINT(20), IN `p_codigo` VARCHAR(20), IN `p_nombre` VARCHAR(20), IN `p_descripcion` VARCHAR(120), IN `p_aplicaPorcentajeMinimoUtilidad` INT(11), IN `p_activo` INT(11), IN `p_rubroid` BIGINT(20), IN `p_costo` DECIMAL(10, 3), IN `p_escompuesto` INT(1))
BEGIN
INSERT
	INTO
	histoarticulos(
  id,
  idrubro,
  codigo,
  nombre,
  descripcion,
  aplicapminutilidad,
  activo,
  fechacreacion,
  costo,
  escompuesto,
  idhisto
)
VALUES (
  p_id,
  p_rubroid,
  p_codigo,
  p_nombre,
  p_descripcion,
  p_aplicaPorcentajeMinimoUtilidad,
  p_activo,
  now(),
  p_costo,
  p_escompuesto,
  (
SELECT
	IF(ISNULL(MAX(ha.idhisto)), 0, MAX(ha.idhisto))
FROM
	histoarticulos as ha
WHERE
	ha.id = p_id ) + 1
  );
END ");
    }
};
