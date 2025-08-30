function calcularRenglon($i)
{
	
	cantidadSistema = $('input[name=inpCantidadSistema'+ $i +']').val();
	cantidadIngresada = $('input[name=inpCantidadRendida'+ $i +']').val();
	precioVenta = $('input[name=inpPrecio'+ $i +']').val();
	
	$('div[name=inpCantidadDiferencia'+ $i +']').html(cantidadIngresada - cantidadSistema);
	$('div[name=divDiferencia'+ $i +']').html(formatearPrecio((cantidadIngresada - cantidadSistema)*precioVenta));
	$('input[name=inpPrecioDiferencia'+ $i +']').val(formatearPrecio((cantidadIngresada - cantidadSistema)*precioVenta));
	$('div[name=divPrecioRendido'+ $i +']').html(formatearPrecio(precioVenta * cantidadIngresada));
	
	recalcularTotales();
}

function recalcularTotales()
{	
	//Total precio diferencia
	var total = 0;
    $("input[id=inpPrecioDiferencia]").each(function(){
        total=total+parseFloat($(this).val());
    });
    $("#totalPrecioDiferencia").html(formatearPrecio(total));
    
    //Total cantidad diferencia
    var total = 0;
    $("div[id=inpCantidadDiferencia]").each(function(){
        total=total+parseFloat($(this).html());
    });
    $("#totalCantidadDiferencia").html(formatearCantidad(total));    
    
    //Total importe rendido
    var totalpreciorendido = 0;
    $("div[id=divPrecioRendido]").each(function(){
    	totalpreciorendido=totalpreciorendido+parseFloat($(this).html());
    });
    $("#totalPrecioRendido").html(formatearPrecio(totalpreciorendido));
    $("#inpImporteRendido").val(formatearPrecio(totalpreciorendido));
    
    //Total cantidad rendido
    var total = 0;
    $("input[id=inpCantidadRendida]").each(function(){
        total=total+parseFloat($(this).val());
    });
    $("#totalCantidadRendida").html(formatearCantidad(total));
    
    //% deiferencia
    totalPrecioSistema = $("#totalPrecioSistema").html();
    if (parseFloat(totalPrecioSistema)==0)
    {
    	$("#porcentajeDiferencia").html("100.00");
    	$("#inpPorcentajeDiferencia").html("100.00");
    }else{
	    $("#porcentajeDiferencia").html(
	    			formatearPrecio( 
	    											((totalpreciorendido - totalPrecioSistema) * 100)/ totalPrecioSistema 
	    										 ) 
	    								);
	    $("#inpPorcentajeDiferencia").val(
	    		formatearPrecio( 
							((totalpreciorendido - totalPrecioSistema) * 100)/ totalPrecioSistema 
						 ) 
				);    
    
    }
}
function buscarArticulos()
{
	if ($('#inpSucursalId').val() == ""){
		alert('Debe seleccionar una sucursal');
		return;
	}
	if ($('#inpRubroId').val() == ""){
		alert('Debe seleccionar un rubro');
		return;
	}	
	action = $('#actionBuscar').val();
	$('#frm').attr('action',action);
	$("#frm" ).submit();	
}
function enviar(){
	if (parseInt($('#totalRegistros').val()) < 0){
		alert('No hay registros para exportar');
		return;
	}
	action = $('#actionGuardar').val();
	$('#frm').attr('action',action);
	$("#frm" ).submit();
	
	
}
function mostrarDetalles(rendicionId)
{
	$('#inpRendicionId').val(rendicionId);
	$('#frm').attr('action',$('#inpVerDetalle').val());
	$('#frm').submit();
}
function volverRendicion()
{
	$('#frm').attr('action',$('#actionVolver').val());
	$('#frm').submit();
	
}
function buscarRendicion()
{

	action = $('#actionBuscar').val();
	$('#frm').attr('action',action);
	$("#frm" ).submit();	
}
