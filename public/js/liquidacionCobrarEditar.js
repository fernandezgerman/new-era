function mostrarDetalleLiquidacion(idLiquidacion,idLiquidacionDetalle){
	
	$.ajax({
		url : 'ajaxLiquidacionesGrilla.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'periodoId':"",
				'idLiquidacionDetalle':idLiquidacionDetalle,
				'liquidacionId':idLiquidacion,
				'fechaHasta':"",
				'fechaDesde':"",
				'detallarSucursales':1,
				'detallarUsuarios':1,
				'detallarOtrosValores':1
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			datosReporte = json;
			if(datosReporte["error"]==1){
				alert(datosReporte["mensajeError"]);
			}else{
				_.templateSettings.variable = "resultado";
				
			    var template = _.template(
			            $( "#templateLiquidacionesCobrar" ).html()
			        );
			    
			    liquidaciones = json['liquidaciones'];
			    liq = liquidaciones[0];
			    liq['indice'] = 0;
			    json['liquidaciones'] = liquidaciones;
			    detalle = liq[0];
			    
			    $( "#divReporte" ).html(
			            template(json)
			        );	
			    if(detalle['idestadoaudicion']!=1){
			    	traerMovimientosCaja();
				}else{
					
				 	_.templateSettings.variable = "movimientos";

				    var template = _.template(
				            $( "#templateLiquidacionesMovimientosCobrados" ).html()
				        );
				    $( "#liqMovimientosDeCaja" ).html(
				            template(detalle)
				        );					
				}
			}
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});	
}
function  traerMovimientosCaja(){
	$idSucursalOrigen = "";
	$idUsuarioOrigen = "";
	$idUsuarioDestino = "";
	
	$("#liqMovimientosDeCaja").html("");
	if ($("#inpIdSucursalMovimientoOrigen").val()!= ""){
		$idSucursalOrigen = $("#inpIdSucursalMovimientoOrigen").val();
	}else{
		 
		$("#liqMovimientosDeCaja").html("- Seleccione una sucursal.</br>");
		return;
	}
	if ($("#inpIdUsuarioMovimientoOrigen").val()!= ""){
		$idUsuarioOrigen = $("#inpIdUsuarioMovimientoOrigen").val();
	}else{
		$("#liqMovimientosDeCaja").html($("#liqMovimientosDeCaja").html()+"- Seleccione un usuario.");
		return;
	}


	 $( "#liqMovimientosDeCaja" ).html('<img style="width:40px;" src="css/images/aguarde.gif">');	
		
	$idUsuarioDestino = $("#idusuarioLogin").val();
	
	$.ajax({
		url : 'ajaxMovimientosCajaLiquidacion.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'idUsuarioOrigen':$idUsuarioOrigen,
				'idSucursalOrigen':$idSucursalOrigen,
				'incluirMovimientosAceptados': $('#inpIncluirMovAceptados').is(':checked')
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			$('#divTotalMovimientosSeleccionados').html('$'+formatearPrecio($("#inpTotalMovimientosAnteriores").val()));
		
			if(json["error"]==1){
				alert(json["mensajeError"]);
			}else{
				_.templateSettings.variable = "movimientos";
			    var template = _.template(
			            $( "#templateLiquidacionesCobrarMovimientos" ).html()
			        );
			     
			    $( "#liqMovimientosDeCaja" ).html(
			            template(json)
			        );							
			}
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});	
}

