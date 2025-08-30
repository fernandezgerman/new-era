resultadoLista = Array();
function mostrarResultados()
{ 
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateStockInicial" ).html()
        );
    $( "#divResultado" ).html(
            template( resultadoLista )
        );    
} 

function mostrarRendirArticulo(articulo)
{ 
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateStockInicialPorArticulo" ).html()
        );
    $( "#divRendicion" ).html(
            template(articulo)
        );    
} 
function mostrarEstadoArticulo(articulo)
{ 
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateStockInicialPorArticuloEstablecido" ).html()
        );
    $( "#divRendicion" ).html(
            template(articulo)
        );    
} 
function datosValidos()
{
	if ($('#inpSucursalId').val()==""){
		alert("Debe seleccionar una sucursal");
		return false;
	}
	if ($('#inpRubroId').val()=="" && $('#inpCodigo').val()==""){
		alert("Debe seleccionar un rubro");
		return false;
	}	

	return true;
}
function datosValidosTraerArticulo()
{
	if ($('#inpSucursalRendirId').val()==""){
		alert("Debe seleccionar una sucursal");
		return false;
	}
	if ($('#inpCodigoBusqueda').val()==""){
		alert("Debe ingresar un codigo de articulo");
		return false;
	}	

	return true;
}
function traerDatosArticulo(){
	
	if (!datosValidosTraerArticulo()){
		return;
	}
	inpSucursalId = $('#inpSucursalRendirId').val();
	inpCodigo = $('#inpCodigoBusqueda').val();
	
	$('#divRendicionPrincipal').addClass('divBuscandoInformacion');
	$("#btnBuscarParaRendir").attr('disabled','disabled');
	$("#inpCodigoBusqueda").attr('disabled','disabled');
	$("#inpSucursalRendirId").attr('disabled','disabled');
	
	
	$('#divRendicion').html("");
	$.ajax({
		url : 'ajaxObtenerStockInicial.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'inpSucursalId':inpSucursalId,
				'inpCodigo':inpCodigo
				}
		,	
		success : function(resultado) {
			json = $.parseJSON(resultado);			
			if (json.err == 1) {
				alert(json.mensaje);
				$('#inpCodigoBusqueda').removeAttr('disabled');
				$('#inpSucursalRendirId').removeAttr('disabled');			
				$('#inpCodigoBusqueda').focus();
				$('#inpCodigoBusqueda').select();				
			} else {
				articulo = json.datos[0];
				if (articulo.tieneStockInicial == 0){
					mostrarRendirArticulo(json);
					$('#inpCantidadRendida').focus();
				}else{
					json.mensaje = "YA TIENE STOCK INICIAL";
					mostrarEstadoArticulo(json);
					$('#inpCodigoBusqueda').removeAttr('disabled');
					$('#inpSucursalRendirId').removeAttr('disabled');
					$('#inpCodigoBusqueda').focus();
					$('#inpCodigoBusqueda').select();					
				}
				
			}
			$('#btnBuscarParaRendir').removeAttr('disabled');
			$('#divRendicionPrincipal').removeClass('divBuscandoInformacion');
		},
		error : function() {
			$('#divResultado').html("Error al obtener los datos. Pagina inexistente");
			$('#btnBuscarParaRendir').removeAttr('disabled');
			$('#inpCodigoBusqueda').removeAttr('disabled');
			$('#divRendicionPrincipal').removeClass('divBuscandoInformacion');
		}	
	});		
}

function cargarGrilla(){
	
	if (datosValidos()== false){
		return false;
	}
	inpSucursalId = $('#inpSucursalId').val();
	inpCodigo = $('#inpCodigo').val();
	inpRubroId = $('#inpRubroId').val();
	inpFiltroId = $('#inpFiltroId').val();

	
	$('#divReporte').addClass('divBuscandoInformacion'); 
	
	$.ajax({
		url : 'ajaxObtenerStockInicial.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'inpSucursalId':inpSucursalId,
				'inpCodigo':inpCodigo,
				'inpRubroId':inpRubroId,
				'inpFiltroId':inpFiltroId
				}
		,	
		success : function(resultado) {
			json = $.parseJSON(resultado);			
			if (json.err == 1) {
				$('#divResultado').html(json.mensaje);
				alert(json.mensaje);
			} else {
				resultadoLista = json;
				mostrarResultados();
				
			}
			$('#divReporte').removeClass('divBuscandoInformacion');
		},
		error : function() {
			
			$('#divResultado').html("Error al obtener los datos. Pagina inexistente");
			$('#divReporte').removeClass('divBuscandoInformacion');
		}	
	});	
}

