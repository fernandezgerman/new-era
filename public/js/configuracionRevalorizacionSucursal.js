var detalleArticulos = Array();
var detalleRubros = Array();

function mostrarRevalorizacionSucursal(div,datos)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateRevalorizacionSucursal" ).html()
        );
    $( "#"+div ).html(
            template( datos )
        );    
}
$(document).ready(function(){
	cargarJson();
	mostrarRevalorizacionSucursal('reporteValorizacionSucursal',rendiciones);
});
function mostrarDetalleArticulos(datos,div){
	_.templateSettings.variable = "datos";
	
    var template = _.template(
            $( "#templateRevalorizacionSucursalDetalleArticulos" ).html()
        );
    $( "#"+div ).html(
            template(datos)
        );    	
}
function mostrarDetalleRubros(datos,div){
	_.templateSettings.variable = "datos";
	
    var template = _.template(
            $( "#templateRevalorizacionSucursalDetalleRubros" ).html()
        );
    $( "#"+div ).html(
            template(datos)
        );    	
}
function mostrarDetalleDeCompras(datos,div){
	_.templateSettings.variable = "datos";
	
    var template = _.template(
            $( "#templateRevalorizacionSucursalDetalleCompras" ).html()
        );
    $( "#"+div ).html(
            template(datos)
        );    	
}

function cancelarMostrarArticulos(div){

    $( "#"+div ).html("");    	
}
function mostrarDetalleCompras(idsucursal,div,idrubro,idproveedor){
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$.ajax({
		url : 'ajaxRevalorizacionDetalle.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'idsucursal':idsucursal,
				'div':div,
				'agrupacion':$('input:radio[name=crevAgrupacionDetalle]:checked').val(),
				'idrubro':idrubro,
				'idproveedor':idproveedor
				}
		,	
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			
			if(json['agrupacion']=='rubro'){
				mostrarDetalleRubros(json,json['div']); 
				detalleRubros[json['idsucursal']]=json;
			}else{
				mostrarDetalleArticulos(json,json['div']);
				detalleArticulos[json['idsucursal']]=json;
			}
			
			$('#reporteCompleto').removeClass('divBuscandoInformacion');
			
		},
		error : function() {
			$('#reporteValorizacionSucursal').removeClass('divBuscandoInformacion');
			$('#divResultado').html("Error al obtener los datos. Pagina inexistente");

		}	
	});		
}
function ordenarArticulosPorPorcentaje(idsucursal){
	
	lista = detalleArticulos[idsucursal];
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	datos = lista['datos'];
	
	if (lista['ordenPorcentaje']==1){
		lista['ordenPorcentaje']=-1;
	}else{
		lista['ordenPorcentaje']=1;
	}
	datos = _.sortBy(datos, function(fila){ 
								return parseFloat(fila['porcentaje']) * parseFloat(lista['ordenPorcentaje']); 
					});
	lista['datos'] = datos;
	mostrarDetalleArticulos(lista,lista['div']);
	detalleArticulos[idsucursal]=lista;
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}
function ordenarArticulosPorImporte(idsucursal){
	
	lista = detalleArticulos[idsucursal];
	$('#'+lista['div']).addClass('divBuscandoInformacion');
	datos = lista['datos'];
	
	if (lista['ordenImporte']==1){
		lista['ordenImporte']=-1;
	}else{
		lista['ordenImporte']=1;
	}
	datos = _.sortBy(datos, function(fila){ 
								return parseFloat(fila['revalorizacion']) * parseFloat(lista['ordenImporte']); 
					});
	lista['datos'] = datos;
	mostrarDetalleArticulos(lista,lista['div']);
	detalleArticulos[idsucursal]=lista;
	
	$('#'+lista['div']).removeClass('divBuscandoInformacion');
	
}

function mostrarComprasRealizadas(idsucursal,idarticulo,idproveedor,iddesde,idhasta,div,codigoArticulo){
	$('#'+div).addClass('divBuscandoInformacion');
	$.ajax({
		url : 'ajaxRevalorizacionSucursalCompras.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'idsucursal':idsucursal,
				'idarticulo':idarticulo,
				'idproveedor':idproveedor,
				'iddesde':iddesde,
				'idhasta':idhasta,
				'codigoArticulo':codigoArticulo,
				'div':div
				}
		,	
		success : function(resultado) {
			json = $.parseJSON(resultado);
			mostrarDetalleDeCompras(json,json['div']);
			
			$('#'+div).removeClass('divBuscandoInformacion');
		},
		error : function() {
			$('#'+div).removeClass('divBuscandoInformacion');
			$('#'+div).html("Error al obtener los datos. Pagina inexistente");

		}	
	});		
}

