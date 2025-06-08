window.onbeforeunload = preguntarAntesDeSalir;
var arregloExclusiones = new Array();
var articuloSeleccionado = new Array();
function mostrarExcepciones(resultado)
{
	resultado['diasrojos'] = $('#diasColorRojo').val();
	resultado['diasverdes'] = $('#diasColorVerde').val(); 
	_.templateSettings.variable = "res";
	
    var template = _.template(
            $( "#templateExcepciones" ).html()
        );
    $( "#listaExcepciones" ).html(
            template( resultado )
        );    
} 
function validarMinimosDeUtilidad()
{
	
	$valor = true;
    $("[id^=inpListaRubroPorcentaje]").each(function(){
        if (!(parseFloat($(this).val()) > 0)){
        	$valor = false;
        };
    });
    return $valor;
}
function checkKey(key)
{
    var unicode
    if (key.charCode)
    {unicode=key.charCode;}
    else
    {unicode=key.keyCode;}
    //alert(unicode); // Para saber que codigo de tecla presiono , descomentar

    if (unicode == 13){
    	traerArticuloPorCodigo();
	}

}
function traerArticuloPorCodigo()
{
	codigo = document.getElementById('bsqCodigo').value;
	if (codigo==""){
		document.getElementById('bsqNombreArticulo').innerHTML = "Ingrese un codigo";
		$("#bsqCodigo").val("");
	
		return;
	}
	articuloSeleccionado = new Array();
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
				document.getElementById('bsqNombreArticulo').innerHTML = json.errorDescripcion;
				alert(json.errorDescripcion);
				$("#bsqCodigo").val("");
				$("#bsqCodigo").focus();
			} else {
				articuloSeleccionado = json; 
				nombre = json.descripcion;
				document.getElementById('bsqNombreArticulo').innerHTML = nombre+' - Costo: '+json.costo;
				document.getElementById('bsqPrecio').focus();
			}
		},
		error : function() {
			alert('Error al obtener la compra. Pagina inexistente');
			document.getElementById('bsqNombreArticulo').innerHTML = "Error al obtener la compra. Pagina inexistente";
		}	
	});	
}
function teclaPrecio(key){
	if (presionaEnter(key)) {
		precio = document.getElementById('bsqPrecio').value;
		if (validaFloat(precio)==false){
			alert('El precio no es un numero valido.');
			return;
		}	
		document.getElementById('bsqBotonAceptar').focus();
	}else{
		return;
	}
}
function datosValidos(){
	
	if (document.getElementById('inpNombreLista').value == ""){
		alert('Debe ingresar un nombre');
		return false;
	}
	
	if ($('#inpCalculaEnBaseAOtraLista').val()==0){
		if (document.getElementById('inpPorcentajeSobreCosto').value==""){
			alert('Debe ingresar un porcentaje.');
			return false;
		}	
		if (validaFloat(document.getElementById('inpPorcentajeSobreCosto').value)==false){
			alert('Debe ingresar un porcentaje valido');
			return false;
		}	
		if (validarMinimosDeUtilidad()==false){
			alert('Los porcentajes minimos de utilidad por rubro deben ser mayores a cero');
			return false;
		}
	}else{
		if ($('#inpIdListaBase').val()=="0"){
			alert('Debe seleccionar una lista de precios para el aumento.');
			return false;
		}			
	}
	return true;
}
function enviarListas(){
	if (datosValidos()){
		bPreguntar = false;
		document.getElementById('frm').submit();
	}
}
 function ocultarAgregarExcepciones(){
	 $('#argegarExcepciones').hide(1);
 }
 function mostrarAgregarExcepciones(){
	 $('#argegarExcepciones').show(1000);
 }
 $( document ).ready(function() {
	/* cargarExclusiones();
	 mostrarExcepciones(arregloExclusiones)	 ;*/
	 $('#aguardeCargaPagina').hide();
	 $('#contenidoListas').css('visibility', 'visible');
});
 function mostrarPanelAgregar()
 {
	 mostrarAgregarExcepciones();
	 
 }
 function precioIngresadoValido(){
	 if(articuloSeleccionado.length < 1){
		 alert("Debe seleccionar un articulo");
		 return false;
	 }
	 
	 if( $('#bsqPrecio').val() ==""){
		 alert("Debe ingresar un precio valido");
		 return false;
	 }	 

	 return true;
 }
 
 function agregarModificacionArticulo(){
	 if (precioIngresadoValido()){
		 existe = false;
		 for(i=0;i < arregloExclusiones.length; i++)
		 {	
			 fila=arregloExclusiones[i];
			 if(fila.codigo==articuloSeleccionado.codigo && fila.eliminado == false){
				 existe = true;
				 des = confirm('El articulo que desea ingresar ya fue cargado en esta lista con el precio '+fila.precio+'. Desea reemplazarlo?');
				 indice = i;
			 }
		 }		 
		 
		 if (existe){//COnsulta si existe en la lista como excepcion
			 if (des){ //Confirma si desea reemplazar el precio anterior
				 arregloExclusiones[indice].precio = $('#bsqPrecio').val();
				 arregloExclusiones[indice].eliminado =false;
				 arregloExclusiones[indice].editado = true;
				 arregloExclusiones[indice].diasActualizacion = 0;
				 
				 arregloExclusiones[indice].insertado =false;		 
		 }else{
			 return;
		 }
		 }else{
			 //Agrega el nuevo articulo con su precio en la lista
			 articuloSeleccionado.precio = $('#bsqPrecio').val();
			 articuloSeleccionado.eliminado =false;
			 articuloSeleccionado.editado = false;
			 articuloSeleccionado.insertado =true;		 
			 articuloSeleccionado.diasActualizacion = 0;
			 arregloExclusiones[arregloExclusiones.length] = articuloSeleccionado;
		 }
		 articuloSeleccionado = new Array();
		 
		 $('#bsqPrecio').val("");
		 $('#bsqCodigo').val("");
		 document.getElementById('bsqNombreArticulo').innerHTML = "Ingrese un articulo";
		 mostrarExcepciones(arregloExclusiones)	 ;
		 $('#bsqCodigo').focus();
	 }
	 
 }
 function eliminarPrecios()
 {
	if (confirm("Esta seguro que desea eliminar los precios seleccionados?"))
	{
		 for(i=0;i < arregloExclusiones.length; i++)
		 {	
			 fila=arregloExclusiones[i];
			 if ($('#check'+i).is(':checked'))
			 {
				 fila.eliminado = true;
				 arregloExclusiones[i] = fila;	 
			 }
		 }			 
	}
	mostrarExcepciones(arregloExclusiones);
 }
 function aceptarArticulo()
 {
	 traerArticuloPorCodigo();
 }
 function editarExcepcionArticulo(codigo){
	 $('#bsqCodigo').val(codigo);
	 traerArticuloPorCodigo(); 
 }
 
 function seleccionListaDependiente()
 {
	 if ($('#inpCalculaEnBaseAOtraLista').val() == "1"){
		 $('#filaListaBase').show();
		 $('#filaAplicaRedondeo').show();
		 $('#filaPorcentajeSobreCosto').hide();
		 $('#configuracionListaComun').hide();
		 $('#configuracionListaEnBaseAOtra').show();
		 
	 }else{
		 $('#filaListaBase').hide();
		 $('#filaAplicaRedondeo').hide();
		 $('#filaPorcentajeSobreCosto').show();	
		 $('#configuracionListaComun').show();
		 $('#configuracionListaEnBaseAOtra').hide();
	 }
	 
 }