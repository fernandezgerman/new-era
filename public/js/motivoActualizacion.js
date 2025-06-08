function motivosValidosActualizacion(){
	var totalMotivos = $('#totalMotivos').val();
	for(i=0; i < totalMotivos; i++)
	{
		maximoCola = parseInt($("#inpMaximaCola"+i).val());
		maximoEspera =parseInt($("#inpMaximaEspera"+i).val());			
		if (maximoCola < 0){
			alert('El motivo con codigo '+$('#inpCodigo').val()+' debe tener un valor "maximo en cola" mayor o igual a 0');
			return false;
		}
		if (maximoEspera < 0){
			alert('El motivo con codigo '+$('#inpCodigo').val()+' debe tener un valor "maximo en espera" mayor o igual a 0');
			return false;
		}		
			
	}
	return true;
}
function guardarMotivos(){
	if (motivosValidosActualizacion()){
		document.getElementById('frm').submit();
	}
}