function seleccionoSucursal(idsucursal){
	if( $('#selector'+idsucursal).prop('checked') ) {
		$('#divSucursalValorizacion'+idsucursal).addClass('revSucDivContenedorSucursalFilaSeleccionada');
	}else{
		$('#divSucursalValorizacion'+idsucursal).removeClass('revSucDivContenedorSucursalFilaSeleccionada');
		
	}
	sumarSeleccion();
}
function seleccionarTodasLasSucursales(){
	tSuc = $("#totalSucursales").val(); 
		
	for(c=0; c < tSuc;c++){
		if( $('#chkSeleccionarTodos').prop('checked') ) {
			$('input[name=selector'+c+']').prop("checked", "checked");
		}else{
			$('input[name=selector'+c+']').prop("checked", "");
		}
		seleccionoSucursal($('#idSucursal'+c).val() );
	}
	sumarSeleccion();
}
function sumarSeleccion(){
	totalS = $("#totalSucursales").val();
	totalI = 0;
	for(i=0; i < totalS; i++){
		if($('input[name=selector'+i+']').prop('checked')){
			totalI = totalI + parseFloat($("#importeRevalorizar"+i).val());
		}
	}
	$("#divTotalRevalorizacion").html("$"+formatearPrecio(totalI));
	return formatearPrecio(totalI);
}
function verOtrasCompras(codigo,idSucursal){
	
	$("#frmVerOtrasCompras input[name=inpIdSucursalSel]").val(idSucursal);
	$("#frmVerOtrasCompras input[name=inpArticuloCodigo]").val(codigo);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptcompras';
	
	$('#frmVerOtrasCompras').attr('action',action);
	$("#frmVerOtrasCompras" ).submit();	
}
function revlorizar(){
	suma = sumarSeleccion();
	if(suma==0){
		alert("No hay importes para revalorizar.");
		return;
		
	}
	if(confirm("Se valorizaran "+suma+". ¿Desea continuar?")){
		$("#frmNuevaRendicion" ).submit();			
	}
}

function ordenarArticulosPorArticulos(idsucursal){
	
	lista = detalleArticulos[idsucursal];
	$('#'+lista['div']).addClass('divBuscandoInformacion');
	
	datos = lista['datos'];
	
	datos = _.sortBy(datos, function(fila){ 
								return fila['nombre']; 
					});
	lista['datos'] = datos;
	mostrarDetalleArticulos(lista,lista['div']);
	
	$('#'+lista['div']).removeClass('divBuscandoInformacion');
}

function ordenarRubrosPorRubro(idsucursal){
	
	lista = detalleRubros[idsucursal];
	$('#'+lista['div']).addClass('divBuscandoInformacion');
	
	datos = lista['datos'];
	
	datos = _.sortBy(datos, function(fila){ 
								return fila['rubroNombre']; 
					});
	lista['datos'] = datos;
	
	mostrarDetalleRubros(lista,lista['div']);
	
	$('#'+lista['div']).removeClass('divBuscandoInformacion');
}
function ordenarRubrosPorProveedor(idsucursal){
	
	lista = detalleRubros[idsucursal];
	$('#'+lista['div']).addClass('divBuscandoInformacion');
	
	datos = lista['datos'];
	
	datos = _.sortBy(datos, function(fila){ 
								return fila['proveedorNombre']; 
					});
	lista['datos'] = datos;
	
	mostrarDetalleRubros(lista,lista['div']);
	
	$('#'+lista['div']).removeClass('divBuscandoInformacion');
}
function ordenarRubrosPorImporte(idsucursal){
	
	lista = detalleRubros[idsucursal];
	$('#'+lista['div']).addClass('divBuscandoInformacion');
	datos = lista['datos'];
	
	if (lista['ordenImporte']==1){
		lista['ordenImporte']=-1;
	}else{
		lista['ordenImporte']=1;
	}
	datos = _.sortBy(datos, function(fila){ 
								return parseFloat(fila['revalorizacion']) * parseFloat(lista['ordenImporte']); 
					});
	lista['datos'] = datos;
	mostrarDetalleRubros(lista,lista['div']);
	detalleRubros[idsucursal]=lista;
	
	$('#'+lista['div']).removeClass('divBuscandoInformacion');
	
}
function ordenarRubrosPorPorcentaje(idsucursal){
	
	lista = detalleRubros[idsucursal];
	$('#'+lista['div']).addClass('divBuscandoInformacion');
	datos = lista['datos'];
	
	if (lista['ordenPorcentaje']==1){
		lista['ordenPorcentaje']=-1;
	}else{
		lista['ordenPorcentaje']=1;
	}
	datos = _.sortBy(datos, function(fila){ 
								return parseFloat(fila['porcentaje']) * parseFloat(lista['ordenPorcentaje']); 
					});
	lista['datos'] = datos;
	mostrarDetalleRubros(lista,lista['div']);
	detalleRubros[idsucursal]=lista;
	
	$('#'+lista['div']).removeClass('divBuscandoInformacion');
	
}
function configuracionRevalorizacionSucursalVolver(){
	$("#frmVolverRevalorizar" ).submit();
	
}