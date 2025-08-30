function verDetalleConsumo(idusuario,idsucursal){
	
	
	$("#frmConsumoDetalle input[name=inpCodigo]").val($("#frm input[name=inpCodigo]").val());
	$("#frmConsumoDetalle input[name=inpUsuarioId]").val(idusuario);
	$("#frmConsumoDetalle input[name=inpSucursalId]").val(idsucursal);
	$("#frmConsumoDetalle input[name=inpRubroId]").val($("#frm input[name=inpRubroId]").val());
	$("#frmConsumoDetalle input[name=inpTipoDescuentoId]").val($("#frm input[name=inpTipoDescuentoId]").val());
	$("#frmConsumoDetalle input[name=inpFechaDesde]").val($("#frm input[name=inpFechaDesde]").val());
	$("#frmConsumoDetalle input[name=inpFechaDesdeHora]").val($("#frm input[name=inpFechaDesdeHora]").val());
	$("#frmConsumoDetalle input[name=inpFechaHasta]").val($("#frm input[name=inpFechaHasta]").val());
	$("#frmConsumoDetalle input[name=inpFechaHastaHora]").val($("#frm input[name=inpFechaHastaHora]").val());

	$("#frmConsumoDetalle" ).submit();		
}