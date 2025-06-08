var articulosStockVisible = Array();
var articulosPromocionables = Array();
var articuloSeleccionado = false;
function datosValidos(){
	return true;
}
function enviar(){
	if (datosValidos()){
		document.getElementById('frm').submit();
	}
}
$(document).ready(function(){
    mostrarArticulosPromocionables();
	mostrarResultados();
	$('#inpModificoStockVisible').val('0');
    $('#inpModificoArticulosPromocionables').val('0');
});
function mostrarArticulosPromocionables() {

    $('#inpModificoArticulosPromocionables').val('1');
    _.templateSettings.variable = "resultado";

    var template = _.template($("#templateArticulosPromocionablesPlural").html());
    $("#listaArticulosPromocionables").html(template(articulosPromocionables));
}
function mostrarResultados() {
    $('#inpModificoStockVisible').val('1');
	_.templateSettings.variable = "resultado";

	var template = _.template($("#templateArticulosStockVisiblePlural").html());
	$("#listaArticulosSinStock").html(template(articulosStockVisible));
}
function agregarArticuloStockVisible()
{
	articuloSeleccionado = false;
	var template = _.template($("#templateArticulosStockVisibleAdd").html());
	$("#agregarArticulosSinStock").html(template());	
}
function cancelarAgregarArticuloStockVisible(){
	$("#agregarArticulosSinStock").html("");
}

function traerDatosArticulo(){
	
	if ($('#inpCodigoBusqueda').val()==""){
		return;
	}
	articuloSeleccionado = false;
	
	inpCodigo = $('#inpCodigoArticulo').val();
	
	$('#reporteGeneral').addClass('divBuscandoInformacion');
	
	$.ajax({
		url : 'ajaxArticulosConStock.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'codigo':inpCodigo},	
		success : function(resultado) {
			json = $.parseJSON(resultado);			
			if (json.err == 1) {
				alert(json.mensaje);				
			} else {
                if (json.datos.length == 0) {
                	alert('No se encontro el articulo.');
                }else{
					articuloSeleccionado = json.datos[0];
					$('#divArticuloNombre').html(articuloSeleccionado.nombre);
            	}
			}
			$('#reporteGeneral').removeClass('divBuscandoInformacion');
		},
		error : function() {
			$('#reporteGeneral').removeClass('divBuscandoInformacion');
		}	
	});		
}
function presionaTeclaBuscarArticulo(e){
	$('#divArticuloNombre').html("");
	if (validateEnter(e)){
		traerDatosArticulo();
	}
}
function agregarArticuloAGrillaValido(){
	if (articuloSeleccionado== false){
		alert('Debe seleccionar un articulo');
		return false;
	}
	datos = articulosStockVisible['datos'];
	for ($i=0; $i< datos.length; $i++){
		art = datos[$i];
		if (art['codigo']==articuloSeleccionado['codigo']){
			alert('El articulo con el codigo '+articuloSeleccionado['codigo']+' ya fue ingresado.');
			return false;
		}
	}
	return true;
}
function agregarArticuloAGrilla(){
	if (agregarArticuloAGrillaValido()== true){
		datos = articulosStockVisible['datos'];
		datos[datos.length] = articuloSeleccionado; 
		$("#agregarArticulosSinStock").html("");
		mostrarResultados();	
	}
}
function eliminarArticuloPromocionable(indice){
    datos = articulosPromocionables
    aux = Array();
    a = 0;

    for (i=0; i< datos.length; i++){
        if (i != indice){
            aux[a] = datos[i];
            a++;
        }else{
            dat = datos[i];
            dat['eliminado'] = '1';
            aux[a] = dat;
            a++;
        }
    }
    articulosPromocionables['datos'] = aux;
    mostrarArticulosPromocionables();

}
function eliminarArticuloConStockVisible(indice){

    datos = articulosStockVisible['datos'];
    aux = Array();
    a = 0;

    for (i=0; i< datos.length; i++){
        if (i != indice){
            aux[a] = datos[i];
            a++;
        }
    }
    articulosStockVisible['datos'] = aux;
    mostrarResultados();



}
function aceptarArticulo(){
	traerDatosArticulo();
}
function agregarArticuloPromocionables(){
    articuloSeleccionado = false;
    var template = _.template($("#templateArticulosPromocionablesAdd").html());
    $("#agregarArticulosPromocionables").html(template());
}

function agregarArticuloPromocionableAGrilla(){
    if (agregarArticuloAGrillaPromocionableValido()== true){
        datos = articulosPromocionables;
        datos[datos.length] = articuloSeleccionado;
        $("#agregarArticulosPromocionables").html("");
        mostrarArticulosPromocionables();
    }
}
function agregarArticuloAGrillaPromocionableValido(){
    if (articuloSeleccionado== false){
        alert('Debe seleccionar un articulo');
        return false;
    }
    datos = articulosPromocionables;
    for ($i=0; $i< datos.length; $i++){
        art = datos[$i];
        if (art['codigo']==articuloSeleccionado['codigo']){
            alert('El articulo con el codigo '+articuloSeleccionado['codigo']+' ya fue ingresado.');
            return false;
        }
    }
    return true;
}
function cancelarAgregarArticuloPromocionable(){
    $("#agregarArticulosPromocionables").html("");
}