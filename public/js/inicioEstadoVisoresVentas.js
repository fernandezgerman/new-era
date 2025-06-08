var inicioEstadoVisores = Array();

function cargarDatosVisores(dat) {
	_.templateSettings.variable = "registros";

	var template = _.template($("#templateEstadoVisorVentas").html());
	$("#divEstadoVisoresVenta").html(template(dat));

}

$(document).ready(function(){
    cargarDatosVisores(inicioEstadoVisores);
});