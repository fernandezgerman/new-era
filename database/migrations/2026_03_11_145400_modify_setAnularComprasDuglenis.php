<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        DB::unprepared('drop procedure if exists setAnularComprasDuglenis');

        DB::unprepared("
          CREATE PROCEDURE `setAnularComprasDuglenis`(IN p_idcompra BIGINT(20),
                                 IN p_idusuarioanulo BIGINT(20))
BEGIN

  DECLARE v_fueanulada TINYINT(1);
  DECLARE v_tiene_pagos TINYINT(1);
  DECLARE v_es_anulacion TINYINT(1);
  DECLARE v_numerocaja BIGINT(20);
  DECLARE v_idusuario BIGINT(20);
  DECLARE v_idsucursal BIGINT(20);
  DECLARE v_idsucursalcaja BIGINT(20);
  DECLARE v_idusuariocaja BIGINT(20);
  DECLARE v_idanulacion BIGINT(20);
  DECLARE v_idarticulo BIGINT(20);
  DECLARE v_esreubrogastos BIGINT(20);
  DECLARE v_idperiodo BIGINT(20);
  DECLARE v_idanulacion_detalle BIGINT(20);
  DECLARE v_idcompradetalle BIGINT(20);
  DECLARE v_cantidad DECIMAL(10,3);
  DECLARE v_precio DECIMAL(10,3);
  DECLARE v_idunico VARCHAR(200);



  DECLARE v_ordendepago_id bigint(20);
  DECLARE v_mensaje varchar(200);
  DECLARE vb_termina BOOL DEFAULT FALSE;
  DECLARE cursor_detalles CURSOR FOR SELECT cd.id,cd.idarticulo, cd.cantidad,cd.precio
                                     FROM comprasdetalle as cd
                                     WHERE cd.idcabecera = p_idcompra;

  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET vb_termina = TRUE;




    SELECT
        concat(op.id,'/',idlote)
    into
        v_mensaje
    FROM
        ordenesdepago as op
        INNER JOIN ordenesdepagodetalle as opd ON op.id = opd.idordendepago
    WHERE
        op.idestado IN (2,3) and
        idfactura = p_idcompra
    LIMIT 1;

    IF NOT v_mensaje IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede pagar la factura debido a que tiene ORDENES DE PAGO pendientes.';
    END IF;


    SELECT
     	'Tiene'
    INTO
    	v_mensaje
    FROM
		solicitudespago as sp
		INNER JOIN solicitudespagodetalle as spd ON sp.id = spd.idsolicitudpago
		INNER JOIN
			(SELECT max(id) as idestado,idsolicitudpago FROM solicitudespagoestados GROUP BY idsolicitudpago) as spe_id
				ON sp.id = spe_id.idsolicitudpago
		INNER JOIN solicitudespagoestados AS spe ON sp.id = spe.idsolicitudpago AND spe_id.idestado = spe.id
    WHERE
        spe.estado = 'PENDIENTE' AND
        idcompra = p_idcompra
    LIMIT 1;

   IF NOT v_mensaje IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede anular porque tiene SOLICITUDES de pago pendientes.';
    END IF;


  SELECT 1
  INTO v_fueanulada
  FROM comprasanuladas
  WHERE idcompra = p_idcompra;

  SET v_esreubrogastos = (
                          SELECT COUNT(1)
                          FROM compras as cmp
                                INNER JOIN comprasdetalle as cd ON cmp.id = cd.idcabecera
                                INNER JOIN articulos as art ON cd.idarticulo = art.id
                                INNER JOIN rubros as rbr ON art.idrubro = rbr.id
                          WHERE cmp.id = p_idcompra AND
                                rbr.esrubrogastos = 1);

  SELECT 1
  INTO v_es_anulacion
  FROM comprasanuladas
  WHERE idanulacion = p_idcompra;


  SELECT 1
  INTO v_tiene_pagos
  FROM pagodetalles
  WHERE idcompra = p_idcompra
  GROUP BY idcompra;

  IF v_fueanulada = 1 THEN
    SELECT 1 as error, 'La factura ya fue anulada.' as mensaje;
  ELSEIf v_tiene_pagos = 1 THEN
    SELECT 1 as error, 'La factura tiene pagos asociados.' as mensaje;
  ELSEIf v_es_anulacion = 1 and false THEN
    SELECT 1 as error, 'La factura es una anulacion, no se puede anular.' as mensaje;
  ELSE

    SELECT idusuario,idsucursal,idusuariocaja,idsucursalcaja
    INTO v_idusuario, v_idsucursal,v_idusuariocaja,v_idsucursalcaja
    FROM compras
    WHERE id = p_idcompra;

    IF v_idsucursalcaja = 2 THEN
      call getNumeroCaja(v_idusuariocaja,v_idsucursalcaja,v_numerocaja);
    END IF;



  SET v_idunico = concat(now() + 0,'REC - DUG - ',v_idsucursalcaja,v_idusuariocaja);

    INSERT INTO compras(fechaemision,
                        fechahora,
                        tipofactura,
                        idusuario,
                        idsucursal,
                        totalfactura,
                        idproveedor,
                        numero,
                        numerocaja,
                        idusuariocaja,
                        idsucursalcaja,
                        mododepago,
                        idestado,
                        idtipocomprobante,
                        observaciones,
                        idunico)
      SELECT now(),
             now(),
             tipofactura,
             idusuario,
             idsucursal,
             totalfactura * (-1),
             idproveedor,
             numero,
             v_numerocaja,
             idusuariocaja,
             idsucursalcaja,
             mododepago,
             idestado,
             idtipocomprobante,
             observaciones,
             v_idunico
    FROM
      compras
    WHERE id = p_idcompra;

    SET v_idanulacion = @@identity;

    call insActualizacionSucursal('GET-ACOMPRA', v_idanulacion,v_idsucursalcaja);

    IF NOT v_esreubrogastos IS NULL AND v_esreubrogastos > 0 THEN
        SELECT max(id) INTO v_idperiodo FROM liquidacionesperiodo WHERE idestado IS NULL or idestado  = 0;

        if (v_idperiodo IS NULL)THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay un periodo contable abierto';
        END IF;
        call insLiquidacionesPeriodoGastos(v_idanulacion,v_idperiodo);


    END IF;

    SET vb_termina = false;
   OPEN cursor_detalles;
                 Recorre_Cursor: LOOP
                      FETCH cursor_detalles INTO v_idcompradetalle,v_idarticulo, v_cantidad,v_precio;

                      IF vb_termina THEN
                          LEAVE Recorre_Cursor;
                      END IF;

                      call setExistenciaAnulacionCompra(v_idsucursal,
                                                       v_idarticulo,
                                                       v_cantidad * -1,
                                                       v_idcompradetalle);


                    INSERT INTO comprasdetalle(
                      idcabecera,
                      idarticulo,
                      cantidad,
                      precio
                    )
                    VALUES (
                      v_idanulacion,
                      v_idarticulo,
                      v_cantidad * -1,
                      v_precio
                    );
                    SET v_idanulacion_detalle = @@identity;

                      INSERT comprasarticuloscompuestos(idcompra,cantidadcompuesto,fechacreacion,idcomponente)
                      SELECT v_idanulacion_detalle,cantidadcompuesto,now(),idcomponente
                      FROM comprasarticuloscompuestos
                      WHERE idcompra = v_idcompradetalle;

                  END LOOP;
                CLOSE cursor_detalles;




        INSERT INTO impuestoscompras(
          idimpuesto,
          idcabecera,
          discrimina,
          suma,
          valor
        )
        SELECT
          idimpuesto,
          v_idanulacion,
          discrimina,
          suma,
          valor * -1
        FROM
          impuestoscompras
        WHERE
          idcabecera = p_idcompra
          ;

      SELECT 0 as error, 'La factura se anulo correctamente.' as mensaje;
  END IF;

END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Down simply drops the procedure; if you want to restore previous version, paste the old body here.
        DB::unprepared('drop procedure if exists getNoblezaStock');
    }
};
