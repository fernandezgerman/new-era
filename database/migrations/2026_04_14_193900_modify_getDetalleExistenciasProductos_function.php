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

        DB::unprepared('DROP procedure IF EXISTS `getDetalleExistenciasProductos`');

        DB::unprepared("
CREATE  PROCEDURE `getDetalleExistenciasProductos`(IN p_articuloid BIGINT(20),
												  IN p_usuario_login_id BIGINT(20))
BEGIN

DECLARE v_id BIGINT(20);

	SELECT
		art.id,
		art.nombre,
        art.codigo,
        ex.cantidad,
        suc.nombre AS sucursal,
        DATE_FORMAT(detalles.fecha,'%d/%m/%y') as fecha,
#        ifnull(cc.importe, cd.precio) as importeconimpuesto,
        ifnull(cc.importe, cd.precio) as importeconimpuesto,
        cd.precio as costo,
        cd.idcabecera as idcompra,
        cd.id as idcompradetalle,
        prv.nombre as proveedornombre,
        cmp.id as idcompra
    FROM
		existencias as ex
		INNER JOIN articulos as art ON ex.idarticulo = art.id
        INNER JOIN sucursales as suc ON ex.idsucursal = suc.id
        INNER JOIN usuariossucursales as us ON suc.id= us.idsucursal AND us.activo = 1 AND us.idusuario = p_usuario_login_id
        LEFT JOIN
					(
						SELECT
							max(cd.id)as iddetalle,idsucursal, idarticulo,max(cmp.fechahora) as fecha
						FROM
							compras as cmp
							INNER JOIN comprasdetalle as cd ON cmp.id = cd.idcabecera
							LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idcompra
							LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idanulacion
						WHERE
							ca.idcompra IS NULL AND
							ca2.idcompra IS NULL AND
							idtipocomprobante = 1 AND
							cd.idarticulo = p_articuloid
					   GROUP BY
							idsucursal, idarticulo
					UNION
						SELECT
							art.idcompradetalle as iddetalle,idsucursal, idarticulo, cmp.fechahora as fecha
						FROM
							compras as cmp
							INNER JOIN comprasdetalle as cd ON cmp.id = cd.idcabecera
                            INNER JOIN articulos as art ON cd.id = art.idcompradetalle
						WHERE
							art.id = p_articuloid

				) as detalles ON ex.idsucursal = detalles.idsucursal
		LEFT JOIN comprasdetalle as cd ON detalles.iddetalle = cd.id
		LEFT JOIN compras as cmp on cd.idcabecera = cmp.id
		LEFT JOIN proveedores as prv on cmp.idproveedor = prv.id
        LEFT JOIN costoscompra as cc ON cd.id = cc.iddetalle AND idtipocosto = 1

    WHERE
        art.id = p_articuloid
	ORDER BY
		art.idcompradetalle desc,cc.importe desc;
END ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists getDetalleExistenciasProductos');

        DB::unprepared("
CREATE  PROCEDURE `getDetalleExistenciasProductos`(IN p_articuloid BIGINT(20),
												  IN p_usuario_login_id BIGINT(20))
BEGIN

DECLARE v_id BIGINT(20);

	SELECT
		art.id,
		art.nombre,
        art.codigo,
        ex.cantidad,
        suc.nombre AS sucursal,
        DATE_FORMAT(detalles.fecha,'%d/%m/%y') as fecha,
#        ifnull(cc.importe, cd.precio) as importeconimpuesto,
        ifnull(cc.importe, cd.precio) as importeconimpuesto,
        cd.precio as costo,
        cd.idcabecera as idcompra,
        cd.id as idcompradetalle,
        prv.nombre as proveedornombre,
        cmp.id as idcompra
    FROM
		existencias as ex
		INNER JOIN articulos as art ON ex.idarticulo = art.id
        INNER JOIN sucursales as suc ON ex.idsucursal = suc.id
        INNER JOIN usuariossucursales as us ON suc.id= us.idsucursal AND us.activo = 1 AND us.idusuario = p_usuario_login_id
        LEFT JOIN
					(
						SELECT
							max(cd.id)as iddetalle,idsucursal, idarticulo,max(cmp.fechahora) as fecha
						FROM
							compras as cmp
							INNER JOIN comprasdetalle as cd ON cmp.id = cd.idcabecera
							LEFT JOIN comprasanuladas as ca ON cmp.id = ca.idcompra
							LEFT JOIN comprasanuladas as ca2 ON cmp.id = ca2.idanulacion
						WHERE
							ca.idcompra IS NULL AND
							ca2.idcompra IS NULL AND
							idtipocomprobante = 1 AND
							cd.idarticulo = p_articuloid
					   GROUP BY
							idsucursal, idarticulo
					UNION
						SELECT
							art.idcompradetalle as iddetalle,idsucursal, idarticulo, cmp.fechahora as fecha
						FROM
							compras as cmp
							INNER JOIN comprasdetalle as cd ON cmp.id = cd.idcabecera
                            INNER JOIN articulos as art ON cd.id = art.idcompradetalle
						WHERE
							art.id = p_articuloid

				) as detalles ON ex.idsucursal = detalles.idsucursal
		LEFT JOIN comprasdetalle as cd ON detalles.iddetalle = cd.id
		LEFT JOIN compras as cmp on cd.idcabecera = cmp.id
		LEFT JOIN proveedores as prv on cmp.idproveedor = prv.id
        LEFT JOIN costoscompra as cc ON cd.id = cc.iddetalle AND idtipocosto = 1

    WHERE
        art.id = p_articuloid
	ORDER BY
		art.idcompradetalle desc,cc.importe desc;
END ");
    }
};


