window.onbeforeunload = preguntarAntesDeSalir; 
var articulosSeleccionados = new Array();
var articuloSeleccionado = false;
function enviar(){
	if (datosValidos()){
		bPreguntar = false;
		document.getElementById('frm').submit();
	}
}
$(document).ready(function(){
		//cargarFacturasPendientes();
	cancelarAgregarArticulo();
	mostrarListaArticulos();
});
function cancelarAgregarArticulo(){
	//_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateCancelarAgregarArticulo" ).html()
        );
    $( "#divAgregarArticulo" ).html(
            template()
        );   	
}
function agregarArticulo(){
	//_.templateSettings.variable = "resultado";
	
    var template = _.template(
           $( "#templateArticulosAgregar" ).html()
        );
    $( "#divAgregarArticulo" ).html(
            template()
        );   	
    $("#inpAgregarArticuloCodigo").focus();
}
function mostrarListaArticulos(){
	_.templateSettings.variable = "articulosSeleccionados";
	
    var template = _.template(
           $( "#templateArticulosPlural" ).html()
        );
    $( "#divListadoArticulos" ).html(
            template(articulosSeleccionados)
        );   	
}

function aceptarArticulo()
{
	if ($("#inpSucursalOrigen").val()=="0"){
		alert("Debe ingresar la sucursal de origen de la marcaderia");
		return;
	}
	$("#descripcionArticulo").html("Ingrese un codigo de articulo");
	$("#imgAguardeCompra").css("display", "block");
	articuloSeleccionado = false;
	$.ajax({
		
		url : 'obtenerArticulosJson.php?token='+document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'inpCodigo':$("#inpAgregarArticuloCodigo").val(),
				'inpSucursalId': $("#inpSucursalOrigen").val(),
				'detallePrecios':0,
				'detalleExistencia':1,
				'costoNuevo': 0
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.error) {
				if (json.errorTipo == "no_hay_articulo")
				{
					alert("El articulo no existe, esta inactivo o no fue configurada la lista de precios.");
				}else{
					alert(json.errorDescripcion);
				/*	$('#inpSeleccionarCompraCodigo').val("");
					$('#inpCantidad').val("");
					$("#divLabelNombreArticuloTitulo").css("display", "none");
					$("#divLabelNombreArticulo").css("display", "none");
					$("#divLabelCostoAnteriorTitulo").css("display", "none");
					$("#divLabelCostoAnterior").css("display", "none");*/
				}
				//alert('sdfasd');
			} else {
				articuloSeleccionado = json;
				$("#descripcionArticulo").html(json.descripcion + " (EX: " + json.existencia + ")");
			}
			$("#imgAguardeCompra").css("display", "none");
		},
		error : function() {
			alert('Error al obtener la compra. Pagina inexistente');
			$("#imgAguardeCompra").css("display", "none");
		}	
	});	
}
function validarAgregarArticulo()
{
	if (articuloSeleccionado == false)
	{
		alert('Debe ingresar un articulo valido');
		return false;
	}
	if ($("#inpAgregarArticuloCantidad").val()==""||parseInt($("#inpAgregarArticuloCantidad").val()) <= 0 )
	{
		alert('Debe ingresar una cantidad mayor a cero');
		return false;
	}	
	return true;
}
function aceptarAgregarArticulo()
{
	if (validarAgregarArticulo()==false){
		return;
	}
	$fila = Array();
	$fila['articulo'] = articuloSeleccionado;
	$fila['cantidad'] = $("#inpAgregarArticuloCantidad").val();
	articulosSeleccionados[articulosSeleccionados.length] = $fila;
	mostrarListaArticulos();
	cancelarAgregarArticulo();
	$("#agregarArticuloLista").focus();
}
function eliminarArticulosSeleccionados()
{
	$arrAux = Array();
	for(i=0;i<articulosSeleccionados.length;i++){
		if (!$('#inpEliminarRenglon'+i).is(':checked')){
			$arrAux[$arrAux.length] = articulosSeleccionados[i]; 
		}
	}
	articulosSeleccionados = $arrAux;
	mostrarListaArticulos();
}
function cargarUsuariosAutorizadores()
{
	$.ajax({
		url : 'ajaxUsuariosSucursal.php?token='+$('#token').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'inpSucursalId1':$("#inpSucursalOrigen").val(),
				'inpSucursalId2': $("#inpSucursalDestino").val()
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.error) {
				alert("Error al cargar los usuarios que autorizan.");
			} else {
				var miselect=$("#inpUsuarioAutorizaId");
				miselect.find('option').remove().end().append('').val('');
				/* VACIAMOS EL SELECT Y PONEMOS UNA OPCION QUE DIGA CARGANDO... */
				
				miselect.append("<option value=\"0\">Seleccione...</option>");
				$.each(json, function(k,v){
					miselect.append("<option value=\""+k+"\">"+v+"</option>");
		        });
			}
		},
		error : function() {
			alert('Error al obtener los usuarios.');
			
		}	
	});		
}
function cargarUsuariosQueReciben()
{
	$.ajax({
		url : 'ajaxUsuariosSucursal.php?token='+$('#token').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'inpSucursalId1':'',
				'inpSucursalId2': $("#inpSucursalDestino").val()
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.error) {
				alert("Error al cargar los usuarios que reciben.");
			} else {
				var miselect=$("#inpUsuarioRecibeId");
				miselect.find('option').remove().end().append('').val('');
				/* VACIAMOS EL SELECT Y PONEMOS UNA OPCION QUE DIGA CARGANDO... */
				
				miselect.append("<option value=\"0\">Seleccione...</option>");
				$.each(json, function(k,v){
					miselect.append("<option value=\""+k+"\">"+v+"</option>");
		        });
			}
		},
		error : function() {
			alert('Error al obtener los usuarios.');
		}	
	});		
}
function validarDatos()
{
	if ($('#inpSucursalOrigen').val()==0)
	{
		alert('Debe seleccionar una sucursal de origen de la mercaderia.');
		return false;
	}
	if ($('#inpSucursalDestino').val()==0)
	{
		alert('Debe seleccionar una sucursal destino de la mercaderia.');
		return false;
	}
	if ($('#inpSucursalDestino').val()==$('#inpSucursalOrigen').val()){
		alert('La sucursal origen no puede ser la misma que la sucursal de destino.');
		return false;		
	}
	if ($('#inpMotivo').val()==0||$('#inpMotivo').val()=="")
	{
		alert('Debe seleccionar un motivo de movimiento de la transferencia.');
		return false;
	}	
	if (articulosSeleccionados.length==0)
	{
		alert('Debe ingresar al menos un articulo a enviar.');
		return false;
	}
	if ($('#inpUsuarioAutorizaId').val()==0 || $('#inpUsuarioAutorizaId').val()==""){
		alert('Debe seleccionar un usuario para autorizar la transferencia.');
		return false;		
	}
	if ($('#inpUsuarioRecibeId').val()==0 || $('#inpUsuarioRecibeId').val()==""){
		alert('Debe seleccionar un usuario para recibir la transferencia.');
		return false;		
	}	
	return true;
}
function guardarTransferencia(){
	if (!validarDatos()){
		return;
	}
	bPreguntar = false;
	document.getElementById('frm').submit();	
}