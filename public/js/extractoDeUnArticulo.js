
function mostrarResultados(resultado)
{ 
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateArticuloExtracto" ).html()
        );
    $( "#divResultado" ).html(
            template(resultado) 
        );    
} 


function datosValidos()
{
	if ($('#inpSucursalId').val()==""){
		alert("Debe seleccionar una sucursal");
		return false;
	}
	if ($('#inpCodigo').val()==""){
		alert("Debe seleccionar un articulo");
		return false;
	}	

	return true;
}

function mostrarGrilla(){
	
	if (!datosValidos()){
		return false;
	}
	inpSucursalId = $('#inpSucursalId').val();
	inpCodigo =  $('#inpCodigo').val();
	inpFechaDesde = $('#inpFechaDesde').val();
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$.ajax({
		url : 'ajaxArticuloExtractoDeMovimientos.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'inpSucursalId':inpSucursalId,
				'inpCodigo':inpCodigo,
				'inpFechaDesde':inpFechaDesde
				}
		,	
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.err == 1) {
				alert(json.mensaje);
				
			} else {
				mostrarResultados(json);
				
			}
			$('#reporteCompleto').removeClass('divBuscandoInformacion');
		},
		error : function() {
			$('#divResultado').html("Error al obtener los datos. Pagina inexistente");

		}	
	});		
}
/*
$(document).ready(function(){
	//mostrarRendicion();
});*/