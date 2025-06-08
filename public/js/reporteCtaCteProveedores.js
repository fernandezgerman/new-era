function cargarComprobante(comprobante,id,indice){	
	$('#divCargando'+indice).css("visibility", "visible");
	$('#divCargando'+indice).css("height","20px");
	
	if (comprobante=="FACTURA"){
		cargarDetalleFacturas(id,'divCargando'+indice,indice);
	}else{
		mostrarCargaPago(id,'divCargando'+indice,indice);
	}
	
}
function cerrarDetalleFactura(indice){
	$('#divCargando'+indice).html("");
	$('#divCargando'+indice).css("visibility", "hidden");
	$('#divCargando'+indice).css("height","1px");	
}
function mostrarCargaFacturas(resultado,div)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateDescripcionFactura" ).html()
        );
    $( "#"+div ).html(
            template( resultado )
        );    
} 

function mostrarCargaPagoDetalle(resultado,div)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templatePagoMostrarDetalle" ).html()
        );
    $( "#"+div ).html(
            template( resultado )
        );    
}
function mostrarDetalle(tipocomprobante,id){
	if (tipocomprobante=='PAGO'){
		mostrarCargaPago(id);
	}else{
		cargarDetalleFacturas(id);
	}
	
}
function mostrarCargaPago(idPago,div,indice)
{
 //grilla
	
	
	if (parseInt(idPago) > 0){
	  $.ajax({
		  url: 'ajaxReporteDetallePago.php?token='+$('#mToken').val(),
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {'inpPagoId':idPago,'indice':indice},
		  beforeSend: function(){
					  		
		  		},
		  success: function(resultado){
			  		
			  		res = eval("(" + resultado + ")");
			  		if (res.error==true)
			  		{
			  			alert('Error.');
			  		}else{
			  			
			  			mostrarCargaPagoDetalle(res,div);			  				
			  		}
				},
		  error: function(){
			  		res = {mensaje: "Surgi&oacute; un error al obtener las facturas del proveedor. P&aacute;gina inexistente. Comun&iacute;quese con el administrador del sitio"};
				},
		  
			});	
	}else{
  		res = {mensaje: "Debe seleccionar una factura de compra."};
	}
}
function cargarDetalleFacturas(idCompra,div,indice)
{
 //grilla
	
	
	if (parseInt(idCompra) > 0){
	  $.ajax({
		  url: 'ajaxReporteDetalleCompra.php?token='+$('#mToken').val(),
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {'inpCompraId':idCompra,'indice':indice},
		  beforeSend: function(){
			  		/*res = {mensaje: "Cargando las facturas pendientes de pago, aguarde por favor."};
			  		mostrarErrorCargaFacturas(res);*/						  		
		  		},
		  success: function(resultado){
			  		
			  		res = eval("(" + resultado + ")");
			  		if (res.error==true)
			  		{
			  			alert('Error.');
			  		}else{
			  			facturas = res.facturas;
			  			mostrarCargaFacturas(res,div);
				  			
			  			
			  		}
				},
		  error: function(){
			  		res = {mensaje: "Surgi&oacute; un error al obtener las facturas del proveedor. P&aacute;gina inexistente. Comun&iacute;quese con el administrador del sitio"};
			  		mostrarErrorCargaFacturas(res);
				},
		  
			});	
	}else{
  		res = {mensaje: "Debe seleccionar una factura de compra."};
	}
}