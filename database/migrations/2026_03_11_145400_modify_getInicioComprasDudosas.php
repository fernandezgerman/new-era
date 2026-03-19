<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        DB::unprepared('drop procedure if exists getInicioComprasDudosas');

        DB::unprepared("
          CREATE  PROCEDURE `getInicioComprasDudosas`(
          IN `p_fechadesde` DATE,
          IN `p_fechahasta` DATE,
          IN p_usuario_logueado BIGINT(20),
          IN p_idcompradetalle  BIGINT(20),
          IN p_todos BIGINT(20),
          IN p_tipo_de_duda VARCHAR(80)
          )
begin
  DECLARE `v_fechahasta` DATE;
  DECLARE `v_fechadesde` DATE;

  IF p_fechahasta IS NULL THEN
    SELECT
      now()
    INTO
      v_fechahasta;
  ELSE
    SET v_fechahasta = p_fechahasta;
  END IF;

  IF p_fechadesde IS NULL THEN
    SELECT
      date_add( now() ,INTERVAL -3 DAY)
    INTO
      v_fechadesde;
  ELSE
    SET v_fechadesde = p_fechadesde;
  END IF;


  SELECT
    DATE_FORMAT(cmp.fechahora,'%d/%m/%Y %H:%i') as fechahora,
    tc.nombre as  tipofactura,
    usr.id as idusuario,
    concat(usr.nombre,' ',usr.apellido) as usuario,
    concat(usr_audito.nombre,' ',usr_audito.apellido) as usuarioAudito,

    suc.nombre as sucursal,
    cmp.idsucursal,
    art.nombre as articulo,
    art.codigo,
    cd.cantidad,
    cd.precio,
    cmp.observaciones,
    if(cmp.mododepago=1,'Contado','Credito') as mododepago,
    cmp.totalfactura,
    prv.nombre as proveedor,
    cmp.numero,
    if(cc.importe is null,cd.precio ,duda.costoanterior) as costoConImpuestos,
    if(cc.importe is null,
		((cd.precio - duda.costoanterior ) /duda.costoanterior * 100)  ,
		((duda.costoanterior - cc.importe) /cc.importe * 100)
        )as porcentaje,

    if(cc.importe is null,
		cd.precio - duda.costoanterior,
		duda.costoanterior - cc.importe
        )as diferencia,

    DATE_FORMAT(v_fechadesde,'%d/%m/%Y') as fechadesde,
    DATE_FORMAT(v_fechahasta,'%d/%m/%Y') as fechahasta ,

    if(duda.idusuarioaudito IS NULL ,0,1) as auditada,
    duda.observacionescompradudosa ,
    duda.precioventa ,
    duda.tipodeduda ,
    cd.id as iddetalle,
    observacionesaudicion,
    idcompradetallecomparacion,
    if(indicesuperior is null, 20,indicesuperior * 100) as indicesuperior,
    if(indiceinferior is null, 1,indiceinferior * 100) as indiceinferior,
    if(cc.importe is null,duda.costoanterior,cc.importe) as costoArticulo,
    if(cc.importe is null,duda.costoanterior,comparacion.precio) as costoArticuloSinImp,



    DATE_FORMAT(comparacioncabecera.fechahora,'%d/%m/%Y %H:%i') as fechahoracomparada,
    concat(usrcomp.nombre,' ',usrcomp.apellido) as usuariocomparada,
    comparacion.cantidad as cantidadcomparada,
    prvcom.nombre as proveedorcomparada,
    comparacioncabecera.totalfactura as totalfacturacomparada,

    comparacioncabecera.numero as numerocomparada,
    if(comparacioncabecera.mododepago=1,'Contado','Credito') as mododepagocomparada

  FROM

    compras as cmp
    INNER JOIN  comprasdetalle as cd ON cmp.id = cd.idcabecera
    INNER JOIN usuariossucursales as us ON cmp.idsucursal = us.idsucursal
    INNER JOIN usuarios as usr ON cmp.idusuario = usr.id
    INNER JOIN articulos as art ON cd.idarticulo = art.id
    INNER JOIN sucursales as suc ON cmp.idsucursal = suc.id
    INNER JOIN proveedores as prv ON cmp.idproveedor = prv.id
    INNER JOIN tiposcomprobantes as tc ON cmp.idtipocomprobante = tc.id
    INNER JOIN comprasdudosas as duda ON cd.id = duda.idcompradetalle
    LEFT JOIN usuarios as usr_audito ON duda.idusuarioaudito = usr_audito.id
    LEFT JOIN comprasdetalle as comparacion ON duda.idcompradetallecomparacion = comparacion.id
    LEFT JOIN costoscompra as cc on comparacion.id = cc.iddetalle AND cc.idtipocosto = 1
    LEFT JOIN compras as comparacioncabecera ON comparacion.idcabecera = comparacioncabecera.id
    LEFT JOIN proveedores as prvcom ON comparacioncabecera.idproveedor = prvcom.id
    LEFT JOIN usuarios as usrcomp ON comparacioncabecera.idusuario = usrcomp.id
  WHERE
    us.activo = 1 AND
    us.idusuario =  p_usuario_logueado AND
    (v_fechadesde IS NULL OR date(cmp.fechahora) >= date(v_fechadesde)) AND
    (v_fechahasta IS NULL OR date(cmp.fechahora) <= date(v_fechahasta) )AND
    (duda.idusuarioaudito is null OR p_todos = 1) AND
    (p_idcompradetalle is null OR p_idcompradetalle = cd.id) AND
    (p_tipo_de_duda IS NULL OR p_tipo_de_duda = (duda.tipodeduda COLLATE utf8mb4_unicode_ci))

  ORDER BY
    suc.nombre,abs(if(cc.importe is null,
		((cd.precio - duda.costoanterior ) /duda.costoanterior * 100)  ,
		((duda.costoanterior - cc.importe) /cc.importe * 100)
        ))  DESC;


END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Down simply drops the procedure; if you want to restore previous version, paste the old body here.
        DB::unprepared('drop procedure if exists getInicioComprasDudosas');
    }
};
