function mostrarSucursalesLogin(resultado)
{ 
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateAccionEnSucursal" ).html()
        );
    $( "#divResultadoSucursalesBloqueadas" ).html(
            template( resultado )
        );    
} 

function cargarSucursalesLogin(){

	$('#divResultadoSucursalesBloqueadas').addClass('divBuscandoInformacion');
	$.ajax({
		url : 'ajaxAccionEnSucursal.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,	
		success : function(resultado) {
			json = $.parseJSON(resultado);			
			mostrarSucursalesLogin(json);
			$('#divResultadoSucursalesBloqueadas').removeClass('divBuscandoInformacion');
			
		},
		error : function() {
			
			$('#divResultadoSucursalesBloqueadas').html("Error al obtener los datos. Pagina inexistente");
			$('#divResultadoSucursalesBloqueadas').removeClass('divBuscandoInformacion');
		}	
	});	
}
function ignorarSucursalesLogin(idSucursal){

	$('#divResultadoSucursalesBloqueadas').addClass('divBuscandoInformacion');
	$.ajax({
		url : 'ajaxAccionEnSucursal.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		data: {
		     'idSucursal': idSucursal,
		     'ignorarSucursal':1
		     
		     },
		async : true,	
		success : function(resultado) {
			json = $.parseJSON(resultado);			
			mostrarSucursalesLogin(json);
			$('#divResultadoSucursalesBloqueadas').removeClass('divBuscandoInformacion');
			
		},
		error : function() {
			
			$('#divResultadoSucursalesBloqueadas').html("Error al obtener los datos. Pagina inexistente");
			$('#divResultadoSucursalesBloqueadas').removeClass('divBuscandoInformacion');
		}	
	});	
}

$(document).ready(function(){
	cargarSucursalesLogin();
});