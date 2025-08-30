var contenedorFiltros = Array();
var contenedorDeResultados = Array();
var compraEdicionId = 0; 



function mostrarDetalleCompra(div,idcompra){
	compraEdicionId = idcompra;
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

function cerrarCompra(div){
	$('#'+div).html("");
}
function modificoCantidad(indice)
{	
	autoFormatearCantidad("inpCantidad"+indice);
	autoFormatearPrecio("inpTotalLinea"+indice);
	cantidad = parseFloat($("#inpCantidad"+indice).val());
	totalLinea = parseFloat($("#inpTotalLinea"+indice).val());
	
	$("#inpUnitario"+indice).val(formatearPrecio(totalLinea/cantidad));
	$("#divPrecioUnitario"+indice).html("($"+formatearPrecio(totalLinea/cantidad) +")");	
	
	dif = diferenciaConTotal();
	
	if(Math.abs(dif)> 1) {
		$("#divDiferencia").html("($"+formatearPrecio(dif)+")");
	}else{
		$("#divDiferencia").html("");
	}
	
}

function diferenciaConTotal(){
	totalArticulos = parseFloat($('#totalArticulos').val() );
	
	total = 0;
	for(a = 0; a < totalArticulos; a++){
		cantidad = $("#inpCantidad"+a).val();
		unitario = $("#inpUnitario"+a).val();
		if(!isNaN(cantidad * unitario)){
			total = total + (cantidad * unitario);
		}
	}
	
	totalLineas = parseFloat($("#totalLineas").val());
	
	return (totalLineas - total);
}
function guardar(){

	dif =Math.abs(diferenciaConTotal());
	if(dif > 1){
		alert("La diferencia con el total no puede ser mayor a uno.");
		return;
	}
	
	alert('Atencion: Este proceso pueder tardar varios minutos.');
	arts=Array();
	for(a = 0; a < totalArticulos; a++){
		
		
		cantidad = $("#inpCantidad"+a).val();
		unitario = $("#inpUnitario"+a).val();
		inpCompraDetalleId = $("#inpCompraDetalleId"+a).val();
		
		art = {
			'cantidad':cantidad,
			'unitario': unitario,
			'id': inpCompraDetalleId
		}
				
		arts[a] = art;

	}	
	
	datos={
		'articulos': JSON.stringify(arts),
		'fechaEmision': $('#inpEmisionFecha').val(),
		'proveedorId':$('#inpProveedorId').val(),
		'numero':$('#inpFacturaNumero').val(),
		'observaciones':$('#inpObservaciones').val(),
		'compraId':compraEdicionId
	}
    $('.cbContenedorGralBordeado').addClass('divBuscandoInformacion');
    $('#divAguarde').css({'display':'block'});

	$("#divBotonGuardar").html("<span style='color:black;background-color:gold;'>GUARDANDO...</span>");
	cargarAjaxGenericoJson('ajaxEdicionDeComprasGuardar.php',datos,'resultado','edicionComprasResultadoGuardarTemplate','divBotonGuardar','','terminoDeGuardar()');
}
function terminoDeGuardar(){
	alert('Terminado.');
    $('#divAguarde').css({'display':'none'});
    $('.cbContenedorGralBordeado').removeClass('divBuscandoInformacion');

}