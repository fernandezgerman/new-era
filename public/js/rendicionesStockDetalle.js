var articulosPendientes = new Array();
var articulosIngresados = new Array();
var articuloSeleccionado = false;

$(document).ready(function(){
	cargarJson();
	mostrarArticulosPendientes();
	mostrarArticulosRendidos();
	$("#divMensajeAtencion").css("display", "none");
});
function checkArticulosPendientesDeImpacto(){
	$("#divMensajeAtencion").css("display", "none");
	for(i=0;i<articulosIngresados.length;i++){
		objeto = articulosIngresados[i];
		if (!objeto.id){
			$("#divMensajeAtencion").css("display", "block");
		}
	}
	
}
function mostrarArticulosPendientes(){
	_.templateSettings.variable = "articulosPendientes";
	
    var template = _.template(
            $( "#templateArticulosPendientes" ).html()
        );
    $( "#divArticulosPendientes" ).html(
            template(articulosPendientes)
        );   	
}
function mostrarArticulosRendidos(){
	_.templateSettings.variable = "articulosIngresados";
	
    var template = _.template(
            $( "#templateArticulosRendidos" ).html()
        );
    $( "#divArticulosRendidos" ).html(
            template(articulosIngresados)
        );   	
}
function getFinalizar()
{
	if ( articulosPendientes.length == 0){
		return 1
	}else{
		return 0;
	}
}

function aceptarArticulo()
{
	var codigo = $('#inpCodigoArticulo').val();
	if(codigo==""){
		$('#descripcionArticulo').html('Ingrese un codigo');
		
		$('#inpCodigoArticulo').val('');
		return;
	}
	
	articuloSeleccionado = false;
	for(i=0;i<articulosPendientes.length;i++){
		objeto = articulosPendientes[i];
		if (objeto.codigo == codigo){
			articuloSeleccionado = objeto;
		}  
	}
	if(!articuloSeleccionado){
		alert('El articulo no se encuentra en la lista de pendientes');
		$('#descripcionArticulo').html('Ingrese un codigo');
		
		$('#inpCodigoArticulo').val('');
		$('#inpCodigoArticulo').focus();		
	}else{
		$('#descripcionArticulo').html(articuloSeleccionado.articulo);		
		
		$('#inpCantidad').removeAttr("disabled");
		$('#btnRendirArticulo').removeAttr("disabled");
		$('#inpCantidad').val("");
		$('#inpCantidad').focus();		
	}
}
function rendirArticuloValido(){
	if (articuloSeleccionado==false){
		alert('Debe seleccionar un articulo');
		return false;
	}
	if ($('#inpCantidad').val()==""){
		alert('Debe ingresar una cantidad');
		return false;
	}
	if (parseFloat($('#inpCantidad').val())>10000){
		alert('La cantidad no puede ser mayor a 10000 unidades.');
		return false;
	}	
	
	return true;
}
function rendirArticulo(){
	if (!rendirArticuloValido()){
		return ;
	}
	var cantidad = $('#inpCantidad').val();
	
	envioAjaxDeRendicion(cantidad,articuloSeleccionado);
	sigArticulo = actualizarArreglosPendientes(articuloSeleccionado.idarticulo);
	
	agregarArticuloParaRendir(sigArticulo);
	
}
function envioAjaxDeRendicion(cantidad,articuloSel){
	var rendicionId = $('#inpRendicionId').val();
	var token = $('#inpToken').val();
	idart = articuloSel.idarticulo;
	precioArticulo = articuloSel.precio;

	if (!(articulosPendientes.length > 0)){
		$('#divDescripcionEstado').html("Finalizado");
		$('#inpCodigoArticulo').val("");
		$('#inpCantidad').val("");
	    $('#inpCodigoArticulo').attr("disabled","disabled");
	    $('#inpCantidad').attr("disabled","disabled");
	    $('#btnRendirArticulo').attr("disabled","disabled");
	}
	$("#divMensajeAtencion").css("display", "block");
	$.ajax({
		url : 'rendicionesStockArticulosGuardarJson.php?token='+token,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'idarticulo': idart,
				'idrendicion': rendicionId,
				'cantidad': cantidad,
				'precio': precioArticulo,
				'token':token,
				'finalizar':getFinalizar()
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.resultado=='ERROR') {
				alert(json.mensaje);
				$('#descripcionArticulo').html('Ingrese un codigo');
				$('#inpCodigoArticulo').val('');
				$('#inpCodigoArticulo').focus();
			} else {
				actualizarArreglosRendidos(json.idarticulo ,json.cantidadsistema,json.cantidadrendida,json.idrendicion,json.hora);
			}	
			checkArticulosPendientesDeImpacto();
		},
		error : function() {
			alert('Error al establecer la rendicion!!!');		
		}	
	});	
}
function buscarSiguienteArticulo(idarticulo)
{
	arrAux = new Array();
	
	selArt = 0;
	for(i=0;i<articulosPendientes.length;i++){
		objeto = articulosPendientes[i];
		if (objeto.idarticulo == idarticulo){
			sig = 1;
		}  else {
			if (sig == 1){
				return i;
			}
		}
	}
	return 'nada';
}
function actualizarArreglosPendientes(idarticulo){
	arrAux = new Array();
	artSiguiente = 'nada';
	selArt = 0;
	for(i=0;i<articulosPendientes.length;i++){
		objeto = articulosPendientes[i];
		if (objeto.idarticulo != idarticulo){
			arrAux[arrAux.length] = objeto;
			if (selArt == 0){
				selArt = 1;
				
				artSiguiente = arrAux.length - 1;
			}
		}  else {
			art = objeto;
		}
	}
	articulosPendientes = arrAux;
	
	articulosIngresados[articulosIngresados.length] =art;
	mostrarArticulosPendientes();
	mostrarArticulosRendidos();
	return artSiguiente;
}
function actualizarArreglosRendidos(idarticulo,cantidadsistema,cantidadrendida,idrendicion,hora){
	var indice;
	for(i=0;i<articulosIngresados.length;i++){
		objeto = articulosIngresados[i];
		if (objeto.idarticulo== idarticulo){
			indice = i;
			art = objeto;
			if (parseInt(art['id'])>0){ //Es una correccion
				
				art = $.extend(true, {}, objeto);
				indice = indice + 1; 
				articulosIngresados.splice(indice,0 ,art);
			}
			break;
		}
	}
		
	art['cantidadsistema'] = cantidadsistema;
	art['cantidadrendida'] = cantidadrendida;
	art['id'] = json.idrendicion;
	art['hora'] = hora;
	art['valorsistema'] = formatearPrecio( parseFloat(cantidadsistema) * parseFloat(art.precio));
	art['valorrendido'] = formatearPrecio(parseFloat(cantidadrendida) * parseFloat(art.precio));
	art['valordiferencia'] = formatearPrecio(parseFloat(art['valorrendido']) - parseFloat(art['valorsistema']));
	
	articulosIngresados[indice] =art;
	
	 
	mostrarArticulosRendidos();
	
	//return artSiguiente;
}
function agregarArticuloParaRendir(indice){
	$('#inpCodigoArticulo').val(articulosPendientes[indice].codigo);
	aceptarArticulo();
	$('#inpCantidad').focus();
	
}
function enterCantidad(e){
	if (presionaEnter(e)) {
		rendirArticulo();
	}	
}
function focoEnLinea(i,clase){
	$('#filaNumero'+i).addClass('tblFilaVerdeNegrita');
	$('#filaNumero'+i).removeClass(clase);
}
function pierdeFocoLinea(i,clase){
	$('#filaNumero'+i).removeClass('tblFilaVerdeNegrita');
	$('#filaNumero'+i).addClass(clase);
}
function rendirArticuloLinea(indice){
	if ($('#inpCantidadLinea'+indice).val()==""){
		alert('Ingrese una cantidad ');
		return false;
	}
	if (parseFloat($('#inpCantidadLinea'+indice).val())>10000){
		alert('La cantidad no puede ser mayor a 10000 unidades.');
		return false;
	}		
	var cantidad = $('#inpCantidadLinea'+indice).val();
	
	objarticulo = articulosPendientes[indice];

	actualizarArreglosPendientes(objarticulo.idarticulo);
	
	envioAjaxDeRendicion(cantidad,objarticulo);
	
	if (articulosPendientes.length > 0){
		if (indice < articulosPendientes.length) {
			$('#inpCantidadLinea'+indice).focus()
		}else{
			$('#inpCantidadLinea'+(indice-1)).focus()
		}
	}
		
}
function enterCantidadIndice(e,indice){
	if (presionaEnter(e)) {
		rendirArticuloLinea(indice);
	}	
}

