var rendiciones = new Array();
var articuloSeleccionado = false;
var sucursalesSeleccionadas="";
var $objRegistros= new Array();
$(document).ready(function(){
	
    var template = _.template($( "#filtrosGeneralesSucursalesSinDescripcionTemplate" ).html());
    $( "#filtroSucursales" ).html(template(contenedorFiltros));
    
    autoseleccionarSucursales(sucursalesSeleccionadas);

    mostrarResultado();
});
function validarDatosAgregarRendicion(){
	if ($('#inpSucursalId').val()==0){
		alert('Debe seleccionar una sucursal.');
		return false;
	}
	if ($('#inpRubroId').val()==0){
		alert('Debe seleccionar un rubro.');
		return false;
	}	
	return true;
}
function enviar(){
	if(!validarDatosAgregarRendicion()){
		return false;
	}
	agregarRendicion();
}
function agregarRendicion(){
	idSucursal = $('#inpSucursalId').val();
	idRubro = $('#inpRubroId').val();

	$.ajax({
		url : 'rendicionStockAlta1GuardarRendicion.php?token='+$('#token').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'inpClaveOperacion':$('#inpClaveOperacion').val(),
				'inpRubroId':idRubro,
				'inpSucursalId':idSucursal},
		success : function(resultado) {
			json = $.parseJSON(resultado);
			if (json.resultado == 'OK'){
				alert('La rendicion se abrio correctamente.');
				action = $('#actionBuscar').val();
				$('#inpRendicionId').val(json.rendicionId);
				$('#frmNuevaRendicion').attr('action',action);
				$("#frmNuevaRendicion" ).submit();					
				
			}else{
				alert(json.descripcion);
			}
		},
		error : function() {
			alert('Error al agregar la rendicion. Pagina inexistente');
		}	
	});
}
function continuarRendicion(id){

	$('#inpRendicionId').val(id);

	action = $('#host').val()+'principal.php?pagina=rendstocka2&token='+$('#token').val();
	$('#frmNuevaRendicion').attr('action',action);
	$("#frmNuevaRendicion" ).submit();	
}
function buscarRendicion()
{
    if($('#inpFechaDesde').val()== ''){
        alert('Debe ingresar la fecha desde.');
        return;
    }
    if($('#inpFechaHasta').val()== ''){
        alert('Debe ingresar la fecha hasta.');
        return;
    }

	$('#filtroSucursalesTodas').val($('#inpFiltroSucursales').val());
	action = $('#actionBuscar').val();
	$('#frm').attr('action',action);
	$("#frm" ).submit();	
}
function mostrarDetalles(rendicionId)
{
	$('#inpRendicionId').val(rendicionId);
	$('#frm').attr('action',$('#inpVerDetalle').val());
	$('#frm').submit();
}

 /* Rendicion individual */
