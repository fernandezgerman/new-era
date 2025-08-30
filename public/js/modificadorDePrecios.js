var arrlistas = Array()
var resultadoLista = Array();
function mostrarResultados(resultado)
{ 
	_.templateSettings.variable = "res";
	
    var template = _.template(
            $( "#templateArticulos" ).html()
        );
    $( "#divResultado" ).html(
            template( resultado )
        );    
} 
function mostrarResultadosListaDependiente(resultado)
{ 
	_.templateSettings.variable = "res";
	
    var template = _.template(
            $( "#templateArticulosListaDependiente" ).html()
        );
    $( "#divResultado" ).html(
            template( resultado )
        );    
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
function getIdListaPrincipal(idListaDependiente){
	for(i =0;i < arrlistas.length; i++ ){
		fila = arrlistas[i];
		if(fila['id']==$('#inpListaId').val()){
			return fila['idlistabase'];			
		}
	}
	 
}
function buscarResultadosListaDependiente(idListaBase)
{
	if (datosValidos()==false) {return};
	codigo = $('#inpCodigo').val();
	nombre = $('#inpNombre').val();
	idLista = $('#inpListaId').val();
	idRubro = $('#inpRubroId').val();
	diasColorRojo = $('#diasColorRojo').val();
	diasColorVerde = $('#diasColorVerde').val();

	
	 
	if (idLista==""){
		alert('Debe seleccionar una lista de precios');
		return;
	}
	$('#divReporte').addClass('divBuscandoInformacion');
	bloquearDiv();
	 
	$.ajax({
		url : 'ajaxModificadorDePreciosResultado.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'idRubro':idRubro,
				'idLista': idLista,
				'codigoArticulo': codigo,
				'diasColorRojo': diasColorRojo,
				'diasColorVerde': diasColorVerde,
				'nombreArticulo': nombre,
				'listaDependiente': 1,
				'idListaBase': idListaBase},
				
				
		success : function(resultado) {
			json = $.parseJSON(resultado);
			if (json.error == 1) {
				document.getElementById('divResultado').innerHTML = json.descripcionError;
				alert(json.descripcionError);
			} else {
				resultadoLista = json;
				mostrarResultadosListaDependiente(json);
				desBloquearDiv();
			}
			
			$('#divReporte').removeClass('divBuscandoInformacion');
		},
		error : function() {
			alert('Error al obtener la compra. Pagina inexistente');
			document.getElementById('divResultado').innerHTML = "Error al obtener la compra. Pagina inexistente";
			$('#divReporte').removeClass('divBuscandoInformacion');
		}	
	});	
}
function buscarResultados(porDebajoDelCosto, minimoUtilidad){
	id = getIdListaPrincipal($('#inpListaId').val());

	if(porDebajoDelCosto==1 || minimoUtilidad==1) {
        if ($('#inpRubroId').val() == "0") {
            alert('Debe seleccionar un rubro');
            return;
        }
    }


	if (parseFloat(id)>0){
		buscarResultadosListaDependiente(parseFloat(id));
	}else{
		buscarResultadosListaSimple(porDebajoDelCosto, minimoUtilidad);
	}
}

