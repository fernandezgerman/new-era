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

        DB::unprepared('drop procedure if exists insVentassucursal3');

        DB::unprepared('
 CREATE PROCEDURE `insVentassucursal3`(IN `p_id` BIGINT(20),
                                      IN `p_usuarioid` BIGINT(20),
                                      IN `p_sucursalid` BIGINT(20),
                                      IN `p_articuloid` BIGINT(20),
                                      IN `p_listaid` BIGINT(20),
                                      IN `p_cantidad` DECIMAL(20,3),
                                      IN `p_preciounitario` DECIMAL(20,3),
                                      IN `p_fechaenvio` VARCHAR(120),
                                      IN p_numerocaja BIGINT(20),
                                      IN p_ventaid VARCHAR(100)
)
BEGIN

    DECLARE pid BIGINT(20);
    DECLARE existe_venta BIGINT(20);
 DECLARE duplicate_entry CONDITION FOR SQLSTATE "23000";
    DECLARE EXIT HANDLER FOR duplicate_entry
    BEGIN
        SELECT 1 as existe, vtss.*, art.nombre as articuloNombre, art.idrubro FROM
            ventassucursal vtss inner join articulos as art on vtss.idarticulo = art.id where vtss.id > 36072582  and idventa = p_ventaid;
    END;


    INSERT INTO ventassucursal
    ( idusuario, idsucursal, idarticulo, idlista,
      cantidad, preciounitario, costo, fechaenvio,numerocaja,idventa,fechacreacion,costosucursal
    )
    VALUES ( p_usuarioid, p_sucursalid, p_articuloid, p_listaid,
             p_cantidad, p_preciounitario, null, p_fechaenvio,p_numerocaja,p_ventaid,now(),null
           );

    SET pid = @@identity ;
#      	call setExistencia(p_sucursalid,p_articuloid,p_cantidad * -1);


    SELECT 0 as existe, vtss.*, art.nombre as articuloNombre, art.idrubro FROM
        ventassucursal vtss inner join articulos as art on vtss.idarticulo = art.id where vtss.id = pid;

END');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists insVentassucursal3');
    }
};
