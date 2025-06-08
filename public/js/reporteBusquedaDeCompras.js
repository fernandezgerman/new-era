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

    var template = _.template($( "#filtrosGeneralesImporteDesdeTemplate" ).html());
    $( "#filtroImporteDesde" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesImporteHastaTemplate" ).html());
    $( "#filtroImporteHasta" ).html(template(contenedorFiltros));
    
    
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

    var template = _.template($( "#filtrosGeneralesProveedoresTemplate" ).html());
    $( "#filtroProveedores" ).html(template(contenedorFiltros));    
    
    var template = _.template($( "#filtrosGeneralesCUITProveedorTemplate" ).html());
    $( "#filtrosCuit" ).html(template(contenedorFiltros));    
    
    var template = _.template($( "#filtrosGeneralesNumeroCompraTemplate" ).html());
    $( "#filtrosNumeroCompra" ).html(template(contenedorFiltros));    
    
    var template = _.template($( "#filtrosGeneralesTCTemplate" ).html());
    $( "#filtroTipoComprobante" ).html(template(contenedorFiltros));    
    
        
    
    /*
    cargaInstantanea = obtenerParametroDesdeRequest('inpCargaInstantanea');
    
    
    if(cargaInstantanea==1){
    	sucursales = obtenerParametroDesdeRequest('inpSucursales');
    	rubros = obtenerParametroDesdeRequest('inpRubros');
    	listas = obtenerParametroDesdeRequest('inpListas');
    	usuarios = obtenerParametroDesdeRequest('inpUsuarios');
    	fechaDesde = obtenerParametroDesdeRequest('inpFechaDesde');
    	fechaHasta = obtenerParametroDesdeRequest('inpFechaHasta');
    	horaDesde = obtenerParametroDesdeRequest('inpHoraDesde');
    	horaHasta = obtenerParametroDesdeRequest('inpHoraHasta');
    	articulo = obtenerParametroDesdeRequest('inpArticulo');
    	
    	$("#inpFiltroCodigoArticulo").val(articulo);
    	$("#inpFiltroFechaDesde").val(fechaDesde);
    	$("#inpFiltroFechaHasta").val(fechaHasta);
    	$("#inpFiltroHoraDesde").val(horaDesde);
    	$("#inpFiltroHoraHasta").val(horaHasta);
    	
    	seleccionarMultiSelectArreglo('inpFiltroSucursales',sucursales.split(','));
    	seleccionarMultiSelectArreglo('inpFiltroUsuarios',usuarios.split(','));
    	seleccionarMultiSelectArreglo('inpFiltroListas',listas.split(','));
    	seleccionarMultiSelectArreglo('inpFiltroRubros',rubros.split(','));
    	
    	mostrarDatos();
    	
    }
    cargaInstantanea = obtenerParametroDesdeRequest('inpCargaInstantanea');
*/
   	
    
});

function mostrarDetalleCompra(div,idcompra){
	
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
		  		res = $.parseJSON(resultado);

				_.templateSettings.variable = "resultado";
				
				var template = _.template($( "#visorDeCompraTemplate").html());
			    $( "#"+res.div ).html(template(res));
			    
		  		$('#reporteCompleto').removeClass('divBuscandoInformacion');
		  		
			},
		  error: function(){
				alert('Error al cargar los datos.') ;
				$('#idBotonBuscar').show();
				$('#reporteCompleto').removeClass('divBuscandoInformacion');
			}
	});	    
}
function mostrarCompras(){
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$('#idBotonBuscar').hide();
	$( "#main" ).html("");
	
	  $.ajax({
		  url: 'ajaxBusquedaDeCompras.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {
			     'filtroFechaDesde': $('#inpFiltroFechaDesde').val(),
			     'filtroFechaHasta': $('#inpFiltroFechaHasta').val(),
			     'filtroSucursales': $('#inpFiltroSucursales').val(),
			     'filtroUsuarios': $('#inpFiltroUsuarios').val(),
			     'filtroProveedores': $('#inpFiltroProveedores').val(),
			     'filtroCuit': $('#inpFiltroCUITProveedor').val(),
			     'filtroTipoComprobante': $('#inpFiltroTipoComprobante').val(),
			     'filtroNumero': $('#inpFiltroNumeroCompra').val(),
			     'filtroFechaDesdeCarga': $('#inpFiltroFechaCargaDesde').val(),
			     'filtroFechaHastaCarga': $('#inpFiltroFechaCargaHasta').val(),
			     'filtroImporteDesde': $('#inpFiltroImporteDesde').val(),
			     'filtroImporteHasta': $('#inpFiltroImporteHasta').val()			     
			     },
		  success: function(resultado){
			  		contenedorDeResultados = Array();
			  		res = $.parseJSON(resultado);
			  		contenedorDeResultados['main'] = res;
					_.templateSettings.variable = "resultado";
					
					var template = _.template($( "#templateBusquedaDeCompras").html());
				    $( "#main" ).html(template(res));
				    
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
function editarCompra(compraId){
	$('#idCompra').val(compraId);
	document.getElementById('frmEditar').submit();	
}