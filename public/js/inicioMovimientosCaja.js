function seleccionarCheckPendientes(id)
{
	/*
	if ($('#'+id).is(':checked')){
		$("#"+id).removeClass("inicioMvmNoSeleccionado");
		$("#"+id).addClass("inicioMvmSeleccionado");
	}else{
		$("#"+id).removeClass("inicioMvmSeleccionado");
		$("#"+id).addClass("inicioMvmNoSeleccionado");		
	}	*/
	$("#"+id).addClass("inicioMvmSeleccionado");
}
function datosValidos(rechazar){
	tot = $('#totalMovimientosPendientes').val();
	sel = 0;
	for(i = 0;i < tot; i++){
		if ($('#movimientoCajaPendiente'+i).is(':checked')){
			sel = sel + 1;
			if (rechazar){
				if ($('#movimientoCajaPendienteObs'+i).val() ==""){
					alert("Debe ingresar observaciones cuando rechaza un movimiento.");
					$('#movimientoCajaPendienteObs'+i).focus();
					return false;
				}
			}
		}
	}
	if (sel==0){
		alert('Debe seleccionar algun movimiento.');
		return false;
	}
	return true;
}
function rechazarMovimientosCajaPendientes(){
	if (datosValidos(true)){
		$("#movimientosCajaAccion").val('RECHAZAR');
		$("#frmMovimientosCajaPendientes").submit();
	}
}
function aprobarMovimientosCajaPendientes(){
	if (datosValidos(false)){
		$("#movimientosCajaAccion").val('APROBAR');
		$("#frmMovimientosCajaPendientes").submit();
	}	
}