function inicioRendicionesStockReporte(idsucursal,fecha){
	$("#frmRendicionesStockFiltros input[name=inpSucursalId]").val(idsucursal);
	$("#frmRendicionesStockFiltros input[name=inpFechaDesde]").val(fecha);
	$("#frmRendicionesStockFiltros input[name=inpFechaHasta]").val(fecha);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=renstockrep';
	
	$('#frmRendicionesStockFiltros').attr('action',action);
	$("#frmRendicionesStockFiltros" ).submit();	
}
function inicioRendicionesStockReportePorDia(idsucursal){
	$("#frmRendicionesStockFiltrosPorDia input[name=inpSucursalId]").val(idsucursal);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=reprenstckfal';
	
	$('#frmRendicionesStockFiltrosPorDia').attr('action',action);
	$("#frmRendicionesStockFiltrosPorDia " ).submit();	
}
