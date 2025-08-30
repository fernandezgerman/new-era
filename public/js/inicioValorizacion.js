function recalcularValorizaciones(){
    $('#contenedorValorizacionesSucursal').addClass('divBuscandoInformacion');
    $('#divBotonRecalcular').html('<img src="css/aguarde.gif" style="width: 30px;" />');
    $.ajax({
        url: 'ajaxRecalcularValorizacionesInicio.php?token='+document.getElementById('mToken').value,
        type: 'POST',
        datatype :'json',
        async: true,
        success: function(resultado){
            $('#contenedorValorizacionesSucursal').html(resultado);

            $('#contenedorValorizacionesSucursal').removeClass('divBuscandoInformacion');
        },
        error: function(){
            alert('Error al cargar los datos.') ;
        }
    });
}
function inicioValorizacionExistencias(idsucursal){
	$("#frmStockFiltros input[name=inpSucursalId]").val(idsucursal);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptstckrbr';
	
	$('#frmStockFiltros').attr('action',action);
	$("#frmStockFiltros" ).submit();	
}
function inicioCajas(idsucursal){
	$("#frmCajasFiltros input[name=inpSucursalId]").val(idsucursal);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=cajal';
	
	$('#frmCajasFiltros').attr('action',action);
	$("#frmCajasFiltros" ).submit();	
}

function inicioAbrirLiquidacion(){
	if(confirm("Esta seguro que desea abrir una nueva liquidacion?")){
		action = 'principal.php?token='+$('#mToken').val()+'&pagina=prmliqdr';
		
		$('#frmInicioAbrirLiquidacion').attr('action',action);
		$("#frmInicioAbrirLiquidacion" ).submit();		
	}
	
}
function inicioSaldoProvedores(idsucursal){
	$("#frmSaldoFiltros input[name=inpInicioSucursalId]").val(idsucursal);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptcmrsimpgs';
	
	$('#frmSaldoFiltros').attr('action',action);
	$("#frmSaldoFiltros" ).submit();	
}
function inicioMostrarDetalleSucursal(idsucursal){
	$("#frmDetalleSucursal input[name=idsucursal]").val(idsucursal);
	$("#frmDetalleSucursal input[name=token]").val($('#mToken').val());
	action = 'principal.php';

	$('#frmDetalleSucursal').attr('action',action);
	$("#frmDetalleSucursal" ).submit();	
}
/*
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
} */