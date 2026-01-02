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

        DB::unprepared('drop procedure if exists getActualizacionCompras');

        DB::unprepared("
CREATE PROCEDURE `getActualizacionCompras`(IN `p_idsucursal` BIGINT(20))
begin

SELECT
  cmp.id,
  cmp.fechaEmision,
  cmp.fechaHora,
  cmp.tipoFactura,
  usuarios.id AS usuarioId,
  usuarios.nombre AS usuarioNombre,
  sucursales.id AS sucursalId,
  sucursales.nombre AS sucursalNombre,
  cmp.totalFactura,
  proveedores.id AS proveedorId,
  proveedores.nombre AS proveedorNombre,
  cmp.numerocaja AS numeroCaja,
  cmp.numero as numeroFactura,
  tc.id AS idtipocomprobante,
  tc.nombre AS tipoComprobanteNombre,
  cmp.idunico,
  cmp.idestado,
  cmp.idusuariocaja,
  cmp.mododepago,
  cmp.idsucursalcaja,
  cmp.idletra,
  cmp.observaciones
FROM
  compras as cmp
  INNER JOIN usuarios ON cmp.idusuario = usuarios.id
  INNER JOIN sucursales ON cmp.idsucursal = sucursales.id
  INNER JOIN proveedores ON cmp.idproveedor = proveedores.id
  INNER JOIN tiposcomprobantes As tc ON cmp.idtipocomprobante = tc.id
  INNER JOIN versionesactualizacion AS vrsa ON vrsa.iditem = cmp.id
  INNER JOIN versiones  AS vrs ON vrsa.idversion = vrs.id
  INNER JOIN motivosactualizaciones AS mtva ON vrs.idmotivoactualizacion = mtva.id
WHERE
    mtva.codigo = 'GET-ACOMPRA' AND
    vrsa.actualizada <> 1 AND
    vrsa.idsucursal = p_idsucursal ;

END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Down simply drops the procedure; if you want to restore previous version, paste the old body here.
        DB::unprepared('DROP PROCEDURE IF EXISTS `getActualizacionCompras`');
    }
};
