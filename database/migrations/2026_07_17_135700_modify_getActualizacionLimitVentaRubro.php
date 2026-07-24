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

        DB::unprepared('drop procedure if exists getActualizacionLimitVentaRubro');

        DB::unprepared("
CREATE  PROCEDURE `getActualizacionLimitVentaRubro`(IN `p_idsucursal` BIGINT(20))
begin

SELECT
	lvrph.activo ,
	lvrph.horadesde ,
	lvrph.horas ,
	lvrph.id ,
	lvrph.idrubro ,
	rbr.nombre as rubroNombre
FROM
	versionesactualizacion AS vrsa
	INNER JOIN limites_venta_por_hora_rubros as lvrph ON vrsa.iditem = lvrph.id
	INNER JOIN rubros AS rbr ON lvrph.idrubro = rbr.id
	INNER JOIN versiones AS vrs ON vrsa.idversion = vrs.id
	INNER JOIN motivosactualizaciones as mtva ON mtva.id = vrs.idmotivoactualizacion
WHERE
      mtva.codigo = 'GET-LMT-RBR-HR' AND
      vrsa.actualizada <> 1 AND
      vrsa.idsucursal = p_idsucursal;

END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists getActualizacionLimitVentaRubro');
    }
};
