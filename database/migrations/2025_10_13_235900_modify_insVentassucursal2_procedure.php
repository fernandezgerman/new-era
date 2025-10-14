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

        DB::unprepared('DROP PROCEDURE IF EXISTS `insVentassucursal2`');

        DB::unprepared('
CREATE  PROCEDURE `insVentassucursal2`(IN `p_id` BIGINT(20),
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
    DECLARE v_costo decimal(15,2);
    DECLARE pid BIGINT(20);
    DECLARE v_escompuesto tinyint(4);
    DECLARE existe_venta BIGINT(20);
    DECLARE v_costo_sucursal decimal(15,2);
    DECLARE v_idcompradetallearticulo BIGINT(20);

    DECLARE v_idcompradetalle BIGINT(20);


    DECLARE duplicate_entry CONDITION FOR SQLSTATE "23000";
    DECLARE EXIT HANDLER FOR duplicate_entry
    BEGIN
        SELECT 1 as existe, vtss.*, art.nombre as articuloNombre, art.idrubro FROM
            ventassucursal vtss inner join articulos as art on vtss.idarticulo = art.id where idventa = p_ventaid;
    END;



    SELECT escompuesto,idcompradetalle INTO v_escompuesto,v_idcompradetallearticulo FROM articulos WHERE id = p_articuloid;


#    SELECT 1 INTO existe_venta FROM ventassucursal WHERE idventa = p_ventaid;

    set existe_venta = 0;
    SET v_costo = costoArticulo(p_articuloid);

    SELECT precio,cd.id
    INTO v_costo_sucursal,v_idcompradetalle
    FROM comprasdetalle as cd
    WHERE id = (SELECT MAX(cd2.id)
                FROM comprasdetalle as cd2
                         INNER JOIN compras as cmp ON cd2.idcabecera = cmp.id
                         LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idanulacion
                         LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idcompra
                         LEFT JOIN (SELECT idcompradetalle from comprasdudosas WHERE audicionresultado IN (1,3) GROUP BY idcompradetalle) as dudas
                                   ON cd2.id = idcompradetalle
                WHERE cmp.idsucursal = p_sucursalid AND
                        cd2.idarticulo = p_articuloid AND
                    ca.idanulacion IS NULL AND
                    ca2.idanulacion IS NULL AND
                        cd2.cantidad > 0 AND
                    idcompradetalle IS NULL AND
                    NOT cmp.idtipocomprobante = 2
                GROUP BY cmp.idsucursal,
                         cd2.idarticulo
    );

    IF v_costo_sucursal IS NULL THEN
        SET v_costo_sucursal = v_costo;
        SET v_idcompradetalle = v_idcompradetallearticulo ;
    END IF;

    IF (NOT existe_venta = 1 OR existe_venta IS NULL) THEN
        INSERT INTO ventassucursal
        ( idusuario, idsucursal, idarticulo, idlista,
          cantidad, preciounitario, costo, fechaenvio,numerocaja,idventa,fechacreacion,costosucursal
        )
        VALUES ( p_usuarioid, p_sucursalid, p_articuloid, p_listaid,
                 p_cantidad, p_preciounitario, v_costo, p_fechaenvio,p_numerocaja,p_ventaid,now(),v_costo_sucursal
               );

        SET pid = @@identity ;
      	call setExistencia(p_sucursalid,p_articuloid,p_cantidad*-1);

        IF v_escompuesto = 1 THEN
            INSERT INTO ventasarticuloscompuestos (idventa,cantidadcompuesto,fechacreacion,idcomponente)
            SELECT pid,ac.cantidad, now(),ac.idarticulo
            FROM articuloscompuestos  as ac
            WHERE ac.idcompuesto = p_articuloid;
        END IF;

        IF NOT v_idcompradetalle IS NULL THEN
            INSERT INTO ventassucursalextra (idventa,idcompradetalle) VALUES (pid,v_idcompradetalle);
        END IF;

        SELECT 0 as existe, vtss.*, art.nombre as articuloNombre, art.idrubro FROM
            ventassucursal vtss inner join articulos as art on vtss.idarticulo = art.id where vtss.id = pid;

    ELSE
        SELECT 1 as existe, vtss.*, art.nombre as articuloNombre, art.idrubro FROM
            ventassucursal vtss inner join articulos as art on vtss.idarticulo = art.id where idventa = p_ventaid;
    END IF;

END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Down simply drops the procedure; if you want to restore previous version, paste the old body here.
        DB::unprepared('DROP PROCEDURE IF EXISTS `insVentassucursal2`');
    }
};
