var contenedorFiltros = Array();
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

	var template = _.template($( "#filtrosGeneralesTurnosTemplate" ).html());
	$( "#filtroTurno" ).html(template());

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

   	
    $("#divPresentacionDiscriminarsucursal").hide();
});


function mostrarDatos(){
	if (validarDatosBusqueda()){	
		$('#idBotonBuscar').hide();
		$('#reporteCompleto').addClass('divBuscandoInformacion');
		$( "#main" ).html("");
		  $.ajax({
			  url: 'ajaxReporteVentasAgrupadas.php?token='+document.getElementById('mToken').value,
			  type: 'POST',
			  datatype :'json',
			  async: true,
			  data: {
				  	 'filtroTurno': $('#inpFiltroTurno').val(),
				     'filtroSucursales': $('#inpFiltroSucursales').val(),
				     'filtroUsuarios': $('#inpFiltroUsuarios').val(),
				     'filtroRubros': $('#inpFiltroRubros').val(),
				     'filtroListas': $('#inpFiltroListas').val(),
				     'filtroFechaDesde': $('#inpFiltroFechaDesde').val(),
				     'filtroFechaHasta': $('#inpFiltroFechaHasta').val(),
				     'filtroHoraDesde': $('#inpFiltroHoraDesde').val(),
				     'filtroHasta': $('#inpFiltroHoraHasta').val(),
				     'filtroCodigoArticulo': $('#inpFiltroCodigoArticulo').val(),
				     'discriminarPorSucursal': $('#inpChkMostrarSucursal').is(':checked'),
				     'discriminarMostrarSeparado':$('input:radio[name=inpRadioMostrarSucursal]:checked').val(),
				     'contenedor':'main'
				     },
			  success: function(resultado){
				  		contenedorDeResultados = Array();
				  		res = $.parseJSON(resultado);
				  		filtros = res['filtros'];
				  		filtros['contenedor'] = 'main';
				  		
						_.templateSettings.variable = "resultados";
						
						
						if ($('#inpChkMostrarSucursal').is(':checked') && $('input:radio[name=inpRadioMostrarSucursal]:checked').val() == 'TOTALIZAR_POR_SUCURSAL'){
							res['template'] = "templateReporteVentasAgrupadasPorSucursal";
						}else{
							res['template'] = "templateReporteVentasAgrupadasPorRubro";
						}
						contenedorDeResultados['main'] = res;
						var template = _.template($( "#"+res['template']).html());
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

}
function mostrarDetalleRubroPorRenglon(contenedor,idsucursal){
	resultadoCentral = contenedorDeResultados['main'];
	filtros = resultadoCentral['filtros'];
	sucursal = Array();
	sucursal[0] = idsucursal;
	$('#idBotonBuscar').hide();
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$( "#"+contenedor ).html("");
	  $.ajax({
		  url: 'ajaxReporteVentasAgrupadas.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {
		  	     'filtroTurno': $('#inpFiltroTurno').val(),
			     'filtroSucursales': sucursal,
			     'filtroUsuarios': filtros['filtroUsuarios'],
			     'filtroRubros': filtros['filtroRubros'],
			     'filtroListas': filtros['filtroListas'],
			     'filtroFechaDesde': filtros['filtroFechaDesde'],
			     'filtroFechaHasta': filtros['filtroFechaHasta'],
			     'filtroHoraDesde': filtros['filtroHoraDesde'],
			     'filtroHasta':filtros['filtroHoraHasta'],
			     'filtroCodigoArticulo': filtros['filtroCodigoArticulo'],
			     'discriminarPorSucursal': 0,
			     'discriminarMostrarSeparado':filtros['discriminarMostrarSeparado'],
			     'contenedor':contenedor			     
			     },
		  success: function(resultado){
			  		dt = $.parseJSON(resultado);
			  		
			  		filtros = dt['filtros'];
			  		cont = filtros['contenedor']; 
			  		
			  		
					_.templateSettings.variable = "resultados";
					dt['template'] = "templateReporteVentasAgrupadasPorRubro";
					contenedorDeResultados[cont] = dt;
				    var template = _.template($( "#"+dt['template'] ).html());
				    $( "#"+cont).html(template(dt));
				    
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
function mostrarDetalleArticuloPorRenglon(contenedor,idsucursal,idrubro,idPadre){
	resultadoCentral = contenedorDeResultados[idPadre];
	filtros = resultadoCentral['filtros'];
	sucursal = filtros['filtroSucursales'];
	if(filtros['discriminarPorSucursal']=='true'){
		if(idsucursal != ''){
			sucursal = Array();
			sucursal[0] = idsucursal;			
		}

	}
	
	
	$('#idBotonBuscar').hide();
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$( "#"+contenedor ).html("");
	  $.ajax({
		  url: 'ajaxReporteVentasAgrupadasPorArticulo.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {
			  'filtroTurno': $('#inpFiltroTurno').val(),
			     'filtroSucursales': sucursal,
			     'filtroUsuarios': filtros['filtroUsuarios'],
			     'filtroRubros': idrubro,
			     'filtroListas': filtros['filtroListas'],
			     'filtroFechaDesde': filtros['filtroFechaDesde'],
			     'filtroFechaHasta': filtros['filtroFechaHasta'],
			     'filtroHoraDesde': filtros['filtroHoraDesde'],
			     'filtroHasta':filtros['filtroHoraHasta'],
			     'filtroCodigoArticulo': filtros['filtroCodigoArticulo'],
			     'discriminarPorSucursal': 0,
			     'discriminarMostrarSeparado':filtros['discriminarMostrarSeparado'],
			     'contenedor':contenedor			     
			     },
		  success: function(resultado){
			  		dt = $.parseJSON(resultado);
			  		filtros = dt['filtros'];
			  		cont = filtros['contenedor']; 			  		
			  		
					_.templateSettings.variable = "resultados";
					dt['template'] = "templateReporteVentasAgrupadasPorArticulos";
					contenedorDeResultados[cont] = dt;
				    var template = _.template($( "#"+dt['template'] ).html());
				    $( "#"+cont).html(template(dt));
				    
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
function mostrarDetalleTodasVentasArticulo(contenedor,idarticulo,idPadre,codigoArticulo,sucursalId){
	resultadoCentral = contenedorDeResultados[idPadre];
	filtros = resultadoCentral['filtros'];
	sucursal = filtros['filtroSucursales'];
	
	$('#idBotonBuscar').hide();
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$( "#"+contenedor ).html("");
	  $.ajax({
		  url: 'ajaxReporteVentasAgrupadasPorArticuloTodos.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {
			  'filtroTurno': $('#inpFiltroTurno').val(),
			     'filtroSucursales': ','+sucursalId+',',
			     'filtroUsuarios': filtros['filtroUsuarios'],
			     'filtroRubros': filtros['filtroRubros'],
			     'filtroListas': filtros['filtroListas'],
			     'filtroFechaDesde': filtros['filtroFechaDesde'],
			     'filtroFechaHasta': filtros['filtroFechaHasta'],
			     'filtroHoraDesde': filtros['filtroHoraDesde'],
			     'filtroHasta':filtros['filtroHoraHasta'],
			     'filtroCodigoArticulo': codigoArticulo,
			     'discriminarPorSucursal': 0,
			     'discriminarMostrarSeparado':filtros['discriminarMostrarSeparado'],
			     'contenedor':contenedor			     
			     },
		  success: function(resultado){
			  		dt = $.parseJSON(resultado);
			  		filtros = dt['filtros'];
			  		cont = filtros['contenedor']; 
			  		
			  		
					_.templateSettings.variable = "resultados";
					dt['template'] = "templateReporteVentasPorArticulosTodas";
					contenedorDeResultados[cont] = dt;
				    var template = _.template($( "#"+dt['template'] ).html());
				    $( "#"+cont).html(template(dt));
				    
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

function mostrarDetalleTodasVentasArticuloSucursal(contenedor,idarticulo,idPadre,codigoArticulo){
	resultadoCentral = contenedorDeResultados[idPadre];
	filtros = resultadoCentral['filtros'];
	sucursal = filtros['filtroSucursales'];

	$('#idBotonBuscar').hide();
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$( "#"+contenedor ).html("");
	$.ajax({
		url: 'ajaxReporteVentasAgrupadasPorArticuloSucursal.php?token='+document.getElementById('mToken').value,
		type: 'POST',
		datatype :'json',
		async: true,
		data: {
			'filtroTurno': $('#inpFiltroTurno').val(),
			'filtroSucursales': sucursal,
			'filtroUsuarios': filtros['filtroUsuarios'],
			'filtroRubros': filtros['filtroRubros'],
			'filtroListas': filtros['filtroListas'],
			'filtroFechaDesde': filtros['filtroFechaDesde'],
			'filtroFechaHasta': filtros['filtroFechaHasta'],
			'filtroHoraDesde': filtros['filtroHoraDesde'],
			'filtroHasta':filtros['filtroHoraHasta'],
			'filtroCodigoArticulo': codigoArticulo,
			'discriminarPorSucursal': 0,
			'discriminarMostrarSeparado':filtros['discriminarMostrarSeparado'],
			'contenedor':contenedor
		},
		success: function(resultado){
			dt = $.parseJSON(resultado);
			if(dt['error']==1){
				alert(dt['mensajeError']);
				return;
			}
			filtros = dt['filtros'];
			cont = filtros['contenedor'];


			_.templateSettings.variable = "resultados";
			dt['template'] = "templateReporteVentasPorArticulosSucursal";
			contenedorDeResultados[cont] = dt;
			var template = _.template($( "#"+dt['template'] ).html());
			$( "#"+cont).html(template(dt));

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

function mostrarSucursalSeparado(){
	if($('#inpChkMostrarSucursal').is(':checked')){
		$("#divPresentacionDiscriminarsucursal").show(500);
	}else{
		$("#divPresentacionDiscriminarsucursal").hide(500);
		
	}
}
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
function ordenarRubrosPorNombre(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['ordenNombre']==1){
		contenedorResultado['ordenNombre']=-1;
	}else{
		contenedorResultado['ordenNombre']=1;
	}
	lista = _.sortBy(lista, function(fila){
		cadena = fila['rubronombre'];
		if(fila['rubronombre']){
			cadena = cadena.toUpperCase();
		}
		return cadena; 
		});
	contenedorResultado['registros'] = lista ;
	
	contenedorDeResultados[subreporte] = contenedorResultado;
	_.templateSettings.variable = "resultados";
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}
function ordenarVentasPorFecha(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['fechahoraorden']==1){
		contenedorResultado['fechahoraorden']=-1;
	}else{
		contenedorResultado['fechahoraorden']=1;
	}
	lista = _.sortBy(lista, function(fila){
		cadena = fila['fechahoraorden'];
		if(fila['fechahoraorden']){
			cadena = cadena.toUpperCase();
		}
		return cadena; 
		});
	contenedorResultado['registros'] = lista ;
	
	contenedorDeResultados[subreporte] = contenedorResultado;
	_.templateSettings.variable = "resultados";
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}
function ordenarArticulosPorNombre(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['ordenNombre']==1){
		contenedorResultado['ordenNombre']=-1;
	}else{
		contenedorResultado['ordenNombre']=1;
	}
	lista = _.sortBy(lista, function(fila){
		cadena = fila['articulonombre'];
		if(fila['articulonombre']){
			cadena = cadena.toUpperCase();
		}
		return cadena; 
		});
	contenedorResultado['registros'] = lista ;
	
	contenedorDeResultados[subreporte] = contenedorResultado;
	_.templateSettings.variable = "resultados";
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}
function ordenarSucursalesPorNombre(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];
	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['ordenNombreSucursal']==1){
		contenedorResultado['ordenNombreSucursal']=-1;
	}else{
		contenedorResultado['ordenNombreSucursal']=1;
	}
	lista = _.sortBy(lista, function(fila){
		cadena = fila['sucursalnombre'];
		if(fila['sucursalnombre']){
			cadena = cadena.toUpperCase();
		}
		return cadena; 
		});
	contenedorResultado['registros'] = lista ;
	contenedorDeResultados[subreporte] = contenedorResultado;
	_.templateSettings.variable = "resultados";
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}

function ordenarRubrosPorImporteGanancia(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['ordenGananciaImporte']==1){
		contenedorResultado['ordenGananciaImporte']=-1;
	}else{
		contenedorResultado['ordenGananciaImporte']=1;
	}
	lista = _.sortBy(lista, function(fila){ 
		return parseFloat(fila['ganancia'])*contenedorResultado['ordenGananciaImporte'] ; 
		});
	contenedorResultado['registros'] = lista ;
	
	contenedorDeResultados[subreporte] = contenedorResultado;
	
	_.templateSettings.variable = "resultados";
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}

function ordenarRubrosPororcentajeGanancia(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['ordenGananciaPorcentaje']==1){
		contenedorResultado['ordenGananciaPorcentaje']=-1;
	}else{
		contenedorResultado['ordenGananciaPorcentaje']=1;
	}
	lista = _.sortBy(lista, function(fila){ 
		return (parseFloat(fila['preciounitario']) - parseFloat(fila['costosucursal'])) / parseFloat(fila['preciounitario']) * 100 *contenedorResultado['ordenGananciaPorcentaje']; 
		});
	contenedorResultado['registros'] = lista ;
	
	_.templateSettings.variable = "resultados";
	
	contenedorDeResultados[subreporte] = contenedorResultado;
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');

	document.getElementById('nombre').value
}
function ordenarRubrosCostoSucursal(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['ordenCostoSucursal']==1){
		contenedorResultado['ordenCostoSucursal']=-1;
	}else{
		contenedorResultado['ordenCostoSucursal']=1;
	}
	lista = _.sortBy(lista, function(fila){ 
		return parseFloat(fila['costosucursal'])*contenedorResultado['ordenCostoSucursal']; 
		});
	contenedorResultado['registros'] = lista ;
	contenedorDeResultados[subreporte] = contenedorResultado;
	_.templateSettings.variable = "resultados";
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}
function ordenarRubrosCantidad(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['ordenCantidad']==1){
		contenedorResultado['ordenCantidad']=-1;
	}else{
		contenedorResultado['ordenCantidad']=1;
	}
	lista = _.sortBy(lista, function(fila){ 
		return parseFloat(fila['cantidad'])*contenedorResultado['ordenCantidad']; 
		});
	contenedorResultado['registros'] = lista ;
	contenedorDeResultados[subreporte] = contenedorResultado;
	_.templateSettings.variable = "resultados";
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}
function ordenarRubrosImporteVendido(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];
	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['ordenImporteVendido']==1){
		contenedorResultado['ordenImporteVendido']=-1;
	}else{
		contenedorResultado['ordenImporteVendido']=1;
	}
	lista = _.sortBy(lista, function(fila){ 
		return parseFloat(fila['preciounitario'])*contenedorResultado['ordenImporteVendido']; 
		});
	contenedorResultado['registros'] = lista ;
	contenedorDeResultados[subreporte] = contenedorResultado;
	
	_.templateSettings.variable = "resultados";
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}
function ExistenciaExportarExcel(){
	if (validarDatosBusqueda()){
		$('#frmExportacion input[name=filtroTurno]').val($('#inpFiltroTurno').val());
		$('#frmExportacion input[name=filtroSucursales]').val($('#inpFiltroSucursales').val());
		$('#frmExportacion input[name=filtroUsuarios]').val( $('#inpFiltroUsuarios').val());
		$('#frmExportacion input[name=filtroRubros]').val( $('#inpFiltroRubros').val());
		$('#frmExportacion input[name=filtroListas]').val( $('#inpFiltroListas').val());
		$('#frmExportacion input[name=filtroFechaDesde]').val( $('#inpFiltroFechaDesde').val());
		$('#frmExportacion input[name=filtroFechaHasta]').val( $('#inpFiltroFechaHasta').val());
		$('#frmExportacion input[name=filtroHoraDesde]').val( $('#inpFiltroHoraDesde').val());
		$('#frmExportacion input[name=filtroHasta]').val( $('#inpFiltroHoraHasta').val());
		$('#frmExportacion input[name=filtroCodigoArticulo]').val( $('#inpFiltroCodigoArticulo').val());
		$('#frmExportacion input[name=discriminarPorSucursal]').val( $('#inpChkMostrarSucursal').is(':checked'));
		$('#frmExportacion input[name=discriminarMostrarSeparado]').val($('input:radio[name=inpRadioMostrarSucursal]:checked').val());
        if($('#inpChkMostrarPromedios').is(':checked')){
            $('#frmExportacion input[name=mostrarPromedios]').val(1);
        }else{
            $('#frmExportacion input[name=mostrarPromedios]').val(0);
        }

		action = 'ventasAgrupadasPorRubrosExcel.php?token='+document.getElementById('mToken').value;
		$('#frmExportacion').attr('action',action);
		$("#frmExportacion" ).submit();

	}
}
function ExistenciaExportarPDF(){
    if (validarDatosBusqueda()){
		$('#frmExportacion input[name=filtroTurno]').val($('#inpFiltroTurno').val());
        $('#frmExportacion input[name=filtroSucursales]').val($('#inpFiltroSucursales').val());
        $('#frmExportacion input[name=filtroUsuarios]').val( $('#inpFiltroUsuarios').val());
        $('#frmExportacion input[name=filtroRubros]').val( $('#inpFiltroRubros').val());
        $('#frmExportacion input[name=filtroListas]').val( $('#inpFiltroListas').val());
        $('#frmExportacion input[name=filtroFechaDesde]').val( $('#inpFiltroFechaDesde').val());
        $('#frmExportacion input[name=filtroFechaHasta]').val( $('#inpFiltroFechaHasta').val());
        $('#frmExportacion input[name=filtroHoraDesde]').val( $('#inpFiltroHoraDesde').val());
        $('#frmExportacion input[name=filtroHasta]').val( $('#inpFiltroHoraHasta').val());
        $('#frmExportacion input[name=filtroCodigoArticulo]').val( $('#inpFiltroCodigoArticulo').val());
        $('#frmExportacion input[name=discriminarPorSucursal]').val( $('#inpChkMostrarSucursal').is(':checked'));
        $('#frmExportacion input[name=discriminarMostrarSeparado]').val($('input:radio[name=inpRadioMostrarSucursal]:checked').val());

        if($('#inpChkMostrarPromedios').is(':checked')){
            $('#frmExportacion input[name=mostrarPromedios]').val(1);
		}else{
            $('#frmExportacion input[name=mostrarPromedios]').val(0);
		}
        action = 'ventasAgrupadasPorRubrosPDF.php?token='+document.getElementById('mToken').value;
        $('#frmExportacion').attr('action',action);
        $("#frmExportacion" ).submit();

    }
}

function cerrarDetalle(contenedor){
    $('#'+contenedor).html("");
    contenedorDeResultados[contenedor] = Array();

}

function ordenarRubrosPorImporteStockActual(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];

	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];
	$('#reporteCompleto').addClass('divBuscandoInformacion');


	if (contenedorResultado['ordenStockActual']==1){
		contenedorResultado['ordenStockActual']=-1;
	}else{
		contenedorResultado['ordenStockActual']=1;
	}
	lista = _.sortBy(lista, function(fila){
		return parseFloat(fila['existencia'])*contenedorResultado['ordenStockActual'] ;
	});
	contenedorResultado['registros'] = lista ;

	contenedorDeResultados[subreporte] = contenedorResultado;

	_.templateSettings.variable = "resultados";

	var template = _.template($( "#"+contenedorResultado['template'] ).html());
	$( "#"+cont ).html(template(contenedorResultado));

	$('#reporteCompleto').removeClass('divBuscandoInformacion');

}