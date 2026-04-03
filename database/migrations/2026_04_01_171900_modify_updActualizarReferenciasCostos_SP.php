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

        DB::unprepared('drop procedure if exists updActualizarReferenciasCostos');

        DB::unprepared("
 CREATE PROCEDURE `updActualizarReferenciasCostos`(IN `p_iddetalle` bigint(20),
 IN `p_idcabecera` bigint(20))
BEGIN

  DECLARE v_detalleanterior BIGINT(20);
  DECLARE v_idarticulo BIGINT(20);
  DECLARE v_idsucursal BIGINT(20);
  DECLARE v_idcabecera BIGINT(20);
  DECLARE v_iddetalle BIGINT(20);
  DECLARE v_costo DECIMAL(10,3);
  DECLARE v_idcompraarticuloactual DECIMAL(10,3);
  DECLARE v_costo_compra DECIMAL(10,3);
  DECLARE v_reversionar TINYINT(4);
  DECLARE v_fechaauxiliar DATETIME;
  DECLARE v_fechacompra DATETIME;
  DECLARE v_fechacompraanterior DATETIME;
  DECLARE v_fechacompraposterior DATETIME;

  DECLARE v_costoarticulonuevo DECIMAL(10,3);
  DECLARE v_iddetallearticulonuevo BIGINT(20);

  DECLARE v_fin BOOL DEFAULT FALSE;
  DECLARE v_compras CURSOR FOR SELECT DISTINCT cmp.id,cd.id AS iddetalle,cmp.idsucursal,cd.idarticulo, 1 as reversionar,cmp.fechahora,precio
                                     FROM compras as cmp
                                          INNER JOIN comprasdetalle as cd ON cmp.id = cd.idcabecera
                                     WHERE
                                      cd.id = p_iddetalle OR
                                      cmp.id = p_idcabecera ;

    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET v_fin = TRUE;


   OPEN v_compras;
       Recorre_Cursor: LOOP
            FETCH v_compras INTO v_idcabecera,v_iddetalle,v_idsucursal,v_idarticulo,v_reversionar,v_fechacompra,v_costo_compra;

            IF v_fin THEN
                LEAVE Recorre_Cursor;
            END IF;




                select
                    cd.id,
                    cmp.fechahora
                INTO
                    v_detalleanterior,
                    v_fechacompraanterior
                FROM
                    comprasdetalle as cd
                    INNER JOIN compras as cmp on cd.idcabecera = cmp.id
                    LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idanulacion
                    LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idcompra
					LEFT JOIN comprasdudosas as duda ON cd.id = duda.idcompradetalle
                WHERE
					(duda.audicionresultado IS NULL OR audicionresultado =2 ) AND
                    cd.id < v_iddetalle AND
                    cd.cantidad > 0 AND
                    ca.idanulacion is null AND
                    ca2.idanulacion is null AND
                    cmp.idsucursal = v_idsucursal AND
                    cd.idarticulo = v_idarticulo
                order by cd.id desc
                limit 1;





                select
                   if(cmp.fechahora is null,now(),cmp.fechahora)
                INTO
                    v_fechacompraposterior
                FROM
                    comprasdetalle as cd
                    INNER JOIN compras as cmp on cd.idcabecera = cmp.id
                    LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idanulacion
                    LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idcompra
                    LEFT JOIN comprasdudosas as duda ON cd.id = duda.idcompradetalle
                WHERE
					(duda.audicionresultado IS NULL OR duda.audicionresultado =2 ) AND
                    cd.id > v_iddetalle AND
                    cd.cantidad > 0 AND
                    ca.idanulacion is null AND
                    ca2.idanulacion is null AND
                    cmp.idsucursal = v_idsucursal AND
                    cd.idarticulo = v_idarticulo
                order by cd.id asc
                limit 1;



				IF v_fechacompraposterior IS NULL THEN
					SET v_fechacompraposterior = NOW();
				END IF;



				select cd.precio, cd.id
				INTO v_costoarticulonuevo,v_iddetallearticulonuevo
				FROM
					comprasdetalle as cd
					INNER JOIN compras as cmp on cd.idcabecera = cmp.id
					LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idanulacion
					LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idcompra
					LEFT JOIN comprasdudosas as duda ON cd.id = duda.idcompradetalle
				WHERE
					(duda.audicionresultado IS NULL OR duda.audicionresultado =2 ) AND
					cd.cantidad > 0 AND
					ca.idanulacion is null AND
					ca2.idanulacion is null AND
					cd.idarticulo = v_idarticulo
				order by precio desc
				limit 1;



				#Establezco en el historico el dia de hoy como el que se seteo el nuevo costo
				INSERT INTO articuloscostoshistorico(idarticulo,idcompradetalle,fechahora,medio)
				SELECT id,v_iddetallearticulonuevo,now(),'RECALCULO' FROM articulos WHERE id = v_idarticulo and idcompradetalle = v_iddetalle;


				UPDATE articulos
				SET costo = v_costoarticulonuevo, idcompradetalle = v_iddetallearticulonuevo, fechamodificacion = now()
				WHERE idcompradetalle = v_iddetalle;



                select
                    cd.precio
                INTO
                    v_costo
                FROM
                    comprasdetalle as cd
                WHERE
                    cd.id = v_detalleanterior;



                IF not v_detalleanterior is null THEN


                    UPDATE ventassucursal as vs
                          LEFT JOIN ventassucursalextra as vse ON vs.id = vse.idventa
                    SET vse.idcompradetalle = v_detalleanterior,costosucursal = v_costo
                    WHERE vse.idcompradetalle = v_iddetalle ;
				ELSE
                    UPDATE ventassucursal as vs
                          LEFT JOIN ventassucursalextra as vse ON vs.id = vse.idventa
							INNER JOIN articulos as art on vs.idarticulo = art.id
                    SET vse.idcompradetalle = art.idcompradetalle ,costosucursal = art.costo
                    WHERE vse.idcompradetalle = v_iddetalle ;

                END IF;


        END LOOP;

END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists updActualizarReferenciasCostos');

        DB::unprepared("
 CREATE PROCEDURE `updActualizarReferenciasCostos`(IN `p_iddetalle` bigint(20),
 IN `p_idcabecera` bigint(20))
BEGIN

  DECLARE v_detalleanterior BIGINT(20);
  DECLARE v_idarticulo BIGINT(20);
  DECLARE v_idsucursal BIGINT(20);
  DECLARE v_idcabecera BIGINT(20);
  DECLARE v_iddetalle BIGINT(20);
  DECLARE v_costo DECIMAL(10,3);
  DECLARE v_idcompraarticuloactual DECIMAL(10,3);
  DECLARE v_costo_compra DECIMAL(10,3);
  DECLARE v_reversionar TINYINT(4);
  DECLARE v_fechaauxiliar DATETIME;
  DECLARE v_fechacompra DATETIME;
  DECLARE v_fechacompraanterior DATETIME;
  DECLARE v_fechacompraposterior DATETIME;

  DECLARE v_costoarticulonuevo DECIMAL(10,3);
  DECLARE v_iddetallearticulonuevo BIGINT(20);

  DECLARE v_fin BOOL DEFAULT FALSE;
  DECLARE v_compras CURSOR FOR SELECT DISTINCT cmp.id,cd.id AS iddetalle,cmp.idsucursal,cd.idarticulo, 1 as reversionar,cmp.fechahora,precio
                                     FROM compras as cmp
                                          INNER JOIN comprasdetalle as cd ON cmp.id = cd.idcabecera
                                     WHERE
                                      cd.id = p_iddetalle OR
                                      cmp.id = p_idcabecera ;

    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET v_fin = TRUE;


   OPEN v_compras;
       Recorre_Cursor: LOOP
            FETCH v_compras INTO v_idcabecera,v_iddetalle,v_idsucursal,v_idarticulo,v_reversionar,v_fechacompra,v_costo_compra;

            IF v_fin THEN
                LEAVE Recorre_Cursor;
            END IF;




                select
                    cd.id,
                    cmp.fechahora
                INTO
                    v_detalleanterior,
                    v_fechacompraanterior
                FROM
                    comprasdetalle as cd
                    INNER JOIN compras as cmp on cd.idcabecera = cmp.id
                    LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idanulacion
                    LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idcompra
					LEFT JOIN comprasdudosas as duda ON cd.id = duda.idcompradetalle
                WHERE
					(duda.audicionresultado IS NULL OR audicionresultado =2 ) AND
                    cd.id < v_iddetalle AND
                    cd.cantidad > 0 AND
                    ca.idanulacion is null AND
                    ca2.idanulacion is null AND
                    cmp.idsucursal = v_idsucursal AND
                    cd.idarticulo = v_idarticulo
                order by cd.id desc
                limit 1;





                select
                   if(cmp.fechahora is null,now(),cmp.fechahora)
                INTO
                    v_fechacompraposterior
                FROM
                    comprasdetalle as cd
                    INNER JOIN compras as cmp on cd.idcabecera = cmp.id
                    LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idanulacion
                    LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idcompra
                    LEFT JOIN comprasdudosas as duda ON cd.id = duda.idcompradetalle
                WHERE
					(duda.audicionresultado IS NULL OR duda.audicionresultado =2 ) AND
                    cd.id > v_iddetalle AND
                    cd.cantidad > 0 AND
                    ca.idanulacion is null AND
                    ca2.idanulacion is null AND
                    cmp.idsucursal = v_idsucursal AND
                    cd.idarticulo = v_idarticulo
                order by cd.id asc
                limit 1;



				IF v_fechacompraposterior IS NULL THEN
					SET v_fechacompraposterior = NOW();
				END IF;



				select cd.precio, cd.id
				INTO v_costoarticulonuevo,v_iddetallearticulonuevo
				FROM
					comprasdetalle as cd
					INNER JOIN compras as cmp on cd.idcabecera = cmp.id
					LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idanulacion
					LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idcompra
					LEFT JOIN comprasdudosas as duda ON cd.id = duda.idcompradetalle
				WHERE
					(duda.audicionresultado IS NULL OR duda.audicionresultado =2 ) AND
					cd.cantidad > 0 AND
					ca.idanulacion is null AND
					ca2.idanulacion is null AND
					cd.idarticulo = v_idarticulo
				order by precio desc
				limit 1;



				#Establezco en el historico el dia de hoy como el que se seteo el nuevo costo
				INSERT INTO articuloscostoshistorico(idarticulo,idcompradetalle,fechahora,medio)
				SELECT id,v_iddetallearticulonuevo,now(),'RECALCULO' FROM articulos WHERE id = v_idarticulo and idcompradetalle = v_iddetalle;


				UPDATE articulos
				SET costo = v_costoarticulonuevo, idcompradetalle = v_iddetallearticulonuevo, fechamodificacion = now()
				WHERE idcompradetalle = v_iddetalle;



                select
                    cd.precio
                INTO
                    v_costo
                FROM
                    comprasdetalle as cd
                WHERE
                    cd.id = v_detalleanterior;



                IF not v_detalleanterior is null THEN


                    UPDATE ventassucursal as vs
                          LEFT JOIN ventassucursalextra as vse ON vs.id = vse.idventa
                    SET vse.idcompradetalle = v_detalleanterior,costosucursal = v_costo
                    WHERE vse.idcompradetalle = v_iddetalle ;
				ELSE
                    UPDATE ventassucursal as vs
                          LEFT JOIN ventassucursalextra as vse ON vs.id = vse.idventa
							INNER JOIN articulos as art on vs.idarticulo = art.id
                    SET vse.idcompradetalle = art.idcompradetalle ,costosucursal = art.costo
                    WHERE vse.idcompradetalle = v_iddetalle ;

                END IF;


        END LOOP;

END");
    }
};