function buscarResultadosListaSimple(idlistasel,porDebajoDelCosto, minimoUtilidad)
{
	if (datosValidos()==false) {return};
	codigo = $('#inpCodigo').val();
	nombre = $('#inpNombre').val();
	idLista = $('#inpListaId').val();
	idRubro = $('#inpRubroId').val();
	diasColorRojo = $('#diasColorRojo').val();
	diasColorVerde = $('#diasColorVerde').val();

    if(porDebajoDelCosto==1 || minimoUtilidad==1) {
        codigo = '';
        nombre = '';
        idRubro = '';
        idLista = idlistasel;
    }
	if (idLista==""){
		alert('Debe seleccionar una lista de precios');
		return;
	}
	$('#divReporte').addClass('divBuscandoInformacion');
	bloquearDiv();
	$.ajax({
		url : 'ajaxModificadorDePreciosResultado.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'idRubro':idRubro,
				'idLista': idLista,
				'codigoArticulo': codigo,
				'diasColorRojo': diasColorRojo,
				'diasColorVerde': diasColorVerde,
				'nombreArticulo': nombre,
				'porDebajoDelCosto':porDebajoDelCosto,
				'minimoUtilidad':minimoUtilidad},
				
		success : function(resultado) {
			json = $.parseJSON(resultado);
			if (json.error == 1) {
				document.getElementById('divResultado').innerHTML = json.descripcionError;
				alert(json.descripcionError);
			} else {
				resultadoLista = json;
				mostrarResultados(json);
				desBloquearDiv();
			}
			
			$('#divReporte').removeClass('divBuscandoInformacion');
		},
		error : function() {
			alert('Error al obtener la compra. Pagina inexistente');
			document.getElementById('divResultado').innerHTML = "Error al obtener la compra. Pagina inexistente";
			$('#divReporte').removeClass('divBuscandoInformacion');
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
	if ($('#inpListaId').val()=="") {
		alert('Debe seleccionar una lista de precios');
		return false;
	}
	return true;
}
function colorearRenglones()
{
	resultadoLista['diasColorRojo'] = $('#diasColorRojo').val();
	resultadoLista['diasColorVerde'] = $('#diasColorVerde').val(); 

	mostrarResultados(resultadoLista);	
}
function modificoRenglon(indice){
	$("#fila"+indice).removeClass();
	$("#filaPrecio"+indice).removeClass();
	
	$("#fila"+indice).addClass("tblFilaParAzul");
	$("#filaPrecio"+indice).addClass("tblFilaParAzul");
	datos = resultadoLista['datos'];
	datos[indice].info = '<div style="float:left;">Editando...</div>' + 
						 '<div style="float:left;" class="cerrarSesion">'+
						 '<a style="cursor:hand;" onclick="cancelarEdicionFila('+indice+')">(Cancelar - </a>'+
						 '<a style="cursor:hand;" onclick="guardarPrecio('+indice+')">Guardar)</a></div>';
	datos[indice].editando = 1;
	$("#divInfo"+indice).html(datos[indice].info);
	
	if($('#inpAplicaPorcentajeMin'+indice).is(':checked')){
		datos[indice].aplicaPorcentajeMinimo = 1;
	}else{
		datos[indice].aplicaPorcentajeMinimo = 0;
	}
	
	datos[indice].articuloPrecioExcepcion = formatearPrecio( $('#inpPrecioExcepcion'+indice).val());
	calcularPrecio(indice);
}
//Cancelala edici�n de la fila
function cancelarEdicionFila(indice){
	datos = resultadoLista['datos'];
	$("#fila"+indice).removeClass();
	$("#fila"+indice).addClass(datos[indice].clase);
	
	$("#filaPrecio"+indice).removeClass();
	$("#filaPrecio"+indice).addClass(datos[indice].clase);	
	
	$("#divInfo"+indice).html(datos[indice].infoAnterior);
	$("#divPrecioFinal"+indice).html(datos[indice].articuloPrecioFinalAnterior);	
	$("#inpPrecioExcepcion"+indice).val(datos[indice].articuloPrecioExcepcionAnterior);
		
	if (datos[indice].aplicaPorcentajeMinimoAnterior==1){
		$("#inpAplicaPorcentajeMin"+indice).prop("checked", "checked");
	}else{
		$("#inpAplicaPorcentajeMin"+indice).prop("checked", "");
	}
	
	
	datos[indice].articuloPrecioFinal = datos[indice].articuloPrecioFinalAnterior
	datos[indice].articuloPrecioExcepcion = datos[indice].articuloPrecioExcepcionAnterior
	datos[indice].info = datos[indice].infoAnterior
	datos[indice].aplicaPorcentajeMinimo = datos[indice].aplicaPorcentajeMinimoAnterior
	datos[indice].editando = 0;
	datos[indice].info = datos[indice].infoAnterior;

	art = datos[indice];
    descripcionEstadoPrecio = '';
    if(parseFloat(art.articuloCosto) > parseFloat(art.articuloPrecioFinal)){
        descripcionEstadoPrecio = '<div class="divAvisoPequeño" style="background-color:red;">Por debajo del costo</div>';
    }else{
        if((parseFloat(art.articuloCosto) + parseFloat(art.articuloCosto) * parseFloat(art.rubroPorcentajeMinimo) / 100) > parseFloat(art.articuloPrecioFinal)){
            descripcionEstadoPrecio = '<div class="divAvisoPequeño" style="background-color:yellow;color:black;">Menor al min. utilidad</div>';
        }
    }
    $('#divDescripcionCostoVsPrecio'+indice).html(descripcionEstadoPrecio);
}
function calcularPrecio(indice)
{
	art = resultadoLista.datos[indice];
	porcentajeMinimo = art.rubroPorcentajeMinimo ;
	porcentajeLista = art.listaPorcentaje
	precioExcepcion = art.articuloPrecioExcepcion;
	aplicaPorcentajeMinimo = art.aplicaPorcentajeMinimo;
	costo = art.articuloCosto;
	precioListaBase = 0;
	porcentajeAumento = 0;	
	if (resultadoLista.listaDependiente==1){
		precioListaBase = art.listadetallepreciobase;
		porcentajeAumento = art.porcentajeaumento;
	}
	$('#divPrecioFinal'+indice).html('-.-');
	$.ajax({
		url : 'ajaxModificadorDePreciosPrecioCalculado.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'porcentajeMinimo':porcentajeMinimo,
				'porcentajeLista': porcentajeLista,
				'precioExcepcion': precioExcepcion,
				'aplicaPorcentajeMinimo': aplicaPorcentajeMinimo,
				'costo': costo,
				'indice': indice,
				'listaDependiente':resultadoLista.listaDependiente,
				'precioListaBase': precioListaBase,
				'porcentajeAumento': porcentajeAumento
				},
		success : function(resultado) {
			json = $.parseJSON(resultado);
			if (json.error == 1) {
				$('#divPrecioFinal'+json.indice).html('ERR');	
				alert(json.descripcionError);
			} else {
				$('#divPrecioFinal'+json.indice).html(json.precio);
				resultadoLista.datos[json.indice].articuloPrecioFinal = json.precio;

                datos = resultadoLista['datos'];
                art = datos[json.indice];
                descripcionEstadoPrecio = '';
                if(parseFloat(art.articuloCosto) > parseFloat(json.precio)){
                    descripcionEstadoPrecio = '<div class="divAvisoPequeño" style="background-color:red;">Por debajo del costo</div>';
                }else{
                    if((parseFloat(art.articuloCosto) + parseFloat(art.articuloCosto) * parseFloat(art.rubroPorcentajeMinimo) / 100) > parseFloat(json.precio)){
                        descripcionEstadoPrecio = '<div class="divAvisoPequeño" style="background-color:yellow;color:black;">Menor al min. utilidad</div>';
                    }
                }
                $('#divDescripcionCostoVsPrecio'+json.indice).html(descripcionEstadoPrecio);
			}
		},
		error : function() {
			alert('Error al obtener calcular el precio. Pagina inexistente');
		}	
	});	
}
function bloquearDiv(){
	
	$("#divResultado").css({
		"filter":"alpha(opacity=50)",
		"opacity":"0.5"
		});	
}
function desBloquearDiv(){	
	$("#divResultado").css({
		"filter":"alpha(opacity=1)",
		"opacity":"1"
		});	
}

function guardarPrecio(indice)
{
	art = resultadoLista.datos[indice];
	listaId = resultadoLista.listaId;
	articuloId = art.articuloId;
	articuloExcepcion = art.articuloPrecioExcepcion;
	articuloAplicaPorcentaje = art.aplicaPorcentajeMinimo;
	$("#divInfo"+indice).html('ESTABLECIENDO PRECIO...');	
	$.ajax({
		url : 'ajaxModificadorDePreciosGuardar.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'listaId':listaId,
				'articuloId': articuloId,
				'articuloExcepcion': articuloExcepcion,
				'articuloAplicaPorcentaje': articuloAplicaPorcentaje,
				'indice': indice},
		success : function(resultado) {
			json = $.parseJSON(resultado);
			if (json.error == 1) {
				$('#info'+json.indice).html('ERROR AL INTENTAR GUARDAR!!!');	
				alert(json.descripcionError);
			} else {
				art = resultadoLista.datos[json.indice];
				art.estado = 2;
				art.info = "MODIFICADO";
				art.infoAnterior = "MODIFICADO";
				art.articuloPrecioFinal = json.precio;
				art.articuloPrecioFinalAnterior = json.precio;
				art.articuloPrecioExcepcionAnterior = art.articuloPrecioExcepcion; 
				art.aplicaPorcentajeMinimoAnterior  = art.aplicaPorcentajeMinimo;
				art.clase = "tblFilaImparVerde";
				$("#fila"+json.indice).removeClass();
				$("#fila"+json.indice).addClass("tblFilaImparVerde");
				$("#filaPrecio"+json.indice).removeClass();
				$("#filaPrecio"+json.indice).addClass("tblFilaImparVerde");				
				$("#divInfo"+indice).html(art.info);

                descripcionEstadoPrecio = '';
                if(parseFloat(art.articuloCosto) > parseFloat(art.articuloPrecioFinal)){
                    descripcionEstadoPrecio = '<div class="divAvisoPequeño" style="background-color:red;">Por debajo del costo</div>';
                }else{
                    if((parseFloat(art.articuloCosto) + parseFloat(art.articuloCosto) * parseFloat(art.rubroPorcentajeMinimo) / 100) > parseFloat(art.articuloPrecioFinal)){
                        descripcionEstadoPrecio = '<div class="divAvisoPequeño" style="background-color:yellow;color:black;">Menor al min. utilidad</div>';
                    }
                }
                $('#divDescripcionCostoVsPrecio'+json.indice).html(descripcionEstadoPrecio);
			}
		},
		error : function() {
			alert('Error al guardar el precio. Pagina inexistente');
		}	
	});	
}
function recalcularPrecios(){
	if(confirm("Esta seguro que desea calcular y actualizar los precios?")){
		$("#imgAguarde").show(0);
		cargarActualizacionesPendientes(1);
	}
}
function cargarActualizacionesPendientes(recalcular){
	$.ajax({
		url : 'ajaxModificadorDePreciosRecalcular.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'recalcularTodosLosPrecios': recalcular},
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			_.templateSettings.variable = "res";			
		    var template = _.template(
		            $( "#templateArticulosActualizables" ).html()
		        );
		    $( "#divResultado" ).html(
		            template( json )
		        );
		    $("#imgAguarde").hide(0);
			},
		error : function() {
			alert('Error al guardar el precio. Pagina inexistente');
		}	
	});		
}

function verDetalleDeCompras(articuloId,indice){
    cargarAjaxGenericoJson('ajaxModificadorDePreciosDetalle.php', {'articuloId':articuloId}, "resultado", "templateExistenciasSucursal", "divMasDatos"+indice,{'indice':indice});
    //$('#filaMasDatos'+indice).css({'display':'block'});
}
function cerrarDetalleCompras(indice){
    $("#divMasDatos"+indice).html("");
}