function focoEnLineaRendido(i,clase){
	$('#filaRendidosNumero'+i).addClass('tblFilaAzulNegrita');
	$('#filaRendidosNumero'+i).removeClass(clase);
}
function pierdeFocoLineaRendido(i,clase){
	$('#filaRendidosNumero'+i).removeClass('tblFilaAzulNegrita');
	$('#filaRendidosNumero'+i).addClass(clase);
}

function corregirArticuloLinea(indice){
	if ($('#inpCantidadLineaCorregir'+indice).val()==""){
		alert('Ingrese una cantidad ');
		return false;
	}
	if (parseFloat($('#inpCantidadLineaCorregir'+indice).val())>10000){
		alert('La cantidad no puede ser mayor a 10000 unidades.');
		return false;
	}		
	var cantidad = $('#inpCantidadLineaCorregir'+indice).val();
	
	objarticulo = articulosIngresados[indice];

	//actualizarArreglosPendientes(objarticulo.idarticulo);
	
	envioAjaxDeRendicion(cantidad,objarticulo);
	/*
	if (articulosPendientes.length > 0){
		if (indice < articulosPendientes.length) {
			$('#inpCantidadLinea'+indice).focus()
		}else{
			$('#inpCantidadLinea'+(indice-1)).focus()
		}
	}
	*/
}

function enterCantidadIndiceCorregir(e,indice){
	if (presionaEnter(e)) {
		corregirArticuloLinea(indice);
	}	
}
function ordenarColumnaReporte(columna,alfabetico){
    articulosIngresados = ordenarArregloGenerico(articulosIngresados,columna,alfabetico);
    mostrarArticulosRendidos();

}