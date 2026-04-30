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

        DB::unprepared('drop procedure if exists insCompraDetalle');

        DB::unprepared("
 CREATE PROCEDURE insCompraDetalle(IN `p_idcabecera` BIGINT(20),
                                    IN `p_idarticulo` BIGINT(20),
                                    IN `p_cantidad` decimal(20,2),
                                    IN `p_precio` decimal(20,2),
                                    IN `p_forzar_actualizacion_precio` INT(1),
                                    IN `p_idsucursal` BIGINT(20),
                                    IN `p_idtipocomprobante` BIGINT(20),
                                    IN `p_precio_actualizacion` decimal(20,2)
                                    )
BEGIN
DECLARE v_multiplo BIGINT(20);
DECLARE v_iddetalle BIGINT(20);
DECLARE v_iddetallecostoarticulo BIGINT(20);
DECLARE v_escompuesto tinyint(4);
DECLARE v_idproveedor BIGINT(20);
DECLARE v_costoanterior decimal(20,2);
DECLARE v_totalfactura decimal(20,2);

DECLARE v_totalimpuestos decimal(20,2);
DECLARE v_totaldescuentos decimal(20,2);
DECLARE v_totallineaconimp DECIMAL(20,2);
DECLARE v_totallineacondesc DECIMAL(20,2);
DECLARE v_pr DECIMAL(20,10);

SELECT
    SUM(if(suma = 1,1,-1) * valor),
    SUM(if(suma = 1,0,-1) * valor)
INTO
    v_totalimpuestos,
    v_totaldescuentos
FROM
    impuestoscompras
WHERE
    idcabecera = p_idcabecera
;

SELECT
    idproveedor,
    totalfactura
into
    v_idproveedor,
    v_totalfactura
FROM
    compras
WHERE
    id = p_idcabecera;

IF (v_totalfactura - IFNULL(v_totalimpuestos,0)) <> 0 THEN
    SET v_pr = (p_cantidad * p_precio) / (v_totalfactura - IFNULL(v_totalimpuestos,0)) ;
    SET v_totallineaconimp = IFNULL(v_totalimpuestos,0) * IFNULL(v_pr,0) + (p_cantidad * p_precio);
    SET v_totallineacondesc = IFNULL(v_totaldescuentos,0) * IFNULL(v_pr,0) + (p_cantidad * p_precio);
END IF;

    SELECT escompuesto,costo,idcompradetalle INTO v_escompuesto,v_costoanterior,v_iddetallecostoarticulo FROM articulos WHERE id = p_idarticulo ;

     IF p_idtipocomprobante = 2 THEN
          set v_multiplo = -1;
        ELSE
          set v_multiplo = 1;
        END IF;


    INSERT INTO comprasdetalle(
      idcabecera,
      idarticulo,
      cantidad,
      precio,
      costoanterior

    )
    VALUES (
      p_idcabecera,
      p_idarticulo,
      p_cantidad * v_multiplo,
      p_precio,
      v_costoanterior
    );

    SET v_iddetalle = @@identity;

/*
     IF NOT p_idtipocomprobante = 2 THEN
      IF (not p_precio_actualizacion IS NULL AND p_precio_actualizacion > 0)THEN

		IF (v_costoanterior <  p_precio_actualizacion)
                        OR v_costoanterior IS NULL
                                OR (p_forzar_actualizacion_precio=1 AND NOT p_precio_actualizacion IS NULL) THEN


			  INSERT INTO articuloscostoshistorico(idarticulo,idcompradetalle,fechahora,medio)
              VALUES (p_idarticulo,v_iddetalle,now(),'COMPRA');

              UPDATE articulos
                 SET costo = p_precio_actualizacion,idcompradetalle = v_iddetalle
               WHERE articulos.id = p_idarticulo ;



            END IF;
        END IF;
    END IF;
*/

    #
    INSERT INTO costoscompra(iddetalle,idtipocosto,importe)values(v_iddetalle,1,if(p_cantidad =0,0,v_totallineaconimp / p_cantidad));
    INSERT INTO costoscompra(iddetalle,idtipocosto,importe)values(v_iddetalle,2,if(p_cantidad =0,0,v_totallineacondesc / p_cantidad));

    CALL setExistencia(p_idsucursal,p_idarticulo,p_cantidad* v_multiplo);
    CALL insCostoArticuloSucursal(p_idsucursal,p_idarticulo,p_idcabecera,p_precio);


    IF v_escompuesto = 1 THEN
      INSERT INTO comprasarticuloscompuestos (idcompra,cantidadcompuesto,fechacreacion,idcomponente)
            SELECT v_iddetalle,ac.cantidad, now(),ac.idarticulo
            FROM articuloscompuestos  as ac
            WHERE ac.idcompuesto = p_idarticulo;

    END IF;

  IF p_cantidad > 0 THEN

	#Inserta el cambio de costo para revalorizar la scursal
    CALL `insRevalorizacionValorCompra`(v_iddetalle,
                                        p_idsucursal,
                                        p_idarticulo,
                                        v_idproveedor,
                                        p_cantidad,
                                        p_precio);

	#Inserta el cambio de costo para revalorizar la scursal
    CALL setCostoArticuloProveedorSucursal(p_idsucursal,p_idarticulo,v_idproveedor,p_idcabecera,v_iddetalle,p_precio);

END IF;

SELECT
    comprasdetalle.id,
    compras.id AS compraId,
    compras.numero AS compraNumero,
    comprasdetalle.cantidad,
    comprasdetalle.precio,
    v_iddetallecostoarticulo as iddetallecostoarticulo
FROM
    ((comprasdetalle) INNER JOIN compras ON
    comprasdetalle.idcabecera = compras.id ) INNER JOIN articulos ON
    comprasdetalle.idarticulo = articulos.id
WHERE
    comprasdetalle.id = v_iddetalle ;


END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists insCompraDetalle');

        DB::unprepared("
 CREATE PROCEDURE `insCompraDetalle`(IN `p_idcabecera` BIGINT(20),
                                    IN `p_idarticulo` BIGINT(20),
                                    IN `p_cantidad` decimal(20,2),
                                    IN `p_precio` decimal(20,2),
                                    IN `p_forzar_actualizacion_precio` INT(1),
                                    IN `p_idsucursal` BIGINT(20),
                                    IN `p_idtipocomprobante` BIGINT(20),
                                    IN `p_precio_actualizacion` decimal(20,2)
                                    )
BEGIN
DECLARE v_multiplo BIGINT(20);
DECLARE v_iddetalle BIGINT(20);
DECLARE v_iddetallecostoarticulo BIGINT(20);
DECLARE v_escompuesto tinyint(4);
DECLARE v_idproveedor BIGINT(20);
DECLARE v_costoanterior decimal(20,2);
DECLARE v_totalfactura decimal(20,2);

DECLARE v_totalimpuestos decimal(20,2);
DECLARE v_totaldescuentos decimal(20,2);
DECLARE v_totallineaconimp DECIMAL(20,2);
DECLARE v_totallineacondesc DECIMAL(20,2);
DECLARE v_pr DECIMAL(20,10);

SELECT
    SUM(if(suma = 1,1,-1) * valor),
    SUM(if(suma = 1,0,-1) * valor)
INTO
    v_totalimpuestos,
    v_totaldescuentos
FROM
    impuestoscompras
WHERE
    idcabecera = p_idcabecera
;

SELECT
    idproveedor,
    totalfactura
into
    v_idproveedor,
    v_totalfactura
FROM
    compras
WHERE
    id = p_idcabecera;

IF (v_totalfactura - IFNULL(v_totalimpuestos,0)) <> 0 THEN

    SET v_pr = (p_cantidad * p_precio) / (v_totalfactura - IFNULL(v_totalimpuestos,0)) ;
    SET v_totallineaconimp = IFNULL(v_totalimpuestos,0) * IFNULL(v_pr,0) + (p_cantidad * p_precio);
    SET v_totallineacondesc = IFNULL(v_totaldescuentos,0) * IFNULL(v_pr,0) + (p_cantidad * p_precio);

END IF;

    SELECT escompuesto,costo,idcompradetalle INTO v_escompuesto,v_costoanterior,v_iddetallecostoarticulo FROM articulos WHERE id = p_idarticulo ;

     IF p_idtipocomprobante = 2 THEN
          set v_multiplo = -1;
        ELSE
          set v_multiplo = 1;
        END IF;


    INSERT INTO comprasdetalle(
      idcabecera,
      idarticulo,
      cantidad,
      precio,
      costoanterior

    )
    VALUES (
      p_idcabecera,
      p_idarticulo,
      p_cantidad * v_multiplo,
      p_precio,
      v_costoanterior
    );

    SET v_iddetalle = @@identity;


     IF NOT p_idtipocomprobante = 2 THEN
      IF (not p_precio_actualizacion IS NULL AND p_precio_actualizacion > 0)THEN

		IF (v_costoanterior <  p_precio_actualizacion)
                        OR v_costoanterior IS NULL
                                OR (p_forzar_actualizacion_precio=1 AND NOT p_precio_actualizacion IS NULL) THEN


			  INSERT INTO articuloscostoshistorico(idarticulo,idcompradetalle,fechahora,medio)
              VALUES (p_idarticulo,v_iddetalle,now(),'COMPRA');

              UPDATE articulos
                 SET costo = p_precio_actualizacion,idcompradetalle = v_iddetalle
               WHERE articulos.id = p_idarticulo ;



            END IF;
        END IF;
    END IF;



    INSERT INTO costoscompra(iddetalle,idtipocosto,importe)values(v_iddetalle,1,if(p_cantidad =0,0,v_totallineaconimp / p_cantidad));
    INSERT INTO costoscompra(iddetalle,idtipocosto,importe)values(v_iddetalle,2,if(p_cantidad =0,0,v_totallineacondesc / p_cantidad));

    CALL setExistencia(p_idsucursal,p_idarticulo,p_cantidad* v_multiplo);
    CALL insCostoArticuloSucursal(p_idsucursal,p_idarticulo,p_idcabecera,p_precio);


    IF v_escompuesto = 1 THEN
      INSERT INTO comprasarticuloscompuestos (idcompra,cantidadcompuesto,fechacreacion,idcomponente)
            SELECT v_iddetalle,ac.cantidad, now(),ac.idarticulo
            FROM articuloscompuestos  as ac
            WHERE ac.idcompuesto = p_idarticulo;

    END IF;

  IF p_cantidad > 0 THEN

    CALL `insRevalorizacionValorCompra`(v_iddetalle,
                                        p_idsucursal,
                                        p_idarticulo,
                                        v_idproveedor,
                                        p_cantidad,
                                        p_precio);

    CALL setCostoArticuloProveedorSucursal(p_idsucursal,p_idarticulo,v_idproveedor,p_idcabecera,v_iddetalle,p_precio);

END IF;

SELECT
    comprasdetalle.id,
    compras.id AS compraId,
    compras.numero AS compraNumero,
    comprasdetalle.cantidad,
    comprasdetalle.precio,
    v_iddetallecostoarticulo as iddetallecostoarticulo
FROM
    ((comprasdetalle) INNER JOIN compras ON
    comprasdetalle.idcabecera = compras.id ) INNER JOIN articulos ON
    comprasdetalle.idarticulo = articulos.id
WHERE
    comprasdetalle.id = v_iddetalle ;


END");
    }
};
