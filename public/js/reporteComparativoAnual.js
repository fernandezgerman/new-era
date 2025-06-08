var filtros = Array();
var contenedorDeResultados = Array();

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

    var template = _.template($( "#filtrosGeneralesAniosTemplate" ).html());
    $( "#filtroAnio" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesMesTemplate" ).html());
    $( "#filtroMes" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesRubrosExcluirTemplate" ).html());
    $( "#filtroExcluirRubros" ).html(template(contenedorFiltros));

    $("#filtroMes").css("display","none");
        
});
function validarDatosBusqueda(){
	if($('#inpFiltroFechaDesde').val()==""){
		alert("Debe ingresar una fecha desde.");
		$('#inpFiltroFechaDesde').focus();
		return false;
	}
	if($('#inpFiltroFechaHasta').val()==""){
		alert("Debe ingresar una fecha hasta.");
		$('#inpFiltroFechaHasta').focus();
		return false;
	}	
	return true;
}
function mostrarDatos(){
	
	if (validarDatosBusqueda()){	
		
		$('#idBotonBuscar').hide();
		$('#reporteCompleto').addClass('divBuscandoInformacion');
		$( "#main" ).html('');
		fmes = $('#inpFiltroMes').val();
		if($("input[name='inpRadioAgrupacion']:checked").val()=='ANIO'){
			fmes = "";
		}
		  $.ajax({
			  url: 'ajaxComparativoDeVentas.php?token='+document.getElementById('mToken').value,
			  type: 'POST',
			  datatype :'json',
			  async: true,
			  data: {
				     'sucursales': $('#inpFiltroSucursales').val(),
				     'usuarios': $('#inpFiltroUsuarios').val(),
				     'listas': $('#inpFiltroListas').val(),
				     'rubros': $('#inpFiltroRubros').val(),
				     'codigoArticulo': $('#inpFiltroCodigoArticulo').val(),
				     'fechaDesde': $('#inpFiltroFechaDesde').val(),
				     'fechaHasta': $('#inpFiltroFechaHasta').val(),
				     'horaDesde': $('#inpFiltroHoraDesde').val(),
				     'horaHasta': $('#inpFiltroHoraHasta').val(),
				     'agrupacion':$("input[name='inpRadioAgrupacion']:checked").val(),
				     'anio':$('#inpFiltroAnio').val(),
				     'excluirRubros':$('#inpFiltroExcluirRubros').val(),
				     'mes':fmes
				     },
			  success: function(resultado){
				  		res = $.parseJSON(resultado);
				  		contenedorDeResultados = res;
						_.templateSettings.variable = "resultados";
						
						var template = _.template($( "#templateComparativoAnualDeVentas").html());
					    $( "#main" ).html(template(res));
					    
				  		$('#idBotonBuscar').show();
				  		$('#reporteCompleto').removeClass('divBuscandoInformacion');
				  
					},
				  error: function(){
						alert('Error al cargar los datos.') ;
						$('#idBotonBuscar').show();
						$('#reporteCompleto').removeClass('divBuscandoInformacion');
					}
				});
	}

}
function seleccionoAgrupacion()
{
	if($("input[name='inpRadioAgrupacion']:checked").val()=='ANIO'){
		$("#filtroMes").css("display","none");
	}else{
		$("#filtroMes").css("display","block");
	}
} 

function verDetalleDesglozadoPorRubro(fechaDesde,fechaHasta){
	//$("#frmVerDetallePorRubro input[name=inpSucursalId]").val(idsucursal);+
  	
	
	filtros = contenedorDeResultados['filtros'];
		
	$("#frmVerDetalleVenta input[name=token]").val($('#mToken').val());
	$("#frmVerDetalleVenta input[name=inpCargaInstantanea]").val('1');
	$("#frmVerDetalleVenta input[name=inpSucursales]").val(arregloACadena(filtros['sucursales'],','));
	$("#frmVerDetalleVenta input[name=inpRubros]").val(arregloACadena(filtros['rubros'],','));
	$("#frmVerDetalleVenta input[name=inpListas]").val(arregloACadena(filtros['listas'],','));
	$("#frmVerDetalleVenta input[name=inpUsuarios]").val(arregloACadena(filtros['usuarios'],','));
	$("#frmVerDetalleVenta input[name=inpFechaDesde]").val(fechaDesde);
	$("#frmVerDetalleVenta input[name=inpFechaHasta]").val(fechaHasta);
	$("#frmVerDetalleVenta input[name=inpHoraDesde]").val(filtros['horaDesde']);
	$("#frmVerDetalleVenta input[name=inpHoraHasta]").val(filtros['horaHasta']);
	$("#frmVerDetalleVenta input[name=inpArticulo]").val(filtros['codigoArticulo']);
	$("#frmVerDetalleVenta input[name=pagina]").val("rptsvtsagrrbr");
	
	$("#frmVerDetalleVenta" ).submit();	
}