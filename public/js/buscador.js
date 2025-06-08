var filaSeleccionadaBuscador = 0;
var idBAOrigen = false;
var tipoBAOrigen = false;
var buscadorBuscando = false;
function abrirBuscador2(){
	ajaxAbrirVentana();

	//mostrarTemplateGeneral({}, 'resultadoBuscador', 'generalMostrarBuscadorArticulos', 'divAjaxContenido');

	cargarAjaxGenericoJson('ajaxProveedores.php', {}, 'dataBuscador', 'generalMostrarBuscadorArticulos', 'divAjaxContenido',
		null,"$('#inpBANombre').focus()");


}
function buscarArticulos2(pagina){


	if(!this.buscadorBuscando ){
		this.buscadorBuscando = true;
		url = 'ajaxBuscadorArticulos2.php';
		data = {
			'codigo': $('#inpBACodigo').val(),
			'articuloNombre': $('#inpBANombre').val(),
			'rubroNombre': $('#inpBARubro').val(),
			'incluirInactivos': $('#inpBAInactivos').is(':checked'),
			'incluirCompuestos': $('#inpBACompuestos').is(':checked'),
			'proveedorId': $('#inpBAProveedor').val(),
			'pagina': pagina
		};
		variable = 'buscadorJsonVar';
		template = 'generalMostrarBuscadorArticulosDetalle';
		divResultado = 'divBuscadorArticulos2';
		extra = false;
		callback = 'finalizaBusquedor2(json)';


		cargarAjaxGenericoJson(url, data, variable, template, divResultado,
			extra, callback);
	}else{
		alert('Aguarde a que la busqueda previa finalice.')
	}
}
function finalizaBusquedor2(json){
	//seleccionarFilaBuscador2(0);
	this.buscadorBuscando = false;
	filaSeleccionadaBuscador = -1;
	$('#inpBANombre').focus();

}
function seleccionarFilaBuscador2(fila){


	$('#trBA'+this.filaSeleccionadaBuscador).removeClass('registroSeleccionado');

	$('#trBA'+fila).addClass('registroSeleccionado');
	$("#radioBuscadorArticulos" + fila).prop("checked", true);
	this.filaSeleccionadaBuscador = fila;

}

function seleccionarRadioBuscador(fila,dblclick) {
	$("#radioBuscadorArticulos" + fila).focus();
	if(dblclick){
		keyDownRadioBuscador2({'keyCode':13})
	}
}

function abrirBuscador(identificador,tipo){

	//if(tipo=='articulos'){
		this.idBAOrigen = identificador;
		this.tipoBAOrigen = tipo;
		abrirBuscador2();

/*	}else {
		//En utiles
		ajaxAbrirVentana();
		document.getElementById('divAjaxContenido').innerHTML = "";
		$.ajax({
			url: 'buscador.php?token=' + document.getElementById('mToken').value,
			type: 'POST',
			datatype: 'json',
			async: true,
			data: {
				'tipoBuscador': tipo,
				'destino': identificador,
				'funcionFinal': 'aceptarArticulo'
			},
			success: function (resultado) {
				document.getElementById('divAjaxContenido').innerHTML = resultado;
				$("#inpNombre").focus();
			},
			error: function () {
				alert('Error al cargar el buscador. Pagina inexistente');
			}
		});
	}*/
}
function seleccionoArticuloBuscador(){
	codigo = $('#BACodigoSeleccionadoArticulo'+this.filaSeleccionadaBuscador).val();
	$('#'+this.idBAOrigen).val(codigo);
	ajaxCerrarVentana();
	$('#'+this.idBAOrigen).focus();

	try{

		eval("aceptarArticulo()");
	}
	catch(err)
	{}
}
function keyDownRadioBuscador2(tecla){

	switch (tecla.keyCode) {
		case 13:
			seleccionoArticuloBuscador();
			break;
		case 38:   // Flecha arriba
			break;
		case 40:   // Flecha Abajo
			break;

		default:
			$('#inpBANombre').focus();
			break;
	}
}
function buscador2PresionaRecibeFoco(fila){
	seleccionarFilaBuscador2(fila,this.filaSeleccionadaBuscador);
}
function buscador2PresionaTecla(tecla)
{
	/*
	38 Flecha arriba
	40 Flecha abajo
	 */

	switch (tecla.keyCode) {
		case 27:
			javascript:ajaxCerrarVentana();
			$('#'+this.idBAOrigen).focus();
			break;
		case 13:
			buscarArticulos2(1);
			break;
		case 38:   // Flecha arriba
			if(this.filaSeleccionadaBuscador > 0 ){
				seleccionarRadioBuscador(this.filaSeleccionadaBuscador - 1);
			}

			break;
		case 40:   // Flecha Abajo
			if(this.filaSeleccionadaBuscador < 100 ){
				seleccionarRadioBuscador(this.filaSeleccionadaBuscador + 1);
			}
			break;

		//default:
	}
}
function BAVerdetalleArticulo(id){
	url='principal.php?token='+$('#mToken').val()+'&pagina=artm&id='+id;
	$('#abrirArticuloBuscadorForm').attr('action',url);
	$("#abrirArticuloBuscadorForm" ).submit();
}
function bscTraerInfo()
{
 //grilla
  $('#divAjaxContenido').addClass('divBuscandoInformacion');
  $.ajax({
	  url: 'buscador.php?token='+document.getElementById('mToken').value,
	  type: 'POST',
	  datatype :'json',
	  async: true,
	  data: {'nombre':document.getElementById('inpNombre').value,
		  	 'codigo':document.getElementById('inpBuscarCodigo').value,
		  	 'soloGrilla':1},
	  success: function(resultado){
				document.getElementById('grilla').innerHTML = resultado;
				$('#divAjaxContenido').removeClass('divBuscandoInformacion');
			},
		  error: function(){
				alert('Error la grilla del buscador. Pagina inexistente') ;
			}
		});	
}
function seleccionarRenglonBuscador($idarticulo)
{
	//$('input:radio').attr('checked', false);
	return;
	$('input:radio').each(function(i) {
		$( this ).removeAttr('checked');
	});
	
	$('#inpRadioSeleccionarCodigo'+$idarticulo).attr('checked', true);
}
function aceptarBusqueda()
{

	var codigo = $('input[name=radioBuscadorArticulos]')
		.filter(':checked').val();

	if (codigo) {
		keyDownRadioBuscador2({'keyCode': 13})
	}else{
		alert('Debe seleccionar algun articulo.');
	}

	return;
	//inpSeleccionarCodigo
	var codigo = $('input[name=inpSeleccionarCodigo]')
	.filter(':checked').val();
	if (codigo) {
		nombreInputDestino = $("#destinoValor").val();
		
		
		$("#"+nombreInputDestino).val(codigo);
        $("#"+nombreInputDestino).focus();
		
		if($("#funcionFinal").val()!=""){
            fun = $("#funcionFinal").val();
			try{
				eval(fun+"()");
			}
			catch(err)
			 {}
		}
		cerrarBuscador();
	}else{
		alert('Debe seleccionar algun articulo.');
	}	
}
function cerrarBuscador()
{
	ajaxCerrarVentana();
}
function buscadorPresionaTecla(tecla)
{
    if (tecla.keyCode == 13) { 
    	bscTraerInfo();
    }
}
function BuscadorSeleccionoRenglon(tecla){
	
	if (tecla.keyCode == 13){
		aceptarBusqueda();
	}
}
