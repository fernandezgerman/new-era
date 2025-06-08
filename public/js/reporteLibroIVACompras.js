var contenedorFiltros = Array();
var contenedorDeResultados = Array();


$(document).ready(function(){
	_.templateSettings.variable = "filtros";
	
    var template = _.template($( "#filtrosGeneralesFechaEmisionDesdeTemplate" ).html());
    $( "#filtroFechaDesde" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesFechaEmisionHastaTemplate" ).html());
    $( "#filtroFechaHasta" ).html(template(contenedorFiltros));
    
    
    var template = _.template($( "#filtrosGeneralesFechaCargaDesdeTemplate" ).html());
    $( "#filtroFechaCargaDesde" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesFechaCargaHastaTemplate" ).html());
    $( "#filtroFechaCargaHasta" ).html(template(contenedorFiltros));


    
    var template = _.template($( "#filtrosGeneralesSucursalesTemplate" ).html());
    $( "#filtroSucursales" ).html(template(contenedorFiltros)); 

    var template = _.template($( "#filtrosGeneralesTCTemplate" ).html());
    $( "#filtroTipoComprobante" ).html(template(contenedorFiltros));

	var template = _.template($( "#filtrosGeneralesLetraTemplate" ).html());
	$( "#filtroLetra" ).html(template(contenedorFiltros));



});
function mostrarCompras(){

	if($('#inpFiltroFechaDesde').val()=="" && $('#inpFiltroFechaCargaDesde').val()==""){
		alert("Debe ingresar una fecha desde.")
		return;
	}
	if($('#inpFiltroFechaHasta').val()=="" && $('#inpFiltroFechaCargaHasta').val()==""){
		alert("Debe ingresar una fecha hasta.")
		return;
	}
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$('#idBotonBuscar').hide();
	$( "#main" ).html("");
	  $.ajax({
		  url: 'ajaxLibroIVACompras.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {
			     'mfiltroFechaDesde': $('#inpFiltroFechaDesde').val(),
			     'mfiltroFechaHasta': $('#inpFiltroFechaHasta').val(),
			     'mfiltroSucursales': $('#inpFiltroSucursales').val(),
			     'mfiltroTipoComprobante': $('#inpFiltroTipoComprobante').val(),
			     'mfiltroFechaDesdeCarga': $('#inpFiltroFechaCargaDesde').val(),
			     'mfiltroFechaHastaCarga': $('#inpFiltroFechaCargaHasta').val(),
			  	'mfiltroLetras': $('#inpFiltroLetras').val(),
			     },
		  success: function(resultado){
			  		contenedorDeResultados = $.parseJSON(resultado);


			  		mostrarTemplateGeneral(contenedorDeResultados, 'resultado', 'templateLibroIVACompras','main')



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
function cerrarCompra(div){
	$('#'+div).html("");
}
function exportarAExcell(){
	if($('#inpFiltroFechaDesde').val()=="" && $('#inpFiltroFechaCargaDesde').val()==""){
		alert("Debe ingresar una fecha desde.")
		return;
	}
	if($('#inpFiltroFechaHasta').val()=="" && $('#inpFiltroFechaCargaHasta').val()==""){
		alert("Debe ingresar una fecha hasta.")
		return;
	}
	$('#mfiltroFechaDesde').val($('#inpFiltroFechaDesde').val());
	$('#mfiltroFechaHasta').val($('#inpFiltroFechaHasta').val());
	$('#mfiltroSucursales').val($('#inpFiltroSucursales').val());
	$('#mfiltroLetras').val($('#inpFiltroLetras').val());
	$('#mfiltroTipoComprobante').val($('#inpFiltroTipoComprobante').val());
	$('#mfiltroFechaDesdeCarga').val($('#inpFiltroFechaCargaDesde').val());
	$('#mfiltroFechaHastaCarga').val($('#inpFiltroFechaCargaHasta').val());

	action = 'ajaxLibroIVACompras.php?token='+$('#mToken').val();

	$('#frmExportarExcel').attr('action',action);
	$("#frmExportarExcel" ).submit();
}