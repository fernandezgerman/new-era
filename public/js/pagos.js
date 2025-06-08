window.onbeforeunload = preguntarAntesDeSalir;
function enviar(){
	if (datosValidos()){
		bPreguntar = false;
		document.getElementById('frm').submit();
	}
}
function mostrarErrorCargaFacturas(resultado)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templatePagosErrorCargaFacturas" ).html()
        );
    $( "#divFacturasPendientes" ).html(
            template( resultado )
        );    
}   
function mostraCargaFacturas(resultado)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templatePagosCargarFacturas" ).html()
        );
    $( "#divFacturasPendientes" ).html(
            template( resultado )
        );    
}   
	
function cargarFacturasPendientes()
{
 //grilla
	var idProveedor = $('#inpProveedorId').val();
	var idSucursalCtaCte = $('#inpSucursalCtaCte').val();
	if (parseInt(idSucursalCtaCte)==0){
		alert('Seleccione una sucursal');
		return false;
	}
	
	borrarTotales();
	if (parseInt(idProveedor) > 0){
	  $.ajax({
		  url: 'ajaxExtractoProveedores.php?token='+$('#mToken').val(),
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {'idProveedor':idProveedor,'idSucursalCtaCte':idSucursalCtaCte},
		  beforeSend: function(){
			  		res = {mensaje: "Cargando las facturas pendientes de pago, aguarde por favor."};
			  		mostrarErrorCargaFacturas(res);						  		
		  		},
		  success: function(resultado){	  		
			  		//res = eval("(" + resultado+ ")");
			  		resu = $.parseJSON(resultado);

			  		
			  		if (resu.error==true)
			  		{
			  			mostrarErrorCargaFacturas(resu);
			  			totalIngresadoEnDetalle();
			  		}else{
			  			facturas = resu.facturas;
			  			if (facturas){
			  				$("#totalSaldoActual").html(resu.saldo);
			  				mostrarSaldoFinal();
			  				mostraCargaFacturas(resu);
			  			}else{
			  				resu = {mensaje: "No se encontr&oacute; ninguna factura pendiente de pago para el proveedor "+$('#inpProveedorId option:selected').text()};
					  		mostrarErrorCargaFacturas(resu);			  				
			  			}
			  				
			  		}
				},
		  error: function(){
			  		res = {mensaje: "Surgi&oacute; un error al obtener las facturas del proveedor. P&aacute;gina inexistente. Comun&iacute;quese con el administrador del sitio"};
			  		mostrarErrorCargaFacturas(res);
				},
		  
			});	
	}else{
  		res = {mensaje: "Debe seleccionar un proveedor para realizar el pago."};
  		mostrarErrorCargaFacturas(res);
	}
}
function borrarTotales()
{
	$("#totalSaldoActual").html("0.00");
	$("#totalPago").html("0.00");
	$("#totalSaldoFinal").html("0.00");		
}
function mostrarSaldoFinal()
{
	var totalPago = parseFloat($("#inpTotalPago").val());
	var saldoActual = parseFloat($("#totalSaldoActual").html());
	$("#totalPago").html(formatearPrecio(totalPago));
	
	var saldoFinal = saldoActual + totalPago;
	
	$("#totalSaldoFinal").html(formatearPrecio(saldoFinal));
	
}
function pagoTotalDeFactura(indice)
{
	if ($('[name="inpAsignadoTodo'+indice+'"]').is(':checked'))
	{
		var valor = parseFloat($('[name="inpAsignadoFaltante'+indice+'"]').val() );
		$('[name="inpAsignado'+indice+'"]').val(formatearPrecio(valor));
	}else{
		$('[name="inpAsignado'+indice+'"]').val(formatearPrecio(0));
	}
}
function totalIngresadoEnDetalle()
{
	var totalAsignado = 0;
    $("input[id=inpAsignado]").each(function(){
    	totalAsignado = totalAsignado + parseFloat($(this).val());
    });
    
    $("#totalAsignado").html(formatearPrecio(totalAsignado));
    
    
	var totalFaltante = 0;
    $("input[id=inpAsignadoFaltante]").each(function(){
    	totalFaltante = totalFaltante + parseFloat($(this).val());
    });    
    
    var totalPago = parseFloat($("#inpTotalPago").val());
    $("#totalDisponible").html(formatearPrecio(totalPago - totalAsignado));

}
function datosValidos()
{
	if ($("#inpNumero").val() == "")
	{
		alert("Debe ingresar un numero de recibo.");
		return false;
	}
	if ($("#inpFechaEmision").val() == "")
	{
		alert("Debe ingresar una fecha de pago.");
		return false;
	}	
	if ($("#inpTotalPago").val() == "")
	{
		alert("Debe ingresar un importe del pago.");
		return false;
	}		
	if ($("#inpProveedorId").val() == "0")
	{
		alert("Debe seleccionar un proveedor.");
		return false;
	}			
	
		
	var cantidadFacturas = $("#totalFacturas").val();
	var total= 0 ;
	for (i =0; i < cantidadFacturas; i++)
	{
		ingresado = parseFloat($('[name="inpAsignado'+i+'"]').val());
		if (ingresado != 0 ){
			faltante = parseFloat($('[name="inpAsignadoFaltante'+i+'"]').val());
			if(isNaN(ingresado)){
				ingresado = 0;
			}
			if(isNaN(faltante)){
				faltante = 0;
			}
			total = parseFloat(parseFloat(total) + parseFloat(ingresado) );

			
			
			total =  total.toFixed(2);
			
			if (valorAbsouluto(ingresado) > valorAbsouluto(faltante))
			{
				alert('No puede asignar mas dinero del que debe por factura.')
				return false;
			}
			if ((faltante < 0) && (ingresado > 0))
			{
				alert('Debe ingresar el valor en negativo para las notas de credito.')
				return false;				
			}  
		}
		
	}
	if (parseInt(total * 100) != parseInt($("#inpTotalPago").val() * 100))
	{
		alert('El total del pago no coincide con el total detallado en las facturas.');
		
		return false;
	}
	return true;
}
$(document).ready(function(){
	if ($("#inpProveedorId").val() != "0")
	{
		cargarFacturasPendientes();
	}
});