/* ******************** */
function rendirArticuloValido(){
	if (articuloSeleccionado==false){
		alert('Debe seleccionar un articulo');
		return false;
	}
	if ($('#inpCantidad').val()==""){
		alert('Debe ingresar una cantidad');
		return false;
	}	
	return true;
}
function rendirArticulo(){
	
	if (!rendirArticuloValido()){
		return ;
	}
	var cantidad = $('#inpCantidad').val();
	var rendicionId = $('#inpRendicionIndividualId').val();
	var token = $('#inpToken').val();
	
	$("#imgAguardeCompra").css("display", "block");
	$('#inpCodigoArticulo').attr("disabled","disabled");
	$('#inpCantidad').attr("disabled","disabled");
	$('#btnRendirArticulo').attr("disabled","disabled");
	$.ajax({
		url : 'rendicionesStockArticulosGuardarJson.php?token='+token,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'idarticulo':articuloSeleccionado.id,
				'idrendicion': rendicionId,
				'cantidad': cantidad,
				'precio': articuloSeleccionado.precio,
				'token':token
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.resultado=='ERROR') {
				alert(json.mensaje);
				$('#descripcionArticulo').html('Ingrese un codigo');
				$('#inpCodigoArticulo').val('');
				$('#inpCodigoArticulo').focus();
			} else {
				articuloSeleccionado = json;
			}
			$("#imgAguardeCompra").css("display", "none");
			$('#inpCodigoArticulo').removeAttr("disabled");
			$('#inpCantidad').removeAttr("disabled");
			$('#btnRendirArticulo').removeAttr("disabled");
			articuloSeleccionado = false;
			$('#inpCodigoArticulo').val("");
			$('#inpCantidad').val("");
			$('#descripcionArticulo').html('Ingrese un codigo');
			$('#divDescripcionEstado').html(json.descripcionestado );
			
			$('#inpCodigoArticulo').focus();
			alert('El articulo se rindio correctamente.');
		},
		error : function() {
			alert('Error al obtener la compra. Pagina inexistente');
			$("#imgAguardeCompra").css("display", "none");
			$('#inpCodigoArticulo').removeAttr("disabled");
			$('#inpCantidad').removeAttr("disabled");
			$('#btnRendirArticulo').removeAttr("disabled");			
		}	
	});
}
function aceptarArticulo()
{
	var codigo = $('#inpCodigoArticulo').val();
	var rendicionId = $('#inpRendicionIndividualId').val();
	var cantidad = $('#inpCantidad').val();
	var token = $('#inpToken').val();

	
	if (codigo==""){
		return;
	}
	
	$("#imgAguardeCompra").css("display", "block");
	$.ajax({
		url : 'rendicionesStockArticulosJson.php?token='+token,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'codigoArticulo':codigo,
				'rendicionId': rendicionId,
				'incluirRendidos':true,				
				'token':token
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.resultado=='ERROR') {
				alert(json.mensaje);
				$('#descripcionArticulo').html('Ingrese un codigo');
				$('#inpCodigoArticulo').val('');
				$('#inpCodigoArticulo').focus();
			} else {
				articuloSeleccionado = json;
				$('#descripcionArticulo').html(articuloSeleccionado.articulo);
			}
			$("#imgAguardeCompra").css("display", "none");
		},
		error : function() {
			alert('Error al obtener la compra. Pagina inexistente');
			$("#imgAguardeCompra").css("display", "none");
		}	
	});
}
function limpiarRendicionIndividual(){
	articuloSeleccionado = false;
	$("#inpCodigoArticulo").val("");
	$("#inpCantidad").val("");
}
function autoseleccionarSucursales(sucursales){
	var arr = sucursales.split(',');
	
	for(i=0;i < arr.length; i++){
		$('#inpFiltroSucursales option[value=' + arr[i] + ']').attr('selected', true);	
	}
	
	
}
function mostrarResultado(){
    _.templateSettings.variable = "$objRegistros";

    var template = _.template(
        $( "#templateRendicionesGeneral" ).html()
    );
    $( "#divContenido" ).html(
        template($objRegistros)
    );
}
function ordenarColumnaReporte(columna,alfabetico,esFecha){
    $rendiciones = $objRegistros['rendiciones'];
    $rendiciones= ordenarArregloGenerico($rendiciones,columna,alfabetico,esFecha);
    $objRegistros['rendiciones'] = $rendiciones;
    mostrarResultado();

}
function ordenarPorDiferencia(){
    arreglo = $objRegistros['rendiciones'];

	if ($objRegistros['ordenTipoDif'] == 1) {
        $objRegistros['ordenTipoDif' ] = -1;
	} else {
        $objRegistros['ordenTipoDif'] = 1;
	}
    arreglo = _.sortBy(arreglo, function(fila){
    	res =  parseFloat((parseFloat(fila['valorRendido']) - parseFloat(fila['valorSistema']) )
							* parseFloat($objRegistros['ordenTipoDif']));
    	if(res){
    		return res;
		}else{
    		return 0;
		}
    });

	$objRegistros['rendiciones'] = arreglo;

	mostrarResultado();
}