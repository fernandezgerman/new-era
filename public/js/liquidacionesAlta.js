
function mostrarReporte(resultado)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#grillaTemplate" ).html()
        );
    $( "#divGrilla" ).html(
            template( resultado)
        );
}
function mostrarTotales(resultado)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#totalesTemplate" ).html()
        );
    $( "#divTotales" ).html(
            template(resultado)
        );    
}

function getMotivos(){
	$tm = $('#inpTotalMotivos').val();
	$mot = ",";
	for($m = 0; $m <= $tm; $m++){
		if ($('#mot'+$m).is(':checked')){
			$mot = $mot + $('#mot'+$m).val() +",";
		}
	}
	return $mot;
}
function getSucursales(){
	$ts = $('#inpTotalSucursales').val();
	$suc = ",";
	for($s = 0; $s <= $ts; $s++){
		if ($('#suc'+$s).is(':checked')){
			$suc = $suc + $('#suc'+$s).val() +",";
		}
	}
	return $suc;
}
function datosvalidos(suc,mot,fecha){
	if (suc==","){
		alert("Debe seleccionar almenos una sucursal.");
		return false;
	}
	if (mot==","){
		alert("Debe seleccionar almenos un motivo.");
		return false;
	}
	if (fecha==""){
		alert("Debe ingresar una fecha.");
		return false;
	}	
	return true;
}
function cargarGrilla(){
	$sucursales= getSucursales();
	$motivos = getMotivos();
	$fecha = $('#inpFechaEmision').val();
	
	if (!datosvalidos($sucursales,$motivos,$fecha)){
		return false;
	}
	
	$.ajax({
		url : 'ajaxLiquidacionesGrilla.php?token='+document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'sucursales':$sucursales,
				'motivos':$motivos,
				'fechaDesde':$fecha
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.error == 0){
				mostrarReporte(json);
				mostrarTotales(json);
				/*$("#inpPaginacionTotalRegistros").val(json.totalRegistros);
				actualizarRegistrosPorPaginas();
				finCargaArticulos();	
				alert('OK');*/
			}else{
				
				alert(json.descripcionError);
				
			}
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});

}

function mostrarDetalleGanancias(fecha,idsucursal){
	$("#formGanancias input[name=inpFechaHasta]").val(fecha);
	$("#formGanancias input[name=inpFechaDesde]").val(fecha);

	$("#formGanancias input[name=inpSucursalDesdeReporte]").val(idsucursal);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=lstvts';
	$('#formGanancias').attr('action',action);
	$("#formGanancias" ).submit();	
}
function mostrarDetalleSobrantes(fecha,idsucursal){
	$('#inpFechaAperturaHasta').val(fecha);
	$('#inpFechaAperturaDesde').val(fecha);
	$('#inpSucursalBalance').val(idsucursal);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptbalsuc';
	$('#formSobrantes').attr('action',action);
	$("#formSobrantes" ).submit();	
}
function mostrarDetalleArreglos(fecha,idsucursal){
	$("#formGananciasArreglos input[name=inpFechaAperturaHasta]").val(fecha);
	$("#formGananciasArreglos input[name=inpFechaAperturaDesde]").val(fecha);
	$("#formGananciasArreglos input[name=inpSucursalBalance]").val(idsucursal);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptbalsuc';
	$('#formGananciasArreglos').attr('action',action);
	$("#formGananciasArreglos" ).submit();	
}
function mostrarDetalleMovimientosStock(fecha,idsucursal){
	$("#formMovimientosStock input[name=inpFechaHasta]").val(fecha);
	$("#formMovimientosStock input[name=inpFechaDesde]").val(fecha);
	$("#formMovimientosStock input[name=inpSucursalIdUnico]").val(idsucursal);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptstckbjs';
	$('#formMovimientosStock').attr('action',action);
	$("#formMovimientosStock" ).submit();	
}
function mostrarDetalleMovimientos(fecha,idsucursal){
	$("#formMovimientos input[name=inpFechaHoraMovimientoHasta]").val(fecha);
	$("#formMovimientos input[name=inpFechaHoraMovimientoDesde]").val(fecha);
	$("#formMovimientos input[name=inpSucursalId]").val(idsucursal);
	$("#formMovimientos input[name=cadenaMotivos]").val(getMotivos());
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=mvmcjal';
	$('#formMovimientos').attr('action',action);
	$("#formMovimientos" ).submit();	
}
function modificarTotales(idcheck,tgan,tarr,tmov,tmovstck){
	$("#divCelda"+idcheck).removeClass();
	if ($('#'+idcheck).is(':checked')){
		multiplo = 1;
		$("#divCelda"+idcheck).addClass("liquidacionSeleccionada");
	}else{
		multiplo = -1;
	}
	
	inpTotalMovimientoStock = parseFloat($('#inpTotalMovimientoStock').val()) + parseFloat(tmovstck) * multiplo;
	inpTotalGanancia = parseFloat($('#inpTotalGanancia').val()) + parseFloat(tgan) * multiplo;
	inpTotalArreglo = parseFloat($('#inpTotalArreglo').val()) + parseFloat(tarr) * multiplo;
	inpTotalMovimiento = parseFloat($('#inpTotalMovimiento').val()) + parseFloat(tmov) * multiplo;
	inpTotal = parseFloat($('#inpTotal').val()) + (parseFloat(tgan) + parseFloat(tmovstck) + parseFloat(tarr)+ parseFloat(tmov)) * multiplo;
	
	$('#inpTotalMovimientoStock').val(formatearPrecio(inpTotalMovimientoStock));
	$('#inpTotalGanancia').val(formatearPrecio(inpTotalGanancia));
	$('#inpTotalArreglo').val(formatearPrecio(inpTotalArreglo));
	$('#inpTotalMovimiento').val(formatearPrecio(inpTotalMovimiento));
	$('#inpTotal').val(formatearPrecio(inpTotal));
	
	
	$('#totalMovimientosStock').html(formatearPrecio(inpTotalMovimientoStock));
	$('#totalGanancia').html(formatearPrecio(inpTotalGanancia));
	$('#totalArreglos').html(formatearPrecio(inpTotalArreglo));
	$('#totalMovimientos').html(formatearPrecio(inpTotalMovimiento));
	$('#total').html(formatearPrecio(inpTotal));
	
	
}

function datosValidosGuardar(){
	if($("#inpUsuarioIdAux").val() =="0"){
		alert("Debe seleccionar el usuario que rindio el dinero");
		return false;
	}
	
	if($("#inpTotalRendidoAux").val() == "" || parseInt($("#inpTotalRendidoAux").val()) == 0){
		alert("Debe ingresar un importe rendido.");
		return false;
	}
	
	celdas = $("#totalCeldas").val();
	selecciono = false ;
	for(i=0;i < celdas;i++ ){
		indice = $("#celdaIndice"+i).val();
		if ($('#'+indice).is(':checked')){
			selecciono = true ;
		}
	}
	if (!selecciono){
		alert('Debe seleccionar al menos un dia para guardar la liquidacion.');
		return false;
	}
	$("#inpTotalRendido").val($("#inpTotalRendidoAux").val());
	$("#inpObservaciones").val($("#inpObservacionesAux").val());
	$("#inpUsuarioId").val($("#inpUsuarioIdAux").val());
	$("#inpClaveOperacion").val($("#inpClaveOperacionAux").val());
	
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=lqdgrd';
	$('#formLiquidacion').attr('action',action);
	$("#formLiquidacion" ).submit();	
	
	return true;
} 