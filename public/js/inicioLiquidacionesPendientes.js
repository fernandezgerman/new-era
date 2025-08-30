var inicioLiquidacionesPendientes = Array();

function inicioCargarLiquidacionesPendientes(dat) {

	_.templateSettings.variable = "liquidacionesPendientes";
	var template = _.template($("#templateInicioLiquidacionesPendientes").html());
	$("#divInicioLiquidacionesPendientes").html(template(dat));

}
$(document).ready(function(){

	if(inicioLiquidacionesPendientes['err']!=1){
		if(inicioLiquidacionesPendientes['totalLiquidaciones']<1){
			$('#diviniciolqdsnsimprsgrd').hide();
			return;
		}
	}
	inicioCargarLiquidacionesPendientes(inicioLiquidacionesPendientes);
});