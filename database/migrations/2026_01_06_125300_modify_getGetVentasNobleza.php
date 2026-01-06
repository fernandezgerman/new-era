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

        DB::unprepared('drop procedure if exists getGetVentasNobleza');

        DB::unprepared("
CREATE PROCEDURE `getGetVentasNobleza`(IN p_fechadesde DATE,
                                     IN p_fechahasta DATE)
begin

SELECT
	sucursal,
	codigo,
	nombre,
	truncate(cantidad * calcularMultiploVentasNobleza(articuloId,rubroid) ,0) as cantidad,
	mes
FROM(
	SELECT
	    suc.nombre as sucursal, art.codigo,art.nombre,art.id as articuloId,rbr.id as rubroid,
	    truncate(sum(cantidad),0) as cantidad,
	    month(fechaenvio) as mes
	FROM  articulos as art
	        INNER JOIN rubros as rbr ON art.idrubro = rbr.id
	        INNER JOIN ventassucursal as vs ON art.id = vs.idarticulo
	        INNER JOIN sucursales as suc ON vs.idsucursal = suc.id
	WHERE  fechaenvio >= p_fechadesde AND
	        fechaenvio <=p_fechahasta and
	        rbr.id in (2,4,94,32,33,94, 142)
	GROUP BY   art.id,suc.id,art.codigo,suc.nombre,art.nombre ,month(fechaenvio)
	ORDER BY   suc.nombre,art.nombre ,month(fechaenvio)
) as tabla
where
	truncate(cantidad * calcularMultiploVentasNobleza(articuloId,rubroid) ,0)  > 0
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
        DB::unprepared('drop procedure if exists getGetVentasNobleza');
    }
};
