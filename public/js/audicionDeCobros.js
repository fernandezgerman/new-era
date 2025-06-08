var contenedorFiltros = Array();
var respuesta = Array();


$(document).ready(function(){
	_.templateSettings.variable = "filtros";
	
    var template = _.template($( "#filtrosGeneralesFechaDesdeTemplate" ).html());
    $( "#filtroFechaDesde" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesFechaHastaTemplate" ).html());
    $( "#filtroFechaHasta" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesSucursalesTemplate" ).html());
    $( "#filtroSucursales" ).html(template(contenedorFiltros)); 
    
    var template = _.template($( "#filtrosGeneralesUsuariosTemplate" ).html());
    $( "#filtroUsuarios" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesListasTemplate" ).html());
    $( "#filtroListas" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesRubrosTemplate" ).html());
    $( "#filtroRubros" ).html(template(contenedorFiltros));    
    
    var template = _.template($( "#filtrosGeneralesHoraDesdeTemplate" ).html());
    $( "#filtroHoraDesde" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesHoraHastaTemplate" ).html());
    $( "#filtroHoraHasta" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesArticuloTemplate" ).html());
    $( "#filtroArticuloCodigo" ).html(template(contenedorFiltros));


	var template = _.template($( "#filtrosGeneralesEstadosTemplate" ).html());
	$( "#filtroEstados" ).html(template(contenedorFiltros));

	var template = _.template($( "#filtrosGeneralesModosDeCobroTemplate" ).html());
	$( "#filtroModosDeCobro" ).html(template(contenedorFiltros));


   	
    $("#divPresentacionDiscriminarsucursal").hide();
});


function mostrarDatos(){

	$('#idBotonBuscar').hide();
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$( "#main" ).html("");
	  $.ajax({
		  url: 'ajaxAudicionDeCobros.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {
				 'sucursales': $('#inpFiltroSucursales').val(),
				 'usuarios': $('#inpFiltroUsuarios').val(),
				 'modosDeCobro': $('#inpFiltroModosDeCobro').val(),
				 'estados': $('#inpFiltroEstado').val(),
				 'fechaDesde': $('#inpFiltroFechaDesde').val(),
				 'fechaHasta': $('#inpFiltroFechaHasta').val(),
				 'horaDesde': $('#inpFiltroHoraDesde').val(),
				 'horaHasta': $('#inpFiltroHoraHasta').val()
				 },
		  success: function(resultado){
					contenedorDeResultados = Array();
					res = $.parseJSON(resultado);
					datos = res;
					respuesta = res;

			  		mostrarTemplateGeneral(res, 'resultado', 'templateAudicionCobro', 'main');

					$('#reporteCompleto').removeClass('divBuscandoInformacion');
					$('#idBotonBuscar').show();
				},
			  error: function(){
					alert('Error al cargar los datos.') ;
					$('#idBotonBuscar').show();
					$('#reporteCompleto').removeClass('divBuscandoInformacion');
				}
			});


}
function editarEstado(indice){
	datos = respuesta['datos'];
	dato = datos[indice];
	dato['nuevoEstadoId'] = $('#inpEstadoCobro'+indice).val();
	est = $('#inpEstadoCobro'+indice+' option:selected').html();
	if(est) {
		dato['nuevoEstadoDescripcion'] = est;
	}
	//if(dato['nuevoEstadoId'] == dato['estadoId']){
	if(dato['nuevoEstadoId'] == dato['estadoId'] && formatearPrecio(dato['oldimporte']) == formatearPrecio(dato['importe'])){
		dato['editado'] = 0;
	}else {
		dato['editado'] = 1;
	}
	datos[indice] = dato;
	respuesta['datos'] = datos ;
	mostrarTemplateGeneral(respuesta, 'resultado', 'templateAudicionCobro', 'main');
}

function editarImoprte(indice){
	datos = respuesta['datos'];
	dato = datos[indice];
	dato['importe'] = formatearPrecio($('#txtImporteCobro'+indice).val());
	if(dato['nuevoEstadoId'] == dato['estadoId'] && formatearPrecio(dato['oldimporte']) == formatearPrecio(dato['importe'])){
		dato['editado'] = 0;
	}else{
		dato['editado'] = 1;
	}
	datos[indice] = dato;
	respuesta['datos'] = datos ;
	mostrarTemplateGeneral(respuesta, 'resultado', 'templateAudicionCobro', 'main');
}

function calcelarEdicionFila(indice){
	datos = respuesta['datos'];
	dato = datos[indice];
	dato['nuevoEstadoId'] = dato['estadoId'];
	dato['nuevoEstadoDescripcion'] = dato['estadoDescripcion'];
	dato['importe'] = dato['oldimporte'];
	dato['editado'] = 0;
	datos[indice] = dato;
	respuesta['datos'] = datos ;
	mostrarTemplateGeneral(respuesta, 'resultado', 'templateAudicionCobro', 'main');
}
function mostrarDetalle(idcobro,indice) {

	$.ajax({
		url: 'ajaxAudicionDeCobrosDetalle.php?token=' + document.getElementById('mToken').value,
		type: 'POST',
		datatype: 'json',
		async: true,
		data: {
			'cobroId': idcobro
		},
		'indice': indice,

		success: function (resultado) {
			contenedorDeResultados = Array();
			res = $.parseJSON(resultado);
			datos = respuesta['datos'];
			dato = datos[this.indice];
			dato['conDetalle'] = 1;
			dato['detalles'] = res;
			datos[this.indice] = dato ;
			respuesta['datos'] = datos;

			mostrarTemplateGeneral(respuesta, 'resultado', 'templateAudicionCobro', 'main');

			$('#reporteCompleto').removeClass('divBuscandoInformacion');
			$('#idBotonBuscar').show();
		},
		error: function () {
			alert('Error al cargar los datos.');
			$('#idBotonBuscar').show();
			$('#reporteCompleto').removeClass('divBuscandoInformacion');
		}
	});

}
function cerrarDetalle(div,indice){
	ddd = datos[indice];
	ddd['conDetalle']=0;
	$('#'+div).html("");
}
function guardarDatos(){
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=adtrcbrsgrdr';

	$('#frmAuditar').attr('action',action);
	$("#frmAuditar" ).submit();
}


	/*){
mostrarTemplateGeneral({
err: 0,
'datos': dat['detalles']
}, 'detalle', 'templateAudicionCobroDetalle', 'detalle' + idcobro);
}else {

cargarAjaxGenericoJson('ajaxAudicionDeCobrosDetalle.php', {'cobroId':idcobro}, "detalle", "templateAudicionCobroDetalle", 'detalle' + idcobro,
{'indice':indice},"asignarResultado('json',"+indice+")");

mostrarTemplateGeneral({
err: 0,
'datos': datos
}, 'detalle', 'templateAudicionCobroDetalle', 'detalle' + idcobro);
}
}
function asignarResultado(detalles,indice){
dato = datos[indice];
dato['conDetalle'] = 1;
dato['detalles'] = detalles;
}


*/
