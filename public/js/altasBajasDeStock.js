
var articulosBaja = Array();
var articuloSeleccionado = false;
function enterEnCodigoArticuloDetalle(e) {
	if (validateEnter(e)) {
		aceptarArticulo();
	}
}

function guardarMovimientosDeStock() {
	if (datosValidos()) {
		$("#frmMovimientosDeStock").submit();
	}
}
function presionaTeclaEnCodigo(tecla){
    if (tecla.keyCode == 113) { 
    	abrirBuscador('inpSeleccionarCompraCodigo','articulos');
    }
	
}

function mostrarArticulos()
{ 
	_.templateSettings.variable = "art";	
    var template = _.template(
            $( "#templateStockPlural" ).html()
        );
    $( "#divDetalle" ).html(
            template( articulosBaja )
        );    
} 
function mostrarAgregarArticulo()
{ 
	_.templateSettings.variable = "motivos";
    var template = _.template(
            $( "#templateStockAdd" ).html()
        );
    $( "#divDetalle" ).html(
            template(motivos )
        );    
    $( "#inpABMStockCodigoArticulo" ).focus();
    
}
function aceptarAgregarArticulo()
{	
	
	if (articuloSeleccionado == false || !articuloSeleccionado){
		alert('Debe ingresar un codigo de articulo');
		return false;
	}
	if (!(parseInt($("#inpCantidad").val())> 0)){
		alert('Debe ingresar una cantidad mayor a cero');
		return false;
	}	
	if ((parseInt($("#inpMotivoMovimientoStockId").val())== 0)){
		alert('Debe seleccionar un motivo de movimiento.');
		return false;
	}		
	
	fila = new Array();
	indice = parseInt($("#inpMotivoMovimientoStockId").val()) - 1;
	fila.codigo = articuloSeleccionado.codigo ;
	fila.id = articuloSeleccionado.id;
	fila.descripcion = articuloSeleccionado.descripcion;
	fila.cantidad = parseInt($("#inpCantidad").val());
	fila.idMotivo = motivos[indice].id;
	fila.descripcionMotivo = motivos[indice].nombre;
	articulosBaja[articulosBaja.length]=fila;
	mostrarArticulos();
	
	
	$( "#btnAgregarArticulo" ).focus();
	return true;
}
function eliminarArticulo()
{
	indice = $('input[name=inpListaArticuloSel]')
	.filter(':checked').val();
	arrAux = new Array();
	var i2 = 0;
	for(i=0; i < articulosBaja.length; i++)
	{
		if (i != indice){
			arrAux[i2] = articulosBaja[i];
			i2= i2+1;
		}
	}
	articulosBaja = arrAux;
	mostrarArticulos();
	
}
function mostrarDescripcionArticulo()
{
		return true;
}
function presionaTeclaEnCodigo(tecla){
    if (tecla.keyCode == 113) { 
    	abrirBuscador('inpABMStockCodigoArticulo','articulos');
    }
	
}
/* codigo que se ejecuta despues de aceptar un articulo en el buscador*/
function aceptarArticulo()
{
	
	var codigo = $('#inpABMStockCodigoArticulo').val();
	
	if (codigo==""){
		articuloSeleccionado = false;
		$("#divLabelNombreArticulo").css("display", "none");
		return;
	}
	
	if (articuloSeleccionado){
		if (articuloSeleccionado!=false){
			if (articuloSeleccionado.codigo ==codigo ){
				return true;
			}
		}
		
	}
	
	$("#imgAguardeCompra").css("display", "block");
	$.ajax({
		url : 'obtenerArticulosJson.php?token='+document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'inpCodigo':codigo,
				'detallePrecios':0
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.error) {
				articuloSeleccionado = false;
				$('#inpABMStockCodigoArticulo').val("");
				if (json.errorTipo == "no_hay_articulo")
				{
					alert("El articulo no existe, esta inactivo o no fue configurada la lista de precios.");
					$("#divLabelNombreArticulo").css("display", "none");
				}else{
					alert(json.errorDescripcion);
					$("#divLabelNombreArticulo").css("display", "none");
				}
				//alert('sdfasd');
			} else {		
				articuloSeleccionado = json;
				$("#divLabelNombreArticulo").css("display", "block");
				$("#divLabelNombreArticulo").html(articuloSeleccionado.descripcion)
				
			}
			$("#imgAguardeCompra").css("display", "none");
			$( "#inpMotivoMovimientoStockId" ).focus();
		},
		error : function() {
			alert('Pagina inexistente');
			$("#imgAguardeCompra").css("display", "none");
		}	
	});	
}
function datosValidos()
{
	if (parseInt($("#inpSucursalId").val()) == 0)
	{
		alert('Debe seleccionar una sucursal');
		return false;
	}
	if (parseInt($("#inpUsuarioId").val()) == 0)
	{
		alert('Debe seleccionar un usuario');
		return false;
	}	
	if ($("#inpFechamovimiento").val() == "")
	{
		alert('Debe ingresar una fecha.');
		return false;
	}	
	if (articulosBaja.length == 0){
		alert('Debe ingresar al menos un articulo de baja.');
		return false;		
	}
	return true;
}