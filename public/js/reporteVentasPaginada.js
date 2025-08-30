function mostrarReporte(resultado)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateReporteVentasPaginada" ).html()
        );
    $( "#resultadoBusqueda" ).html(
            template( resultado )
        );    
}
function sucursales(){
	total = parseInt($("#inpTotalSucursales").val());
	sucs = ",";
	
	for (i =0; i < total; i++)
	{
		if ($("#suc"+i).is(':checked'))
		{
			sucs = sucs+$("#suc"+i).val()+",";
		}
	}
	return sucs;
}
function pasarPagina ()
{
	if (!datosValidosLista())
	{
		return false;
	}
	$.ajax({
		url : 'ajaxVentasSucursalesPaginada.php?token='+document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'inpArticuloCodigo':$('#inpCodigo').val() ,
				'inpUsuarioId':$('#inpUsuarioId').val(),
				'inpFechaDesde':$('#inpFechaDesde').val(),
				'inpFechaHasta':$('#inpFechaHasta').val(),
				'horaDesde':$('#inpHoraDesde').val(),
				'horaHasta':$('#inpHoraHasta').val(),
				'inpRubroId':$('#inpRubroId').val(),
				'sucursales':sucursales(),
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
