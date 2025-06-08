var procesando = false;
function mostrarDetalle(id){
	$('[id^=lineaDetalle'+id+'-]').show(500);
}
function cerrarDetalle(id){
	$('[id^=lineaDetalle'+id+'-]').hide(500);
}

$(document).ready(function(){
	mostrarResultados('nada');
});

function mostrarResultados(resultado)
{ 
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateAnularCompraPlural" ).html()
        );
    $( "#divResultado" ).html(
            template(resultado)
        );    
} 
function sucursales(){
	total = parseInt($("#inpTotalSucursales").val());
	sucs = ",";
	
	for (i =0; i < total; i++)
	{
		if ($("#suc"+i).is(':checked'))
		{
			sucs = sucs+$("#suc"+i).val()+",";
		}
	}
	if (sucs == ","){
		sucs = "";
	}
	return sucs;
}
function buscarFacturas()
{
	if(procesando ){
		alert('Aguarde!');
		return;
	};
	if($('#inpEsRubroGastos').is(':checked')){
		gastos = 1;
	}else{
		gastos = 0;
	}
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$.ajax({
		url : 'ajaxAnulacionComprasLista.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'inpUsuarioId':$('#inpUsuarioId').val(),
				'inpProveedorId':$('#inpProveedorId').val(),
				'inpFechaDesde':$('#inpFechaDesde').val(),
				'inpFechaHasta':$('#inpFechaHasta').val(),
				'esRubroGastos': gastos,
				'sucursales':sucursales()
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.error == 0){
				
				mostrarResultados(json);
				
			}else{
				
				alert(json.mensaje);
				 $( "#divResultado" ).html(
				            ""
				        );    
				
			}
			$('#reporteCompleto').removeClass('divBuscandoInformacion');
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});

}
function anularFactura(idcompraAnula){
	if (confirm('Esta seguro que desea anular la factura??.')) {

		anulacionDeCompras(idcompraAnula);
	}	
}
function anulacionDeCompras(idCompra)
{
	procesando = true;

	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	$('#divResultado').html('<img src="css/images/aguarde.gif" style="width:200px;margin-left:200px;"/>');
	$.ajax({
		url : 'ajaxAnulacionComprasAnular.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'idCompra':idCompra
				 },
		success : function(resultado) {
			procesando = false;
			json = $.parseJSON(resultado);
			
			if (json.error == 0){
				alert(json.mensaje);
				buscarFacturas();
			}else{
				alert(json.mensaje)
				$('#divResultado').html('');
				$('#reporteCompleto').removeClass('divBuscandoInformacion');
			}
			
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});

}
