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

        DB::unprepared('drop procedure if exists getVentasSucursalesUltimaCaja');

        DB::unprepared("
CREATE procedure`getVentasSucursalesUltimaCaja`(
        IN p_idsucursal BIGINT(20)
        )
BEGIN
   SELECT
        vts.id AS id,
        usr.id AS usuarioId,
        usr.nombre AS usuarioNombre,
        usr.apellido AS usuarioApellido,
        suc.id AS sucursalId,
        suc.nombre AS sucursalNombre,
        art.id AS articuloId,
        art.nombre AS articuloNombre,
        art.codigo AS articuloCodigo,
        lst.id AS listaId,
        lst.nombre AS listaNombre,
        vts.cantidad AS cantidad,
        vts.preciounitario AS preciounitario,
        vts.costo AS costo,
        vts.fechaenvio AS fechaenvio,
        vts.fechacreacion AS fechacreacion,
        vts.idventa as idunicoventa,
      vts.numerocaja,
      vd.idmotivodescuento,
      vd.idtipodescuento,
      vd.valorasociado,
      vd.valordescuento,
      vd.idventa,
      vd.id as iddescuento,
      vd.idusuarioautorizo ,
      vsc.idunicocobro
  FROM

      (SELECT
        idusuario,
        numero
       FROM
        cajas
       WHERE
        idsucursal = p_idsucursal AND

        (idestado = 0 OR idestado IS NULL )
        ) AS ca,
        ventasdescuentos as vd  RIGHT JOIN
      (usuarios AS usr INNER JOIN
      (listas AS lst INNER JOIN
      (sucursales AS suc INNER JOIN
      (ventassucursal AS vts INNER JOIN articulos AS art ON vts.idarticulo = art.id)
      ON suc.id = vts.idsucursal)
      ON lst.id = suc.idlista)
      ON usr.id = vts.idusuario)
      ON vd.idventa = vts.id
      LEFT JOIN ventassucursalcobrosdetalle as vscd ON vts.id = vscd.idventasucursal
      LEFT JOIN ventassucursalcobros as vsc ON vscd.idventasucursalcobro = vsc.id
  WHERE
	vts.id > 36073892 and
    vts.idsucursal = p_idsucursal AND
    vts.idusuario = ca.idusuario AND
    vts.numerocaja = ca.numero
   ORDER BY
      vts.fechaenvio desc
      ;
END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists getVentasSucursalesUltimaCaja');

        DB::unprepared("
CREATE procedure`getVentasSucursalesUltimaCaja`(
        IN p_idsucursal BIGINT(20)
        )
BEGIN
   SELECT
        vts.id AS id,
        usr.id AS usuarioId,
        usr.nombre AS usuarioNombre,
        usr.apellido AS usuarioApellido,
        suc.id AS sucursalId,
        suc.nombre AS sucursalNombre,
        art.id AS articuloId,
        art.nombre AS articuloNombre,
        art.codigo AS articuloCodigo,
        lst.id AS listaId,
        lst.nombre AS listaNombre,
        vts.cantidad AS cantidad,
        vts.preciounitario AS preciounitario,
        vts.costo AS costo,
        vts.fechaenvio AS fechaenvio,
        vts.fechacreacion AS fechacreacion,
        vts.idventa as idunicoventa,
      vts.numerocaja,
      vd.idmotivodescuento,
      vd.idtipodescuento,
      vd.valorasociado,
      vd.valordescuento,
      vd.idventa,
      vd.id as iddescuento,
      vd.idusuarioautorizo ,
      vsc.idunicocobro
  FROM

      (SELECT
        idusuario,
        numero
       FROM
        cajas
       WHERE
        idsucursal = p_idsucursal AND

        (idestado = 0 OR idestado IS NULL )
        ) AS ca,
        ventasdescuentos as vd  RIGHT JOIN
      (usuarios AS usr INNER JOIN
      (listas AS lst INNER JOIN
      (sucursales AS suc INNER JOIN
      (ventassucursal AS vts INNER JOIN articulos AS art ON vts.idarticulo = art.id)
      ON suc.id = vts.idsucursal)
      ON lst.id = suc.idlista)
      ON usr.id = vts.idusuario)
      ON vd.idventa = vts.id
      LEFT JOIN ventassucursalcobrosdetalle as vscd ON vts.id = vscd.idventasucursal
      LEFT JOIN ventassucursalcobros as vsc ON vscd.idventasucursalcobro = vsc.id
  WHERE
    vts.idsucursal = p_idsucursal AND
    vts.idusuario = ca.idusuario AND
    vts.numerocaja = ca.numero
   ORDER BY
      vts.fechaenvio desc
      ;
END
        ");
    }
};
