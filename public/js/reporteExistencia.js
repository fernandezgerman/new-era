function ExistenciaExportarExcel(){
	/*
	$("#formGanancias input[name=inpFechaHasta]").val(fecha);
	$("#formGanancias input[name=inpFechaDesde]").val(fecha);

	$("#formGanancias input[name=inpSucursalDesdeReporte]").val(idsucursal);
	

	*/

    action = 'reporteExistenciaExcel.php?token='+$('#mToken').val();
    $('#frm').attr('target','');
	$('#frm').attr('action',action);
	$("#frm" ).submit();
}
function ExistenciaExportarPDF(){
    action = 'reporteExistenciaPDF.php?token='+$('#mToken').val();
    $('#frm').attr('target','_blank');
    $('#frm').attr('action',action);
    $("#frm" ).submit();
}
function MostrarDatos(){
    action = 'principal.php?pagina=stckl&token='+$('#mToken').val();
    $('#frm').attr('target','');
    $('#frm').attr('action',action);
    $("#frm" ).submit();
}