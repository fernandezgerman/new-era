function enviar() {
	if (datosValidos()) {
		bPreguntar = false;
		document.getElementById('frm').submit();
	}
}
$(document).ready(function() {
	//
	cargarEstadisticasSucursales();
	cargarErroresEnSucursales();
	cargarActualizacionesAbiertas();
	cargarActualizacionesCola();
	cargarActualizacionesPendientes();

	setTimeout(actualizarInfo, 65000); // 65000);

});
function cargarErroresEnSucursalEnDiv(resultado) {
	_.templateSettings.variable = "res";

	var template = _.template($("#templateErroresEnSucursales").html());
	$("#divErroresEnSucursales").html(template(resultado));
}
function actualizarInfo() {

	if ($('#actualizarSucursales').is(':checked')) {
		cargarEstadisticasSucursales();
	}
	setTimeout(actualizarInfo, 65000);
}

function cargarEstadoCola(resultado) {
	_.templateSettings.variable = "resultado";

	var template = _.template($("#templateEstadoCola").html());
	$("#divEstadoCola").html(template(resultado));
}
function cargarActualizacionesAbiertasEnDiv(resultado) {
	_.templateSettings.variable = "resultado";

	var template = _.template($("#templateActualizacionesAbiertas").html());
	$("#divActualizacionesAbiertas").html(template(resultado));
}
function cargarEstadisticasSucursalEnDiv(resultado) {
	_.templateSettings.variable = "resultado";

	var template = _.template($("#templateSucursalesEstadisticas").html());
	$("#divSucursalesEstadistica").html(template(resultado));
}
function cargarActualizacionesPendientesEnDiv(resultado) {
	_.templateSettings.variable = "resultado";

	var template = _.template($("#templatePendientesActualizacion").html());
	$("#divActualizacionesPendientes").html(template(resultado));
}
function cargarErroresEnSucursales() {
	$("#divErroresEnSucursales").css({
		"filter" : "alpha(opacity=50)",
		"opacity" : "0.5"
	});
	$
			.ajax({
				
				url : 'ajaxErroresEnSucursales.php?token='
						+ document.getElementById('mToken').value,
				type : 'POST',
				data : {
					'actualizaAutomaticamente' : $('#actualizarSucursales').is(':checked'),
					'inpLimiteErrores':$('#limiteErrores').val(),
					'inpSucursalIdErrores':$('#inpSucursalErrores').val()
				},
				datatype : 'json',
				async : true,
				success : function(resultado) {
					json = $.parseJSON(resultado);

					if (json.error == "true") {
						alert(json.mensaje);
					} else {
						cargarErroresEnSucursalEnDiv(json);
					}
					$("#divErroresEnSucursales").css({
						"filter" : "alpha(opacity=1)",
						"opacity" : "1"
					});
				},
				error : function() {
					alert('Error al obtener los errores en sucursales. Pagina inexistente');
				}
			});
}
function cargarEstadisticasSucursales() {
	$("#divSucursalesEstadistica").css({
		"filter" : "alpha(opacity=50)",
		"opacity" : "0.5"
	});
	$
			.ajax({

				url : 'ajaxMonitoreoActualizacion.php?token='
						+ document.getElementById('mToken').value,
				type : 'POST',
				data : {
					'actualizaAutomaticamente' : $('#actualizarSucursales').is(
							':checked')
				},
				datatype : 'json',
				async : true,
				success : function(resultado) {
					json = $.parseJSON(resultado);

					if (json.error == "true") {
						alert(json.mensaje);
					} else {
						cargarEstadisticasSucursalEnDiv(json);
					}
					$("#divSucursalesEstadistica").css({
						"filter" : "alpha(opacity=1)",
						"opacity" : "1"
					});
				},
				error : function() {
					alert('Error al obtener las estadisticas en sucursales. Pagina inexistente');
				}
			});
}
function cargarActualizacionesPendientes() {
	$("#divActualizacionesPendientes").css({
		"filter" : "alpha(opacity=50)",
		"opacity" : "0.5"
	});
	$
			.ajax({

				url : 'ajaxMonitoreoActualizacionPendientes.php?token='
						+ document.getElementById('mToken').value,
				type : 'POST',
				datatype : 'json',
				async : true,
				success : function(resultado) {
					json = $.parseJSON(resultado);

					if (json.error == "true") {
						alert(json.mensaje);
					} else {
						cargarActualizacionesPendientesEnDiv(json);
					}
					$("#divActualizacionesPendientes").css({
						"filter" : "alpha(opacity=1)",
						"opacity" : "1"
					});
				},
				error : function() {
					alert('Error al obtener las actualizaciones pendientes. Pagina inexistente');
				}
			});
}
function cargarActualizacionesCola() {
	$("#divEstadoCola").css({
		"filter" : "alpha(opacity=50)",
		"opacity" : "0.5"
	});
	$.ajax({

		url : 'ajaxMonitoreoActualizacionCola.php?token='
				+ document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		success : function(resultado) {
			json = $.parseJSON(resultado);

			if (json.error == "true") {
				alert(json.mensaje);
			} else {
				cargarEstadoCola(json);
			}
			$("#divEstadoCola").css({
				"filter" : "alpha(opacity=1)",
				"opacity" : "1"
			});
		},
		error : function() {
			alert('Error al obtener la cola');
		}
	});
}
function cerrarActualizaciones() {
	var parametros = {};
	tot = parseInt($('#totalActualizacionesAbiertas').val());
	total = 0;

	for (i = 0; i < tot; i++) {
		if ($('#seleccion' + i).is(':checked')) {
			idsucursal = $('#idSucursal' + i).val();
			idmotivo = $('#idMotivo' + i).val();

			/*
			 * parametros['idsucursal'+total] = idsucursal;
			 * parametros['idmotivo'+total] = idmotivo;
			 */
			csuc = 'idSucursal' + total;
			cmot = 'idMotivo' + total;
			parametros[csuc] = idsucursal;
			parametros[cmot] = idmotivo;

			total = total + 1;
		}
	}

	parametros['totalActualizaciones'] = total;

	$("#divActualizacionesAbiertas").css({
		"filter" : "alpha(opacity=50)",
		"opacity" : "0.5"
	});

	$.ajax({
		data : parametros,
		url : 'ajaxMonitoreoCerrarActualizacion.php?token='
				+ document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		success : function(resultado) {
			json = $.parseJSON(resultado);

			if (json.error == true) {
				alert(json.mensaje);
				$("#divActualizacionesAbiertas").css({
					"filter" : "alpha(opacity=1)",
					"opacity" : "1"
				});
			} else {
				cargarActualizacionesAbiertas();
			}
		},
		error : function() {
			alert('Error al obtener la cola');
		}
	});
}
function cargarActualizacionesAbiertas() {

	$("#divActualizacionesAbiertas").css({
		"filter" : "alpha(opacity=50)",
		"opacity" : "0.5"
	});
	$.ajax({

		url : 'ajaxMonitoreoActualizacionesAbiertas.php?token='
				+ document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		success : function(resultado) {
			json = $.parseJSON(resultado);

			if (json.error == true) {
				alert(json.mensaje);
			} else {
				cargarActualizacionesAbiertasEnDiv(json);
			}
			$("#divActualizacionesAbiertas").css({
				"filter" : "alpha(opacity=1)",
				"opacity" : "1"
			});
		},
		error : function() {
			alert('Error al obtener la cola');
		}
	});
}