$(document).ready(function(){
	//mostrarRendicion();
});
function presionaTeclaBuscarArticulo(e){
	
	if (validateEnter(e)){
		traerDatosArticulo();
	}
}
function presionaTeclaCantidadRendida(e)
{

	if (presionaEscape(e))
	{
		$('#inpCodigoBusqueda').removeAttr('disabled');
		$('#inpSucursalRendirId').removeAttr('disabled');		
		$('#inpCodigoBusqueda').focus();
		$( "#divRendicion" ).html("");
		$('#inpCodigoBusqueda').select();
	}
	if(validateEnter(e)){
		establecerStockInicialArticulos();
	}
}
function validarDatosRendirArticulo(){
	if ($("#codigoArticuloRendicion").val()==""){
		alert('No se establecio un articulo');
		return false;
	}
	if ($("#idSucursalRendicion").val()==""){
		alert('No se establecio la sucursal');
		return false;
	}
	if ($("#inpCantidadRendida").val()==""){
		alert('Debe ingresar un valor para la cantidad');
		return false;
	}
	if (parseFloat($("#inpCantidadRendida").val())> 999){
		alert('La cantidad debe ser menor a 1000.');
		return false;
	}
	if (isNaN($("#inpCantidadRendida").val())){
		alert('El valor de cantidad no es valido.');
		return false;		
	}
	
	return true;
}
function establecerStockInicialArticulos(){
	
	if (!validarDatosRendirArticulo()){
		return;
	}
	inpSucursalId = $('#inpSucursalRendirId').val();
	inpCodigo = $('#inpCodigoBusqueda').val();
	inpCantidad = $('#inpCantidadRendida').val();

	$.ajax({
		url : 'ajaxEstablecerStockInicial.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'inpSucursalId':inpSucursalId,
				'inpCodigo':inpCodigo,
				'inpCantidad': inpCantidad
				}
		,	
		success : function(resultado) {
			json = $.parseJSON(resultado);			
			if (json.err == 1) {
				alert(json.mensaje);
				$('#inpCodigoBusqueda').removeAttr('disabled');
				$('#inpSucursalRendirId').removeAttr('disabled');			
				$('#inpCodigoBusqueda').focus();
				$('#inpCodigoBusqueda').select();				
			} else {
				articulo = json.datos[0];
				if (articulo.tieneStockInicial == 0){
					mostrarRendirArticulo(json);
					$('#inpCantidadRendida').focus();
				}else{
					json.mensaje = "OPERACION REALIZADA";
					mostrarEstadoArticulo(json);
					RefrescarArticuloGrilla(json.datos[0]);
					$('#inpCodigoBusqueda').removeAttr('disabled');
					$('#inpSucursalRendirId').removeAttr('disabled');
					$('#inpCodigoBusqueda').focus();
					$('#inpCodigoBusqueda').select();	
					if($('#inpTomarSiguienteDeLista').is(':checked')){
						tomarSiguienteArticulo();
					}
				}
				
			}
			$('#btnBuscarParaRendir').removeAttr('disabled');
			$('#divRendicionPrincipal').removeClass('divBuscandoInformacion');
		},
		error : function() {
			$('#divResultado').html("Error al obtener los datos. Pagina inexistente");
			$('#btnBuscarParaRendir').removeAttr('disabled');
			$('#inpCodigoBusqueda').removeAttr('disabled');
			$('#divRendicionPrincipal').removeClass('divBuscandoInformacion');
		}	
	});		
}
function establecerStockArticuloDesdeGrilla(codigo)
{
	$('#inpCodigoBusqueda').val(codigo);
	$('#inpSucursalRendirId option[value="'+$('#inpSucursalId').val()+'"]').prop('selected', true)
	
	traerDatosArticulo();
}
function RefrescarArticuloGrilla(articulo)
{
	if ($('#inpSucursalRendirId').val()==$('#inpSucursalId').val())
	{
		datos = resultadoLista.datos;
		for (i=0;i< datos.length;i++)
		{
			art = datos[i];
			if (art.articuloCodigo == articulo.articuloCodigo)
			{
				datos[i] = articulo;
				mostrarResultados();
				return;
				
			}
		}
	}
}
function tomarSiguienteArticulo()
{
	datos = resultadoLista.datos;
	for (i=0;i< datos.length;i++)
	{
		art = datos[i];
		if (art.tieneStockInicial == 0)
		{
			establecerStockArticuloDesdeGrilla(art.articuloCodigo);
			return;
			
		}
	}
	
}
function aceptarArticulo(){
	traerDatosArticulo();
}