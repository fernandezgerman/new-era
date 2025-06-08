function seleccionVigencia($val){
	
	if ($val=="semanal")
	{
		$("#divVigenciaPuntual").prop('disabled',true);
		$("#divVigenciaSemanal").prop('disabled',false);
		$('#divVigenciaPuntual').addClass('divBuscandoInformacion');
		$('#divVigenciaSemanal').removeClass('divBuscandoInformacion');
		
		
	}else{
		$("#divVigenciaSemanal").prop('disabled',true);
		$("#divVigenciaPuntual").prop('disabled',false);
		$('#divVigenciaSemanal').addClass('divBuscandoInformacion');
		$('#divVigenciaPuntual').removeClass('divBuscandoInformacion');			
	}
	
}
function seleccionarTodos(){

	for(i=0; i < $('#inpTotalRubros').val(); i++){
		if ($('input[name=selTodos]').filter(':checked').val())
		{
			$("#rubro"+i).prop("checked", "checked");
		}else{
			$("#rubro"+i).prop("checked", "");
		}			
	}
}
function enviar(){
	if (!datosValidos()){
		return false;
	}
	document.getElementById('frm').submit();
}
function datosValidos()
{
	
	if ($('#inpDescripcion').val()==""){
		alert('Debe ingresar una descripcion.');
		return false;
	}
	if($('#inpTipoPromocion').val()=="PROMO_CANTIDAD"){
		if ($('#inpCantidadCompra').val()==""){
			alert('Debe ingresar una cantidad minima de compra.');
			return false;
		}	
		if ($('#inpCantidadRegalo').val()==""){
			alert('Debe ingresar una cantidad de regalo.');
			return false;
		}	
	}
	$horario = $('input:radio[name=horarioVigencia]:checked').val();
	if (!$horario){
		alert("Debe seleccionar un tipo de horario");
		return false;
	}
	$vigencia = $('input:radio[name=tipoVigencia]:checked').val();
	
	if (!$vigencia){
		alert("Debe seleccionar un tipo de vigencia");
		return false;
	}else{
		if ($vigencia=='semanal'){
			$sel = false;
			for(i=0; i < 8; i++){
				if ($('input[id=dia'+i+']').filter(':checked').val())
				{
					$sel = true;
				}			
			}
			
			if(!$sel){
				alert('Debe seleccionar un dia de la semana');
				return false;
			}
		}else{
			
			if ($("#inpFechaVigencia").val()==""){
				alert('Debe ingresar una fecha.');
				return false;
			}
		}
	}
	$selR = false;
	for(i=0; i < $('#inpTotalRubros').val(); i++){
		
		if ($('input[name=rubro'+i+']').filter(':checked').val())
		{
			$selR = true;
		}			
	}	
	/*if(!$selR){
		alert('Debe seleccionar un rubro');
		return false;
	}*/
	if($('#inpTipoPromocion').val()=="PROMO_PORCENTAJE"){
		tot = $('#inpTotalRubros').val();
		for(i=0;i<tot;i++){
			if ($('input[name=rubro'+i+']').filter(':checked').val()){
				if(isNaN(parseFloat($('#porcentaje'+i).val())) ||$('#porcentaje'+i).val()==0 ||$('#porcentaje'+i).val() =='' ){
					alert('El porcentaje no es valido');
					$('#porcentaje'+i).focus();
					return false;
				}
			}
		}
	}
	
	
	if($('input:radio[name=horarioVigencia]:checked').val()=='HORA_PUNTUAL'){
		if($('#inpHoraDesde').val()=='' || $('#inpHoraDesde').val() > 23 ||  isNaN(parseFloat($('#inpHoraDesde').val()) ) ){
			alert('La hora de comienzo no es valida.');
			$('#inpHoraDesde').focus();
			return;
		}
		if($('#inpHoraCantidad').val()=='' || parseFloat($('#inpHoraCantidad').val()) > 23  || isNaN(parseFloat($('#inpHoraCantidad').val()) )){
			alert('La cantidad de horas de promocion no es valida.');
			$('#inpHoraCantidad').focus();
			return;
		}		
	}

	return true;
}
function seleccionaTipoDePromocion(){
	tot = $('#inpTotalRubros').val();
	if($('#inpTipoPromocion').val()=="PROMO_PORCENTAJE"){
		$('#porCada').hide();		
		for(i=0;i<tot;i++){
			$('#porcentaje'+i).show();
		}
		$('#divPreciosProArticuloImporte').hide();
		$('#divPreciosProArticuloPorcentaje').show();

	}else{
		$('#porCada').show();
		for(i=0;i<tot;i++){
			$('#porcentaje'+i).hide();
		}
		$('#divPreciosProArticuloImporte').show();
		$('#divPreciosProArticuloPorcentaje').hide();

	}
}
$(document).ready(function() {
	seleccionaTipoDePromocion();		
});

function seleccionVigenciaPorHora($val){
	
	if ($val=="LAS_24_HS")
	{
		$('#divVigenciaPorHora').addClass('divBuscandoInformacion');
		
	}else{
		
		$('#divVigenciaPorHora').removeClass('divBuscandoInformacion');			
	}
	
}
function seleccionDeSucursal(indice){
	
	sel = $('#inpSucursalId'+indice).is(':checked');
	
	if (sel){
		if($('#inpValorOriginalSucursalId'+indice).val()==1 ){
			$( "#contenedorSucursal"+indice ).removeClass("promoSucursalModificada");
			$( "#contenedorSucursal"+indice ).addClass("promoSucursalSeleccionada");
		}else{
			$( "#contenedorSucursal"+indice ).removeClass("promoSucursalSeleccionada");
			$( "#contenedorSucursal"+indice ).addClass("promoSucursalModificada");
		}
	}else{
		if($('#inpValorOriginalSucursalId'+indice).val()==1 ){
			$( "#contenedorSucursal"+indice ).removeClass("promoSucursalNoSeleccionada");
			$( "#contenedorSucursal"+indice ).addClass("promoSucursalModificada");
		}else{
			$( "#contenedorSucursal"+indice ).removeClass("promoSucursalModificada");
			$( "#contenedorSucursal"+indice ).addClass("promoSucursalNoSeleccionada");
		}		
	}	
}