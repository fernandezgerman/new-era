var contenedorFiltros = Array();
var contenedorDeResultados = Array();

$(document).ready(function(){
	_.templateSettings.variable = "filtros";
    

    var template = _.template($( "#filtrosGeneralesFechaHastaTemplate" ).html());
    $( "#filtroFechaHasta" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesSucursalesTemplate" ).html());
    $( "#filtroSucursales" ).html(template(contenedorFiltros)); 
    
    var template = _.template($( "#filtrosGeneralesUsuariosTemplate" ).html());
    $( "#filtroUsuarios" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesRubrosTemplate" ).html());
    $( "#filtroRubros" ).html(template(contenedorFiltros));    
    
    var template = _.template($( "#filtrosGeneralesHoraDesdeTemplate" ).html());
    $( "#filtroHoraDesde" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesHoraHastaTemplate" ).html());
    $( "#filtroHoraHasta" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesArticuloTemplate" ).html());
    $( "#filtroArticuloCodigo" ).html(template(contenedorFiltros));    
        
    

    
});
function mostrarDatos(){
	if (validarDatosBusqueda()){	
		$('#idBotonBuscar').hide();
		$('#reporteCompleto').addClass('divBuscandoInformacion');
		$( "#main" ).html("");
		  $.ajax({
			  url: 'ajaxReporteArreglosPorSemana.php?token='+document.getElementById('mToken').value,
			  type: 'POST',
			  datatype :'json',
			  async: true,
			  data: {
				     'filtroSucursales': $('#inpFiltroSucursales').val(),
				     'filtroUsuarios': $('#inpFiltroUsuarios').val(),
				     'filtroRubros': $('#inpFiltroRubros').val(),
				     'filtroFechaDesde': $('#inpFiltroFechaDesde').val(),
				     'filtroFechaHasta': $('#inpFiltroFechaHasta').val(),
				     'filtroHoraDesde': $('#inpFiltroHoraDesde').val(),
				     'filtroHasta': $('#inpFiltroHoraHasta').val(),
				     'filtroCodigoArticulo': $('#inpFiltroCodigoArticulo').val(),
				     'contenedor':'main',
				     'semanas':$('#selCantidadDeSemanas').val()
				     },
			  success: function(resultado){
				  		contenedorDeResultados = Array();
				  		res = $.parseJSON(resultado);
				  		contenedorDeResultados['main'] = res;
						_.templateSettings.variable = "resultados";
						
						var template = _.template($( "#templateReporteVentasAgrupadasPorSemana").html());
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
function cerrarDetalle(contenedor){
	$('#'+contenedor).html("");
	contenedorDeResultados[contenedor] = Array();
	
}
function mostrarGraficoPorCantidad(contenedor,idrubro){
	
	grafico = Array();
	grafico['contenedor'] = contenedor;
	grafico['etiqueta'] = 'Cantidad';
	grafico['cantidad'] = $('#selCantidadDeSemanas').val();
	
	_.templateSettings.variable = "grafico";
    var template = _.template($( "#templateGrafico" ).html());
    $( "#"+contenedor ).html(template(grafico));	
	
    res = contenedorDeResultados['main'];
    semanas = res['semanas'];
    valores = res['valores'];
    titulos = Array();
    lineas = Array();
    for(s=0;s<semanas['totalSemanas'];s++){
    	semana = semanas[s];
    	titulos[s] = semana['numero'];
    	clave = semana['anio']+'-'+semana['numero']+'-'+idrubro;
    	valor = valores[clave]
    	lineas[s] = valor['cantidad'];
    }
    
    
	var lineChartData = {
			labels : titulos,
			datasets : [
				{
					label: "Importe",
					fillColor : "rgba(238,154,47,0)",
					strokeColor : "rgba(238,154,47,1)",
					pointColor : "rgba(238,154,47,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(238,154,47,1)",
					data : lineas
				}								
			]

		}
	
	var ctx = document.getElementById(contenedor+'GRF').getContext("2d");
	
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: false
	});
	
}
function mostrarGraficoPorVentas(contenedor,idrubro){
	
	grafico = Array();
	grafico['contenedor'] = contenedor;
	grafico['etiqueta'] = 'Ventas';
	grafico['cantidad'] = $('#selCantidadDeSemanas').val();
	
	_.templateSettings.variable = "grafico";
    var template = _.template($( "#templateGrafico" ).html());
    $( "#"+contenedor ).html(template(grafico));	
	
    res = contenedorDeResultados['main'];
    semanas = res['semanas'];
    valores = res['valores'];
    titulos = Array();
    lineas = Array();
    for(s=0;s<semanas['totalSemanas'];s++){
    	semana = semanas[s];
    	titulos[s] = semana['numero'] ;
    	clave = semana['anio']+'-'+semana['numero']+'-'+idrubro;
    	valor = valores[clave]
    	lineas[s] = valor['preciounitario'];
    }
    
    
	var lineChartData = {
			labels : titulos,
			datasets : [
				{
					label: "Importe",
					fillColor : "rgba(238,154,47,0)",
					strokeColor : "rgba(238,154,47,1)",
					pointColor : "rgba(238,154,47,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(238,154,47,1)",
					data : lineas
				}								
			]

		}
	
	var ctx = document.getElementById(contenedor+'GRF').getContext("2d");
	
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: false
	});
	
}
function mostrarGraficoPorImporteGanancia(contenedor,idrubro){
	
	grafico = Array();
	grafico['contenedor'] = contenedor;
	grafico['etiqueta'] = '$ Ganancia';
	grafico['cantidad'] = $('#selCantidadDeSemanas').val();
	
	_.templateSettings.variable = "grafico";
    var template = _.template($( "#templateGrafico" ).html());
    $( "#"+contenedor ).html(template(grafico));	
	
    res = contenedorDeResultados['main'];
    semanas = res['semanas'];
    valores = res['valores'];
    titulos = Array();
    lineas = Array();
    for(s=0;s<semanas['totalSemanas'];s++){
    	semana = semanas[s];
    	titulos[s] = semana['numero'];
    	clave = semana['anio']+'-'+semana['numero']+'-'+idrubro;
    	valor = valores[clave]
		v = parseFloat(valor['preciounitario']) - parseFloat(valor['costosucursal']);
    	lineas[s] = formatearPrecio(v);
    }
    
    
	var lineChartData = {
			labels : titulos,
			datasets : [
				{
					label: "Importe",
					fillColor : "rgba(238,154,47,0)",
					strokeColor : "rgba(238,154,47,1)",
					pointColor : "rgba(238,154,47,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(238,154,47,1)",
					data : lineas
				}								
			]

		}
	
	var ctx = document.getElementById(contenedor+'GRF').getContext("2d");
	
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: false
	});
	
}
function mostrarGraficoPorPorcentajeGanancia(contenedor,idrubro){
	
	grafico = Array();
	grafico['contenedor'] = contenedor;
	grafico['etiqueta'] = '% Ganancia';
	grafico['cantidad'] = $('#selCantidadDeSemanas').val();
	
	_.templateSettings.variable = "grafico";
    var template = _.template($( "#templateGrafico" ).html());
    $( "#"+contenedor ).html(template(grafico));	
	
    res = contenedorDeResultados['main'];
    semanas = res['semanas'];
    valores = res['valores'];
    titulos = Array();
    lineas = Array();
    for(s=0;s<semanas['totalSemanas'];s++){
    	semana = semanas[s];
    	titulos[s] = semana['numero'];
    	clave = semana['anio']+'-'+semana['numero']+'-'+idrubro;
    	valor = valores[clave]
		v = parseFloat(valor['preciounitario']) - parseFloat(valor['costosucursal']);
    	v = (v / parseFloat(valor['costosucursal'])) * 100;
    	lineas[s] = formatearPrecio(v);
    }
    
    
	var lineChartData = {
			labels : titulos,
			datasets : [
				{
					label: "Importe",
					fillColor : "rgba(238,154,47,0)",
					strokeColor : "rgba(238,154,47,1)",
					pointColor : "rgba(238,154,47,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(238,154,47,1)",
					data : lineas
				}								
			]

		}
	
	var ctx = document.getElementById(contenedor+'GRF').getContext("2d");
	
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: false
	});
	
}
/*
function verDetalleDesglozadoPorRubro(fechaDesde,fechaHasta,idRubro){
	//$("#frmVerDetallePorRubro input[name=inpSucursalId]").val(idsucursal);+
  	
	res = contenedorDeResultados['main'];
	filtros = res['filtros'];
		
	$("#frmVerDetallePorRubro input[name=token]").val($('#mToken').val());
	$("#frmVerDetallePorRubro input[name=inpCargaInstantanea]").val('1');
	$("#frmVerDetallePorRubro input[name=inpSucursales]").val(arregloACadena(filtros['filtroSucursales'],','));
	$("#frmVerDetallePorRubro input[name=inpRubros]").val(idRubro);
	$("#frmVerDetallePorRubro input[name=inpListas]").val(arregloACadena(filtros['filtroListas'],','));
	$("#frmVerDetallePorRubro input[name=inpUsuarios]").val(arregloACadena(filtros['filtroUsuarios'],','));
	$("#frmVerDetallePorRubro input[name=inpFechaDesde]").val(fechaDesde);
	$("#frmVerDetallePorRubro input[name=inpFechaHasta]").val(fechaHasta);
	$("#frmVerDetallePorRubro input[name=inpHoraDesde]").val(filtros['filtroHoraDesde']);
	$("#frmVerDetallePorRubro input[name=inpHoraHasta]").val(filtros['filtroHoraHasta']);
	$("#frmVerDetallePorRubro input[name=inpArticulo]").val(filtros['filtroCodigoArticulo']);
	$("#frmVerDetallePorRubro input[name=pagina]").val("rptsvtsagrrbr");
	
	$("#frmVerDetallePorRubro" ).submit();	
}
*/

function verDetalleArregloDelRubro(idRubro,fechaDesde,fechaHasta,sucursales){
	
	$("#frmVerDetallePorRubro input[name=filtroSucursalesTodas]").val(sucursales);
	$("#frmVerDetallePorRubro input[name=inpRubroId]").val(idRubro);
	$("#frmVerDetallePorRubro input[name=inpFechaDesde]").val(fechaDesde);
	$("#frmVerDetallePorRubro input[name=inpFechaHasta]").val(fechaHasta);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=renstockrep';
	
	$('#frmVerDetallePorRubro').attr('action',action);
	$("#frmVerDetallePorRubro" ).submit();	
		
	
}
