var banderaVerDetalle = 0;
$(document).ready(function(){
	$("#detalleArticulos").hide();
});
function ocultarMostrarDetalle(){
	if (banderaVerDetalle==0){
		$("#detalleArticulos").show(1000);
		banderaVerDetalle = 1;
	}else{
		$("#detalleArticulos").hide(1000);
		banderaVerDetalle = 0;
	}
	
}
function enviar(){
	estadoId = $("input[id='inpEstadoId']:checked").val();
	
	if (estadoId==3 && $("#inpDescripcionEstado").val()==""){
		alert('Debe ingresar una descripcion si rechaza la transferencia');
		return false;
	}
	if (!estadoId){
		alert('Debe seleccionar un estado');
		return false;
	}
	form = document.getElementById('frm');
	form.submit();		
}
function volver(){
	form = document.getElementById('frmVover');
	form.submit();	
}