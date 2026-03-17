<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        DB::unprepared('drop procedure if exists setCompraSucursal');

        DB::unprepared("
          CREATE  PROCEDURE `setCompraSucursal`(
      IN `p_fechaemision` datetime,
      IN `p_fechahora` datetime,
      IN `p_tipofactura` varchar(40),
      IN `p_idusuario` bigint(20),
      IN `p_idsucursal` bigint(20),
      IN `p_totalfactura` double,
      IN `p_idproveedor` bigint(20),
      IN `p_numero` text,
      IN `p_numerocaja` bigint(20),
      IN `p_idusuariocaja` bigint(20),
      IN `p_idsucursalcaja` bigint(20),
      IN `p_mododepago` bigint(20),
      IN `p_idestado` bigint(20),
      IN `p_idtipocomprobante` bigint(20),
      IN `p_observaciones` varchar(250),
      IN `p_idunico` varchar(200),
      IN `p_idletra` bigint(20)
  )
BEGIN

  DECLARE v_numerocaja BIGINT(20);
  DECLARE v_idestado BIGINT(20);

  DECLARE v_multiplo BIGINT(20);
  DECLARE v_dias_vencimiento BIGINT(20);
  DECLARE v_idcompra BIGINT(20);


  DECLARE v_existe BIGINT(1);



  IF p_idtipocomprobante = 2 THEN
    set v_multiplo = -1;
  ELSE
    set v_multiplo = 1;
  END IF;

  IF p_mododepago = 1 THEN
    set v_idestado = 1;
  ELSE
    set v_idestado = 3;
  END IF;


  SELECT
    1
  INTO
    v_existe
  FROM
    compras
  WHERE idunico = p_idunico
  LIMIT 1;

  IF v_existe IS NULL THEN

        INSERT INTO compras(
          fechaemision,
          tipofactura,
          idusuario,
          idsucursal,
          totalfactura,
          idproveedor,
          numero,
          fechahora,
          numerocaja,
          idusuariocaja,
          idsucursalcaja,
          mododepago,
          idestado,
          idtipocomprobante,
          observaciones,
          idunico,
          fechacreacion,
          idletra
        )
        VALUES (
         `p_fechaemision`,
          p_tipofactura,
          p_idusuario,
          p_idsucursal,
          abs(p_totalfactura) * v_multiplo,
          p_idproveedor,
          p_numero,
          p_fechahora,
          p_numerocaja,
          p_idusuariocaja,
          p_idsucursalcaja,
          p_mododepago,
          p_idestado,
          p_idtipocomprobante,
          p_observaciones  COLLATE utf8mb4_unicode_ci,
          p_idunico,
          now(),
          p_idletra
        );
        SET v_idcompra = @@identity;

        IF p_mododepago = 2 THEN
            SELECT diasvencimiento INTO v_dias_vencimiento FROM proveedores WHERE id = p_idproveedor;

            INSERT INTO comprascredito(idcompra,fechavencimiento) VALUES(v_idcompra,date_add(now(),INTERVAL v_dias_vencimiento DAY) );
        END IF;

       SELECT
        compras.id as id,
        compras.fechaemision,
        compras.fechahora,
        compras.tipofactura,
        usuarios.id AS usuarioId,
        usuarios.nombre AS usuarioNombre,
        sucursales.id AS sucursalId,
        sucursales.nombre AS sucursalNombre,
        compras.totalfactura,
        proveedores.id AS proveedorId,
        proveedores.nombre AS proveedorNombre,
        compras.mododepago,
        compras.observaciones,
        compras.idletra
      FROM
        ((compras INNER JOIN usuarios ON
        compras.idusuario = usuarios.id ) INNER JOIN sucursales ON
        compras.idsucursal = sucursales.id ) INNER JOIN proveedores ON
        compras.idproveedor = proveedores.id
      WHERE
        compras.id = v_idcompra;

  ELSE
      UPDATE compras SET numerocaja = p_numerocaja, observaciones = p_observaciones  WHERE idunico = p_idunico;
      SELECT -1 as id;
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
