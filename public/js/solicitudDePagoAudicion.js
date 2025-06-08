
var solicitudesCargadas = [];

$(document).ready(function(){
	_.templateSettings.variable = "filtros";
	
    var template = _.template($( "#filtrosGeneralesSucursalesTemplate" ).html());
    $( "#filtroSucursales" ).html(template(contenedorFiltros));  

    var template = _.template($( "#filtrosGeneralesProveedoresTemplate" ).html());
    $( "#filtroProveedores" ).html(template(contenedorFiltros));

	var template = _.template($( "#filtrosGeneralesUsuariosTemplate" ).html());
	$( "#filtroUsuarios" ).html(template(contenedorFiltros));

	var template = _.template($( "#filtrosGeneralesEstadosSolicitudesTemplate" ).html());
	$( "#filtroEstados" ).html(template(contenedorFiltros));

	var template = _.template($( "#filtrosGeneralesFechaDesdeTemplate" ).html());
	$( "#filtroFechaDesde" ).html(template(contenedorFiltros));

	var template = _.template($( "#filtrosGeneralesFechaHastaTemplate" ).html());
	$( "#filtroFechaHasta" ).html(template(contenedorFiltros));


	cargaInstantanea = obtenerParametroDesdeRequest('cargainstantanea');




	if(cargaInstantanea==1) {

		estado = obtenerParametroDesdeRequest('estado');
		if(!(estado=='PENDIENTE')){
			$('#inpFiltroFechaHasta').val(Hoy());
			$('#inpFiltroFechaDesde').val(Ayer());
		}
		seleccionarMultiSelectArreglo('inpFiltroEstadoSolicitud',{estado});
		mostrarResultados();

	}

});

function mostrarResultados(){

	url = 'ajaxSolicitudDePagoAudicionLista.php';
	data = {
		'sucursales': $('#inpFiltroSucursales').val(),
		'proveedores': $('#inpFiltroProveedores').val(),
		'usuarios': $('#inpFiltroUsuarios').val(),
		'estados': $('#inpFiltroEstadoSolicitud').val(),
		'fechaDesde': $('#inpFiltroFechaDesde').val(),
		'fechaHasta': $('#inpFiltroFechaHasta').val()
	};
	variable = 'resultado';
	template = 'SolicitudDePagoAudicionListaTemplate';
	divResultado = 'main';
	extra = false;
	callback = 'finalizaCargaDeDatos(json)';
	$('#idBotonBuscar').hide();
	cargarAjaxGenericoJson(
		url, data, variable, template, divResultado,
		extra,callback)
}
function finalizaCargaDeDatos(json){
	solicitudesCargadas = json;
	$('#idBotonBuscar').show();
}
function getIndiceSolicitudPorId(solicitudId){
	solicitudes = solicitudesCargadas['solicitudes'];
	indiceSel = -1;
	solSel = false;
	for(indice in solicitudes){
		sol = solicitudes[indice];
		if(sol['id']==solicitudId){
			return indice;
		}
	}
}
function cancelarEstadoSolicitud(solicitudId) {
	solicitudes = solicitudesCargadas['solicitudes'];
	indiceSel = getIndiceSolicitudPorId(solicitudId);
	solicitud = solicitudes[indiceSel];

	if(solicitud!=false){
		solicitud['estado'] = solicitud['estadoviejo'];
		solicitud['observaciones'] = '';
		solicitud['modificoestado']=0;
		solicitudes[indiceSel] = solicitud;
		solicitudesCargadas['solicitudes'] = solicitudes;
		mostrarTemplateGeneral(solicitudesCargadas, 'resultado', 'SolicitudDePagoAudicionListaTemplate', 'main');

	}else{
		alert('Imposible determinar la solicitud.');
	}

}
function asignarObservacionesSolicitud(solicitudId) {
	solicitudes = solicitudesCargadas['solicitudes'];
	indiceSel = getIndiceSolicitudPorId(solicitudId);
	solicitud = solicitudes[indiceSel];
	solicitud['observaciones'] = $('#textArea'+solicitudId).val();
	solicitudes[indiceSel] = solicitud;
	solicitudesCargadas['solicitudes'] = solicitudes;
}
function mostrarDetalleSolicitud(solicitudId) {
	solicitudes = solicitudesCargadas['solicitudes'];
	indiceSel = getIndiceSolicitudPorId(solicitudId);
	solicitud = solicitudes[indiceSel];

	url = 'ajaxSolicitudDePagoAudicionDetalle.php';
	data = {
		'solicitudId': solicitudId
	};
	variable = 'res';
	template = 'SolicitudDePagoAudicionDetalleTemplate';
	divResultado = 'detalleSolicitud'+solicitudId;
	extra = solicitud;
	callback = 'aux(json)';

	cargarAjaxGenericoJson(
		url, data, variable, template, divResultado,
		extra,callback)
}
function aux(json){
	$('#detalleSolicitud'+json['solicitudId']).show(1000);
}
function editarEstadoSolicitud(solicitudId){
	solicitudes = solicitudesCargadas['solicitudes'];
	indiceSel = getIndiceSolicitudPorId(solicitudId);
	solicitud = solicitudes[indiceSel];

	if(solicitud!=false){
		solicitud['estado'] = $('#selectEstado'+solicitudId).val();

		if(solicitud['estado']==solicitud['estadoviejo']){
			solicitud['modificoestado']=0;
			solicitud['observaciones']='';
		}else{
			solicitud['modificoestado']=1;
		}
		solicitudes[indiceSel] = solicitud;
		solicitudesCargadas['solicitudes'] = solicitudes;
		mostrarTemplateGeneral(solicitudesCargadas, 'resultado', 'SolicitudDePagoAudicionListaTemplate', 'main');


	}else{
		alert('Imposible determinar la solicitud.');
	}
}
function guardarSolicitudesEditadas(solicitudId){

}

