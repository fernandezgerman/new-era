var resultadoBusqueda = Array();


$(document).ready(function(){
	_.templateSettings.variable = "filtros";
	
    var template = _.template($( "#filtrosGeneralesSucursalesTemplate" ).html());
    $( "#filtroSucursales" ).html(template(contenedorFiltros));  

    var template = _.template($( "#filtrosGeneralesProveedoresTemplate" ).html());
    $( "#filtroProveedores" ).html(template(contenedorFiltros));
    
    var template = _.template($( "#filtrosGeneralesOPLoteTemplate" ).html());
    $( "#filtroLotes" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesEstadosFacturaTemplate" ).html());
    $( "#filtroEstadoFactura" ).html(template(contenedorFiltros));
    
    var template = _.template($( "#filtrosGeneralesSeleccionOPTemplate" ).html());
    $( "#filtroSeleccion" ).html(template(contenedorFiltros));        
    
});

function mostrarDatos(){
	//if (validarDatosBusqueda()){	
		$('#idBotonBuscar').hide();
		$('#reporteCompleto').addClass('divBuscandoInformacion');
		$( "#main" ).html("");

		
		  $.ajax({
			  url: 'ajaxGenerarOPPagarListado.php?token='+document.getElementById('mToken').value,
			  type: 'POST',
			  datatype :'json',
			  async: true,
			  data: {
				     'filtroSucursales': $('#inpFiltroSucursales').val(),
				     'filtroProveedores': $('#inpFiltroProveedores').val(),
				     'filtroLotes': $('#inpFiltroLote').val(),
				     'filtroEstado': $('#inpFiltroEstadoFactura').val(),
				     'filtroSelecciones': $('#inpSeleccionId').val()
				     },
			  success: function(resultado){
				  		resultadoBusqueda = $.parseJSON(resultado);
				  								
						_.templateSettings.variable = "resultadoBusqueda";

						var template = _.template($( "#GenerarOPPagarListado").html());
					    $( "#main" ).html(template(resultadoBusqueda));
					    
					    
				  		$('#reporteCompleto').removeClass('divBuscandoInformacion');
				  		$('#idBotonBuscar').show();
					},
				  error: function(){
						alert('Error al cargar los datos.') ;
						$('#idBotonBuscar').show();
						$('#reporteCompleto').removeClass('divBuscandoInformacion');
					}
				});
	//}

}
function mostrarDetalleDeFacturas(ordenId,clase){
	div = 'divDetalleOrden'+ordenId;
	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	

	
	  $.ajax({
		  url: 'ajaxGenerarOPDetalleFactura.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  divContenedor: div,
		  clasecss: clase,
		  data: {
			     'ordenId': ordenId
			     },
		  success: function(resultado){
			  		res = $.parseJSON(resultado);
			  		res['clase'] = this.clasecss;
			  		res['contenedor'] = this.divContenedor;
			  		
			  								
					_.templateSettings.variable = "resultado";

					var template = _.template($( "#GenerarOPDetalleFacturas").html());
				    $( "#"+this.divContenedor ).html(template(res));
				    
			  		$('#reporteCompleto').removeClass('divBuscandoInformacion');
				},
			  error: function(){
					alert('Error al cargar los datos.') ;
					$('#idBotonBuscar').show();
					$('#reporteCompleto').removeClass('divBuscandoInformacion');
				}
			});
	
}
function maximizarListado(div)
{
	if ($('#' + div).hasClass('divPantallaCompleta')) {
		$('#' + div).removeClass('divPantallaCompleta');
		$('#divRef').addClass('opPosicionReferencias');
		$('#divRef').removeClass('opPosicionReferenciasFijo');
		$('#divTotalSeleccionadoGeneral').removeClass('opTotalSeleccionadoMax');		
		
	} else {
		$('#' + div).addClass('divPantallaCompleta');
		$('#divRef').removeClass('opPosicionReferencias');
		$('#divRef').addClass('opPosicionReferenciasFijo');
		$('#divTotalSeleccionadoGeneral').addClass('opTotalSeleccionadoMax');		
	}	
	
	
}

function cerrarDetalle(contenedor){
	$('#'+contenedor).html("");
}
function seleccionarFila(indiceS,indiceP){
	prvs = resultadoBusqueda['proveedores'];
	prv = prvs[indiceP];
	suc = prv['sucursales'];
	fila = suc[indiceS];
	if($('#chk'+fila['ordenId']).is(':checked')){
		ftr = 'tr'+fila['ordenId'];		
		$('#'+ftr).addClass("opDetalleFilaDeudaSel");
		ftr = '2tr'+fila['ordenId'];		
		$('#'+ftr).addClass("opDetalleFilaDeudaSel");		
	}else{
		ftr = 'tr'+fila['ordenId'];
		$('#'+ftr).removeClass("opDetalleFilaDeudaSel");
		ftr = '2tr'+fila['ordenId'];		
		$('#'+ftr).removeClass("opDetalleFilaDeudaSel");		
	}
	calcularTotalSeleccionado();
}
function calcularTotalSeleccionado(){
	proveedores = resultadoBusqueda['proveedores'];
	totalProveedores = resultadoBusqueda['totalProveedores'];
	total = 0;
	for(p=0;p<totalProveedores;p++){
		proveedor = proveedores[p];
		sucursales=proveedor['sucursales'];
		totalSucursales=proveedor['totalSucursales'];
		for(s=0;s<totalSucursales;s++){
			fila = sucursales[s];
			if (fila['estadoId']==2 || fila['estadoId']==3){
				if($('#chk'+fila['ordenId']).is(':checked')){
					if(parseFloat(fila['aPagar'])){
						total = total + parseFloat(fila['aPagar']);
					}
				}				
			}
		}
	}
	$('#divTotalSeleccionado').html(formatearPrecio(total));
	
}
function seleccionarTodosProveedor(indice){
	proveedores = resultadoBusqueda['proveedores'];
	proveedor = proveedores[indice];
	
	if($('#chkProveedor'+indice).is(':checked')){
		sel ='checked';
	}else{
		sel ='';
	}
	
	sucs=proveedor['sucursales'];
	tSucursales=proveedor['totalSucursales'];
	for(s2=0;s2<tSucursales;s2++){
		fila = sucs[s2];
		if (fila['estadoId']==2 || fila['estadoId']==3){
			$('#chk'+fila['ordenId']).prop('checked', sel);
			seleccionarFila(s2,indice);
		}
	}
	
}
function seleccionarTodo(){
	prvs = resultadoBusqueda['proveedores'];
	tProveedores = resultadoBusqueda['totalProveedores'];
	if($('#chkSeleccionarTodo').is(':checked')){
		sel ='checked';
	}else{
		sel ='';
	}			
	for(p2=0;p2<totalProveedores;p2++){
		$('#chkProveedor'+p2).prop('checked', sel);
		seleccionarTodosProveedor(p2);
	}
	
}
function textoAccion(texto){
	$('#divAcciones').html(texto);
}
function anularOrdenes(){
	if(confirm("Esta seguro que desea ANULAR las ordenes de pago?")){
		seleccion = obtenerSeleccion();
		if(!seleccion){
			alert('Debe seleccionar al menos una orden de pago.');
			return;
		}
	  $.ajax({
		  url: 'ajaxGenerarOrdenesDePagoAnular.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {
			     'ids': seleccion
			     },
		  success: function(resultado){
			  		res = $.parseJSON(resultado);
			  		if(res.error == 1){
			  			alert("ERROR: "+res.mensaje);
			  		}else{
			  			alert(res.mensaje);
			  			mostrarDatos();
			  			
			  		}
				},
			  error: function(){
					alert('Error al cargar los datos.') ;
					$('#idBotonBuscar').show();
					$('#reporteCompleto').removeClass('divBuscandoInformacion');
				}
			});		
	}
}

