var estadoSobrantes =  new Array();
var estadoRendiciones = new Array();
function clickVisualizacionSobrantes(idSucursal){
	if (estadoSobrantes[idSucursal] == true){
	    $("tr[id=trsobrantes"+idSucursal+"]").each(function(){
	       $(this).hide();
	    });		
		//$('#trsobrantes'+idSucursal).hide();
		estadoSobrantes[idSucursal] = false;
	}else{
	    $("tr[id=trsobrantes"+idSucursal+"]").each(function(){
		       $(this).show();
		    });				
		estadoSobrantes[idSucursal] = true;		
	}
}

function clickVisualizacionRendiciones(idSucursal){
	if (estadoRendiciones[idSucursal] == true){
	    $("tr[id=trrendiciones"+idSucursal+"]").each(function(){
	       $(this).hide();
	    });		
		//$('#trsobrantes'+idSucursal).hide();
	    estadoRendiciones[idSucursal] = false;
	}else{
	    $("tr[id=trrendiciones"+idSucursal+"]").each(function(){
		       $(this).show();
		    });				
	    estadoRendiciones[idSucursal] = true;		
	}
}
function mostrarDetallesRendicion(rendicionId)
{
	$('#inpRendicionId').val(rendicionId);
	$('#frmRendicion').submit();
}
function verCaja(idusuario,idsucursal,numerocaja)
{
 	
 	$('#usuarioId').val(idusuario);
 	$('#sucursalId').val(idsucursal);
 	$('#numeroCaja').val(numerocaja);
 	form = document.getElementById('frmCaja');
 	form.submit();
 	
}