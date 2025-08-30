var datos;
function datosValidos()
{
	selecciono = false;
	for(i = 0;i < $('#inpTotalSucursales').val() ;i++)
	{
		if($("#suc"+i).is(':checked')){
			selecciono = true;
		}
	}
	if (!selecciono){
		alert('Debe seleccionar al menos una sucursal.');
		return false;
	}
	return true;
}
function mostrarValorizacion(){
	
	if (datosValidos()){
		document.getElementById('frm').submit();
	}
}
function verCaja(idusuario,idsucursal,numerocaja)
{
 	
 	$('#usuarioId').val(idusuario);
 	$('#sucursalId').val(idsucursal);
 	$('#numeroCaja').val(numerocaja);
 	form = document.getElementById('frmCaja');
 	form.submit();
 	
}
function mostrarReporte(resultado)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateStockHistorial" ).html()
        );
    $( "#divHistorialStock" ).html(
            template( resultado )
        );    
}
$(document).ready(function(){
	datos = cargarJson();
	mostrarReporte(datos);
	
});

