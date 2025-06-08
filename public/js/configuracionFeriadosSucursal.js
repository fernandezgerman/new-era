var datosReporte = Array();
function mostrarResultados(resultado) {
	_.templateSettings.variable = "resultado";

	var template = _.template($("#pantallaConfiguracion").html());
	$("#divResultado").html(
			template(resultado));
	mostrarFechaFila(resultado);
}
function mostrarFechaFila(resultado) {
	_.templateSettings.variable = "resultado";

	var template = _.template($("#feriadoEnFila").html());
	$("#divFechaFila").html(
			template(resultado));
}


$(document).ready(function() {
		mostrarResultados(datosReporte);	
});
function seleccionoDiaEnCalendario(id)
{
	
	if(id){
		if($("#SEL"+id).val()=="1"){
			$("#COL"+id).removeClass("diaMesFeriadosSeleccionado");
			$("#COL"+id).addClass("diaMesFeriados");
			$("#SEL"+id).val("0");
			quitarFeriado(id);
		}else{
			$("#COL"+id).removeClass("diaMesFeriados");
			$("#COL"+id).addClass("diaMesFeriadosSeleccionado");
			$("#SEL"+id).val("1");	
			agregarFeriado(id);
		}
	}
	mostrarFechaFila(datosReporte);
	
	
}
function agregarFeriado(fecha){
	feriados = datosReporte['feriados'];
	entro = false;
	for(f=0;f < datosReporte['totalFeriados']; f++)
	{
		feriado = feriados[f];
		if (feriado.fecha == fecha){
			feriado.id = feriado.id * -1;
			feriados[f]=feriado;
			entro = true;
		}
	}	
	if (!entro){
		feriados[datosReporte['totalFeriados']] = {'id':0,'anio':$('#anioSeleccionado').val(),'fecha':fecha}
		datosReporte['totalFeriados'] = datosReporte['totalFeriados'] + 1;
	}
	datosReporte['feriados'] = feriados;
}
function quitarFeriado(fecha){
	feriados = datosReporte['feriados'];
	arr = Array();
	indice = 0;
	for(f=0;f < datosReporte['totalFeriados']; f++)
	{
		feriado = feriados[f];
		if (feriado.fecha != fecha){
			arr[indice]=feriado;
			indice++;
		}else{
			if (feriado.id != 0)
			{
				feriado.id = feriado.id * -1; 
				arr[indice]=feriado;
				indice++;							
			}

		}
	}
	datosReporte['feriados'] = arr;
	datosReporte['totalFeriados'] = indice;
}
function cambioSeleccionAnio(){
	anio = $('#anioSeleccionado').val();
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=cnfgcnfrds';
	
	$('#frm').attr('action',action);
	$("#frm" ).submit();	
	
}
function guardarCambios(){
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=gstsaddnvosve';
	
	$('#frmGuardar').attr('action',action);
	$("#frmGuardar" ).submit();	
	
}
/*
function buscarDatos(){
	if ($("#inpFechaDesde").val()==""){
		alert('Debe ingresar una fecha desde.');
		return;
	}
	if ($("#inpFechaHasta").val()==""){
		alert('Debe ingresar una fecha hasta.');
		return;
	}	
	
	$("#frm" ).submit();		
}
function verDetalleVentas(idsucursal){
	
	
	$("#formRentabilidadVentas input[name=inpSucursalBalance]").val(idsucursal);
	$("#formRentabilidadVentas input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptvspr';
	
	$('#formRentabilidadVentas').attr('action',action);
	$("#formRentabilidadVentas" ).submit();	
}
function verDetalleGastos(idsucursal){
	
	$("#formGastos input[name=inpIdSucursalSel]").val(idsucursal);
	$("#formGastos input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptcompras';
	
	$('#formGastos').attr('action',action);
	$("#formGastos" ).submit();	
}
function verDetalleArreglosStock(idsucursal){
	$("#formRentControlesDeStock input[name=inpSucursalBalance]").val(idsucursal);	
	$("#formRentControlesDeStock input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptbalsuc';
	
	$('#formRentControlesDeStock').attr('action',action);
	$("#formRentControlesDeStock" ).submit();	
}
function verDetalleSobrantes(idsucursal){
	$("#formRentSobrantes input[name=inpSucursalBalance]").val(idsucursal);	
	$("#formRentSobrantes input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptbalsuc';
	
	$('#formRentSobrantes').attr('action',action);
	$("#formRentSobrantes" ).submit();	
}*/