function cerrarDetalleSolicitud(solicitudId){
	$('#detalleSolicitud'+solicitudId).hide(1000);
}

function detallarComprasYPagos(div,idcompra){

	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$.ajax({
		url: 'ajaxBusquedaDeCompras.php?token='+document.getElementById('mToken').value,
		type: 'POST',
		datatype :'json',
		async: true,
		data: {
			'idcompra': idcompra,
			'div': div
		},
		success: function(resultado){
			contenedorDeResultados = Array();
			datosCompra = $.parseJSON(resultado);

			_.templateSettings.variable = "resultado";

			var template = _.template($( "#visorDeCompraTemplate").html());
			$( "#div"+datosCompra.div ).html(template(datosCompra));
			$( "#tr"+datosCompra.div ).show(1000);

			$('#reporteCompleto').removeClass('divBuscandoInformacion');

		},
		error: function(){
			alert('Error al cargar los datos.') ;
			$('#idBotonBuscar').show();
			$('#reporteCompleto').removeClass('divBuscandoInformacion');
		}
	});
}
function cerrarCompra(div){
	$('#tr'+div).hide(1000);
}

function guardarEstadoSolicitud(solicitudId){
	indiceSel = getIndiceSolicitudPorId(solicitudId);
	solicitud = solicitudes[indiceSel];

	if(solicitud['estado'] =='RECHAZADA' ){
		if(solicitud['observaciones']=='' || !solicitud['observaciones']) {
			alert('Debe ingresar observaciones si rechaza la solicitud.');
			return;
		}
	}
	$.ajax({
		url : 'ajaxSolicitudDePagoAuditar.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,

		data : {
			'solicitudId': solicitud['id'] ,
			'estado': solicitud['estado'] ,
			'observaciones': solicitud['observaciones']
		},
		success : function(resultado) {
			json = $.parseJSON(resultado);


			if(json["error"]==1){

				$('#divErrorSolicitud'+json['solicitudId']).html(json['mensaje']);
				$('#divErrorSolicitud'+json['solicitudId']).show(1000);
			}else{
				alert(json['mensaje']);
				mostrarResultados();
			}
		},
		error : function() {
			alert('error al obtener los registros');
		}
	});







}