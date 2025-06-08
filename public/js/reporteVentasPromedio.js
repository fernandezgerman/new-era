function datosValidos()
{

	selecciono = false;
	for(i = 0;i < $('#inpTotalSucursales').val() ;i++)
	{
		if($("#suc"+i).is(':checked')){
			selecciono = true;
		}
	}
	if($('#inpFechaDesde').val()==""){
		alert("Debe seleccionar una fecha desde");
		return false;
	}
	if($('#inpFechaHasta').val()==""){
		alert("Debe seleccionar una fecha hasta");
		return false;
	}	
	return true;
}
function enviarLista(){
	if (datosValidos()){
		document.getElementById('frm').submit();
	}
}
$(document).ready(function(){
	
	var ctx = document.getElementById("canvas").getContext("2d");
	var ctxGanancia = document.getElementById("graficoGanancias").getContext("2d");
	
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: true
	});
	
	window.myLine = new Chart(ctxGanancia).Line(lineChartDataGanancia, {
		responsive: true
	});								
	
});
