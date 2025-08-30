var comprasDudosas = Array();

function icdBuscarInfo($div,$iddetalle)
{	
	$('#'.$div).addClass('divBuscandoInformacion');
  $.ajax({
	  url: 'ajaxComprasDudosasLista.php?token='+document.getElementById('mToken').value,
	  type: 'POST',
	  datatype :'json',
	  async: true,
	  data: {
		  	 'idCompraDetalle':$iddetalle,
		     'contenedor':$div,
		     'todos':1,
		     'fechaDesde': '01/01/2000',
		     'fechaHasta': '01/01/2050'		     
		     },
	  success: function(resultado){
		  		comprasDudosas = $.parseJSON(resultado);
		  		
		  		mostrarDescripcionExtra(comprasDudosas['contenedor']);
		  		$('#'+comprasDudosas['contenedor']).removeClass('divBuscandoInformacion');
			},
		  error: function(){
				alert('Error al cargar los datos.') ;
			}
		});
}
function mostrarDescripcionExtra($div){
	filas = comprasDudosas['compras'];
	fila = filas[0];
	fila['contenedor'] = $div;
	_.templateSettings.variable = "fila";
	fila['ocultarUltimas60Compras'] = 1;

    if (fila['idcompradetallecomparacion']) {
        var template = _.template($("#templateComprasDudosasSingularNuevo").html());
    } else{

        var template = _.template($("#templateComprasDudosasSingular").html());
    }

//	var template = _.template($("#templateComprasDudosasSingular").html());
	$("#"+$div).html(template(fila));
	$("#fila"+$div).css({"display":"table-row"});
	
	
}
function cerrarDetalleDeCompras(div){
	$("#"+div).html("");
	$("#fila"+div).css({"display":"none"});
}
function editarCompra(compraId){
	$('#idCompra').val(compraId);
	document.getElementById('frmEditar').submit();
}