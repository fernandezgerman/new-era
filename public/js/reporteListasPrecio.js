function mostrarReporte(resultado)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateReporteArticulosListasPrecios" ).html()
        );
    $( "#resultadoBusqueda" ).html(
            template( resultado )
        );    
}
function pasarPagina ()
{
	if (!datosValidosLista())
	{
		return false;
	}
	$.ajax({
		url : 'ajaxArticulosPreciosLista.php?token='+document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'listaId':$('#inpListaId').val() ,
				'rubroId':$('#inpRubroId').val(),
				'codigoArticulo':$('#inpCodigo').val(),
				'paginaActual':$('#inpPaginaActual').val(),
				'registroPorPagina': $('#inpRegistrosPorPagina').val()
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.resultado == "ok"){
				mostrarReporte(json);
				$("#inpPaginacionTotalRegistros").val(json.totalRegistros);
				actualizarRegistrosPorPaginas();
				finCargaArticulos();				
			}else{
				
				alert(json.mensaje);
				
			}
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});

}
function datosValidosLista()
{
	if($("#inpListaId").val()=="")
	{
		alert('Debe seleccionar una lista de precios');
		return false;
	}
	return true;
}
$(document).ready(function(){
	mostrarReporte(cargarJson());
});
function enviarLista(){
	if (datosValidosLista()){
		document.getElementById('frm').submit();
	}
}