function paginaProxima()
{
	totalPaginas = $('#inpPaginacionTotalPaginas').val();
	paginaActual = $('#inpPaginaActual').val();
	if (parseInt(paginaActual) < parseInt(totalPaginas))
	{
		
		paginaActual = parseInt(paginaActual) + 1;
		$('#inpPaginaActual').val(paginaActual);
		paginaRefresh();
	}
}
function paginaAnterior()
{
	paginaActual = $('#inpPaginaActual').val();
	
	if (paginaActual > 1)
	{
		paginaActual = paginaActual - 1;
		$('#inpPaginaActual').val(paginaActual);
		paginaRefresh();
	}	
}
function paginaPrimera()
{
	$('#inpPaginaActual').val(1);
	paginaRefresh();
}
function paginaUltima()
{
	$('#inpPaginaActual').val($('#inpPaginacionTotalPaginas').val());
	paginaRefresh();	
}
function actualizarRegistrosPorPaginas()
{
	registros = parseInt($('#inpPaginacionTotalRegistros').val());
	registrosPorPaginas = $('#inpRegistrosPorPagina').val();
	paginas = parseInt( registros / registrosPorPaginas)
	if ((paginas * registrosPorPaginas) != registros){
		paginas = paginas + 1;
	}
	$('#inpPaginacionTotalPaginas').val(paginas); 
	$('#labelTotalPaginas').text(paginas);
	
	paginaActual = $('#inpPaginaActual').val();
	
	$('#inplabelRegistroDesde').text(((paginaActual - 1) * registrosPorPaginas) + 1);
	$('#inplabelRegistroHasta').text(paginaActual * registrosPorPaginas);

	
}
function cambioPaginacion()
{
	$('#inpPaginaActual').val("1");
	
	paginaRefresh();
}
function paginaRefresh()
{
	
	$("#"+$("#inpPaginacionNombreDivDestino").val()).css({
		"filter":"alpha(opacity=50)",
		"opacity":"0.5"
		});
	eval($("#inpPaginacionFuncionRecarga").val()+'()');	
	
}
function finCargaArticulos(){
	$("#"+$("#inpPaginacionNombreDivDestino").val()).css({
		"filter":"alpha(opacity=1)",
		"opacity":"1"
		});	
} 