function obtenerSeleccion(){
	
	proveedores = resultadoBusqueda['proveedores'];
	totalProveedores = resultadoBusqueda['totalProveedores'];
	total = 0;
	ids = "";
	for(p=0;p<totalProveedores;p++){
		proveedor = proveedores[p];
		sucursales=proveedor['sucursales'];
		totalSucursales=proveedor['totalSucursales'];
		for(s=0;s<totalSucursales;s++){
			fila = sucursales[s];
			if (fila['estadoId']==2 || fila['estadoId']==3){
				if($('#chk'+fila['ordenId']).is(':checked')){
					ids = ids + ',' + fila['ordenId'];					
				}				
			}
		}
	}
	if (ids != ''){
		return ids + ',';
	}else{
		return false;
	}
	
	
}
function exportarPDF(){
	
	seleccion = obtenerSeleccion();
	if(!seleccion){
		alert('Debe seleccionar al menos una orden de pago.');
		return;
	}
  $.ajax({
	  url: 'pdfOPPagarExportar.php?token='+document.getElementById('mToken').value,
	  type: 'POST',
	  datatype :'json',
	  async: true,
	  data: {
		     'idsOrdenes': seleccion
		     },
	  success: function(resultado){
		  		res = $.parseJSON(resultado);
		  		if(res.error == 1){
		  			alert("ERROR: "+res.mensaje);
		  		}else{
		  			_.templateSettings.variable = "resultado";
					var template = _.template($( "#GenerarOPDetallePDF").html());
				    $( "#divPDFs" ).html(template(res));
				    $( "#divPDFs" ).show(1000);

		  			
		  		}
			},
		  error: function(){
				alert('Error al cargar los datos.') ;
				$('#idBotonBuscar').show();
				$('#reporteCompleto').removeClass('divBuscandoInformacion');
			}
		});
}
function pagarOrdenes(){
	if(confirm("Esta seguro que desea PAGAR las ordenes seleccionadas?")){
		seleccion = obtenerSeleccion();
		if(!seleccion){
			alert('Debe seleccionar al menos una orden de pago.');
			return;
		}
		  $.ajax({
			  url: 'ajaxGenerarOPPagar.php?token='+document.getElementById('mToken').value,
			  type: 'POST',
			  datatype :'json',
			  async: true,
			  data: {
				     'ids': seleccion
				     },
			  success: function(resultado){
				  		res = $.parseJSON(resultado);
				  		if(res.error == 1){
				  			alert(res.mensaje);
				  		}else{
				  			alert(res.mensaje);
				  			mostrarDatos();
				  			
				  		}
					},
				  error: function(){
						alert('Error al cargar los datos.') ;
						$('#idBotonBuscar').show();
						$('#reporteCompleto').removeClass('divBuscandoInformacion');
					}
				});		
	}
}