function editarLiquidacion(idLiquidacionDetalle,idLiquidacion){
	$( "#inpLiquidacionId").val(idLiquidacion);
	$( "#inpLiquidacionDetalleId").val(idLiquidacionDetalle);
	
	$("#frmLiquidacionEditar" ).submit();
}
function cerrarDetalleLiquidacion(indice){
	$( "#detalleLiquidacion"+indice ).html("");
}
function mostrarDetalleConcepto(indiceLiquidacion,indiceDetalle){
	liquidaciones = datosReporte['liquidaciones'];
	liquidacion = liquidaciones[indiceLiquidacion];
	detalles = liquidacion['detalles'];
	detalle = detalles[indiceDetalle];
	conceptos = detalle['conceptos']; 
	conceptos['indice'] = indiceDetalle;
	
	
	_.templateSettings.variable = "conceptos";
	
    var template = _.template(
            $( "#templateLiquidacionesListaDetalleConcepto" ).html()
        );
    $( "#detalleLiquidacionCON"+indiceDetalle ).html(
            template(conceptos)
        );  	
	
}
function volverALiquidacion(){
	$("#frmVolver" ).submit();
}
function recalcularTotalCobrado(){
	tMov = parseFloat($("#totalMovimientos").val());
	total = parseFloat($("#inpTotalMovimientosAnteriores").val() );
	for(m=0;m<tMov;m++){
		if($('#chkMovimiento'+m).is(':checked')){
			total = total + parseFloat($('#inpMovImporte'+m).val());
			
			$('#liqFilaMov'+m).removeClass("cbContenedorCentralTablaFila");
			$('#liqFilaMov'+m).addClass("cbContenedorCentralTablaFilaSel");
			$('#liqFilaMovBis'+m).removeClass("cbContenedorCentralTablaFila");
			$('#liqFilaMovBis'+m).addClass("cbContenedorCentralTablaFilaSel");			
			
		}else{
			$('#liqFilaMov'+m).removeClass("cbContenedorCentralTablaFilaSel");
			$('#liqFilaMov'+m).addClass("cbContenedorCentralTablaFila");
			$('#liqFilaMovBis'+m).removeClass("cbContenedorCentralTablaFilaSel");
			$('#liqFilaMovBis'+m).addClass("cbContenedorCentralTablaFila");			
			
		}
	}
	$('#divTotalMovimientosSeleccionados').html("$"+formatearPrecio(total));
	
	return total; 
		
}
function finalizarLiqudiacion(){
	if (!validarDatos()){
		return;
	}
	$("#frmCobrar" ).submit();
}
function validarDatos(){
	$sugerido = parseFloat($("#inpTotalImporteSugerido").val());
	$cobrado = parseFloat(recalcularTotalCobrado());
	if($cobrado==0){
		if (!confirm("ATENCION! El total es igual a cero, ¿Está seguro que deseea cerrar la liquidacion igual?")){
			return false;
		}
	}else{
		if($sugerido +1 < $cobrado || $sugerido > $cobrado + 1){
			if (!confirm("ATENCION! El valor sugerido ("+$sugerido+") es diferente al valor cobrado ("+$cobrado+") ¿Está seguro que deseea cerrar la liquidacion igual?")){
				return false;
			}
		}else{
			if (!confirm("¿Está seguro que deseea cerrar la liquidacion igual?")){
				return false;
			}			
		}
	}
	return true;
}
function verDetalleMovimientosStock(fechaDesde,fechaHasta,horaDesde,horaHasta,idSucursal){
	$("#frmMovimientosStock input[name=inpFechaDesde]").val(fechaDesde);
	$("#frmMovimientosStock input[name=inpFechaHasta]").val(fechaHasta);
	$("#frmMovimientosStock input[name=inpFechaDesdeHora]").val(horaDesde);
	$("#frmMovimientosStock input[name=inpFechaHastaHora]").val(horaHasta);
	$("#frmMovimientosStock input[name=inpSucursalIdUnico]").val(idSucursal);
	
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptstckbjs';
	
	$('#frmMovimientosStock').attr('action',action);
	$("#frmMovimientosStock " ).submit();	
}
function verDetalleDeVentas(fechaDesde,fechaHasta,horaDesde,horaHasta,idSucursal){
			
	$("#frmVerDetalleVentas input[name=inpSucursalBalance]").val(idSucursal);
	$("#frmVerDetalleVentas input[name=inpFechaDesde]").val(fechaDesde);
	$("#frmVerDetalleVentas input[name=inpFechaHasta]").val(fechaHasta);
	$("#frmVerDetalleVentas input[name=inpFechaDesdeHora]").val(horaDesde);
	$("#frmVerDetalleVentas input[name=inpFechaHastaHora]").val(horaHasta);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptvspr';
	
	$('#frmVerDetalleVentas').attr('action',action);
	$("#frmVerDetalleVentas " ).submit();		
}
function verDetalleDeArreglos(fechaDesde,fechaHasta,horaDesde,horaHasta,idSucursal){
	
	$("#frmVerDetalleArreglos input[name=inpFiltroSucursales]").val(idSucursal);
	$("#frmVerDetalleArreglos input[name=filtroSucursalesTodas]").val(idSucursal);
	
	$("#frmVerDetalleArreglos input[name=inpFechaDesde]").val(fechaDesde);
	$("#frmVerDetalleArreglos input[name=inpFechaHasta]").val(fechaHasta);
	$("#frmVerDetalleArreglos input[name=inpFechaDesdeHora]").val(horaDesde);
	$("#frmVerDetalleArreglos input[name=inpFechaHastaHora]").val(horaHasta);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=renstockrep';
	
	$('#frmVerDetalleArreglos').attr('action',action);
	$("#frmVerDetalleArreglos" ).submit();		
}
function verDetalleDeSobrantesDeCaja(fechaDesde,fechaHasta,horaDesde,horaHasta,idSucursal){
	
	$("#frmVerDetalleSobrantes input[name=inpSucursalId]").val(idSucursal);
	$("#frmVerDetalleSobrantes input[name=inpFechaCierreDesde]").val(fechaDesde);
	$("#frmVerDetalleSobrantes input[name=inpFechaCierreHasta]").val(fechaHasta);
	$("#frmVerDetalleSobrantes input[name=inpFechaHoraCierreDesde]").val(horaDesde);
	$("#frmVerDetalleSobrantes input[name=inpFechaHoraCierreHasta]").val(horaHasta);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=cajal';
	
	$('#frmVerDetalleSobrantes').attr('action',action);
	$("#frmVerDetalleSobrantes" ).submit();		
}
function verLiquidacionConsumos(fechaDesde,fechaHasta,horaDesde,horaHasta,idSucursal){
	
	$("#frmVerDetalleDeConsumo input[name=inpSucursalId]").val(idSucursal);
	$("#frmVerDetalleDeConsumo input[name=inpFechaDesde]").val(fechaDesde);
	$("#frmVerDetalleDeConsumo input[name=inpFechaHasta]").val(fechaHasta);
	$("#frmVerDetalleDeConsumo input[name=inpFechaDesdeHora]").val(horaDesde);
	$("#frmVerDetalleDeConsumo input[name=inpFechaHastaHora]").val(horaHasta);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptvtsdesc';
	
	$('#frmVerDetalleDeConsumo').attr('action',action);
	$("#frmVerDetalleDeConsumo" ).submit();
}
