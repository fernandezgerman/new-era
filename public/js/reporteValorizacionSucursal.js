var sucursales;
var valores;
$(document).ready(function() {
	$.ajax({
		url : 'ajaxSucursalesUsuariosJson.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		success : function(resultado) {
			_.templateSettings.variable = "res";
			
			json = $.parseJSON(resultado);
			sucursales = json;
		    var template = _.template(
		            $( "#templateValorizacionSucursalCabecera" ).html()
		        );
		    $( "#divSucursales" ).html(
		            template(json)
		        );			    			
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});	
});
function mostrarValorizacion(){	
	if (datosValidos()){
		document.getElementById('frm').submit();
	}
}

function guardarValorizacion(){
	
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=vlrsscrsstckgrdr';
	
	$('#frmGuardar').attr('action',action);
	$("#frmGuardar " ).submit();	
	
	document.getElementById('frmGuardar').submit();	
}

function mostrarValorizacion(){
	indice = $('#inpSucursalId').val();
	if (indice !=""){
		fila = sucursales[indice];
		$('#divValorizacionSucursal').html('VALORIZACION TOTAL: <span style="font-weight:bold; font-size:22px;">$'+fila['valorizacion']);
		mostrarValorizacionRubroMarca(fila['id'],fila['valorizacion']);
	}else{
		$('#divValorizacionSucursal').html("Seleccione una sucursal");
	    $( "#resultadoValorizacion" ).html(
	            ""
	        );			    			
	}
}
function mostrarValorizacionRubroMarca(idsucursal,valorizacion){
	$.ajax({
		url : 'ajaxValorizacionSucursalRubroMarca.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		data : {	
				inpSucursalId:idsucursal,
				inpSucursalValorizacion: valorizacion
				},
		async : true,
		success : function(resultado) {
			_.templateSettings.variable = "res";
			
			json = $.parseJSON(resultado);
			valores = json;
		    var template = _.template(
		            $( "#templateValorizacionRubroMarcaTabla" ).html()
		        );
		    $( "#resultadoValorizacion" ).html(
		            template(json)
		        );			    			
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});		
}
function getIndiceRenglon(idmarca,idrubro){
	total = parseFloat(valor['totalRegistros']);
	registros = valor['registros'];
	for(i=0;i < total;i++){
		fila = registros[i];
		if (fila['marcaId']==idmarca && fila['rubroId']==idrubro){
			return i;
		}
	}
	return false;
}
function recalcularPorcentajeValores(indice){
	porcentaje = $('#inpPorcentaje'+indice).val();
	
	registros = valores['registros'];
	fila = registros[indice];
	fila['porcentajeIdeal'] = parseFloat(porcentaje) / 100;
	registros[indice] = fila;
	valores['registros'] = registros;
	
    var template = _.template(
            $( "#templateValorizacionRubroMarcaTabla" ).html()
        );
    $( "#resultadoValorizacion" ).html(
            template(valores)
        );		
    
}
function recalcularImporteValores(indice){
	importe = $('#inpImporte'+indice).val();
	valorizacion = valores['sucursalValorizacion'];
	registros = valores['registros'];
	fila = registros[indice];	
	fila['porcentajeIdeal'] = parseFloat(importe) / parseFloat(valorizacion);
	registros[indice] = fila;
	valores['registros'] = registros;
	
    var template = _.template(
            $( "#templateValorizacionRubroMarcaTabla" ).html()
        );
    $( "#resultadoValorizacion" ).html(
            template(json)
        );		
    
}
function ordenarPorRubro(){
	lista = valores['registros'];

	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	lista = _.sortBy(lista, function(fila){
		cadena = fila['rubroNombre'];
		if(fila['rubroNombre']){
			cadena = cadena.toUpperCase();
		}
		return cadena; 
		});
	valores['registros'] = lista ;
	
    var template = _.template(
            $( "#templateValorizacionRubroMarcaTabla" ).html()
        );
    $( "#resultadoValorizacion" ).html(
            template(valores)
        );		
}
function ordenarPorMarca(){
	lista = valores['registros'];

	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	lista = _.sortBy(lista, function(fila){
		cadena = fila['marcaNombre'];
		if(fila['marcaNombre']){
			cadena = cadena.toUpperCase();
		}
		return cadena; 
		});
	valores['registros'] = lista ;
	
    var template = _.template(
            $( "#templateValorizacionRubroMarcaTabla" ).html()
        );
    $( "#resultadoValorizacion" ).html(
            template(valores)
        );		
}
function ordenarPorPorcentajeConfiguracion(){
	lista = valores['registros'];

	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	lista = _.sortBy(lista, function(fila){
			res = parseFloat(fila['porcentajeIdeal']);
			if (isNaN(res)){
				res = parseFloat(fila['valorizacionActual']);				
			}
			return res *-1; 
		});
	valores['registros'] = lista ;
	
    var template = _.template(
            $( "#templateValorizacionRubroMarcaTabla" ).html()
        );
    $( "#resultadoValorizacion" ).html(
            template(valores)
        );		
}
function mostrarDetallePorcentajeSugerido(){
	
    var template = _.template(
            $( "#templateValorizacionDescripcionPorcentajeSugerido" ).html()
        );
    $( "#divDetallePorcentajeSugerido" ).html(
            template(valores)
        );		
	
}
function cerrarDetallePorcentajeSugerido(){
    $( "#divDetallePorcentajeSugerido" ).html("");			
}