
function sumarDiaAFecha(days){
    milisegundos=parseInt(35*24*60*60*1000);
 
    fecha=new Date();
    day=fecha.getDate();
    // el mes es devuelto entre 0 y 11
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
  
    //Obtenemos los milisegundos desde media noche del 1/1/1970
    tiempo=fecha.getTime();
    //Calculamos los milisegundos sobre la fecha que hay que sumar o restar...
    milisegundos=parseInt(days*24*60*60*1000);
    //Modificamos la fecha actual
    total=fecha.setTime(tiempo+milisegundos);
    day=fecha.getDate();
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
 
    return day+"/"+month+"/"+year;
}

$(document).ready(function() {
	
	idSucursal = $('#inpSucursalDescripcionId').val();
	
	var f = new Date()
	
	fechaHasta = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
	fechaDesde = sumarDiaAFecha(-15) ;
	
	cargarAjaxGenericoJson("ajaxSucursalesDescripcion.php",{'sucursalId':idSucursal} ,"resultado","templateEncabezado","divEncabezado");
	cargarAjaxGenericoJson("ajaxSucursalesDescripcionUsuarios.php",{'sucursalId':idSucursal} ,"resultado","templatePersonal","divPersonal");
	cargarAjaxGenericoJson("ajaxSucursalDetalleArreglosStock.php",{'sucursalId':idSucursal,'fechaDesde': fechaDesde,'fechaHasta':fechaHasta} ,"resultado","templateArreglosDeStock","divArreglosDeStock");
	cargarAjaxGenericoJson("ajaxSucursalDetalleConsumos.php",{'sucursalId':idSucursal,'fechaDesde': fechaDesde,'fechaHasta':fechaHasta},"resultado","templateConsumos","divConsumos");
	cargarAjaxGenericoJson("ajaxSucursalesDetalleValorizacion.php",{'sucursalId':idSucursal},"resultado","templateValorizacion","divValorizacion");
	cargarAjaxGenericoJson("ajaxSucursalesDetalleVentas.php",{'sucursalId':idSucursal,'fechaDesde': fechaDesde,'fechaHasta':fechaHasta},"resultado","templateVentas","divVentas"); 
	cargarAjaxGenericoJson("ajaxSucursalesDetalleListas.php",{'sucursalId':idSucursal},"resultado","templatePrecios","divPrecios");
	
	
});
function recargarArreglosDeStock(){
	idSucursal = $('#inpSucursalDescripcionId').val();
	if($('#inpArreglosFechaDesde').val()=="" || $('#inpArreglosFechaHasta').val() == ""){
		alert('Debe ingresar ambas fechas.');
		return;
	}
	cargarAjaxGenericoJson("ajaxSucursalDetalleArreglosStock.php",{'sucursalId':idSucursal,'fechaDesde': $('#inpArreglosFechaDesde').val() ,'fechaHasta':$('#inpArreglosFechaHasta').val()} ,"resultado","templateArreglosDeStock","divArreglosDeStock");	
}
function recargarVentas(){
	idSucursal = $('#inpSucursalDescripcionId').val();

	if($('#inpVentasFechaDesde').val()=="" || $('#inpVentasFechaHasta').val() == ""){
		alert('Debe ingresar ambas fechas.');
		return;
	}	
	
	cargarAjaxGenericoJson("ajaxSucursalesDetalleVentas.php",{'sucursalId':idSucursal,'fechaDesde': $('#inpVentasFechaDesde').val() ,'fechaHasta':$('#inpVentasFechaHasta').val()} ,"resultado","templateVentas","divVentas");	
}
function recargarConsumos(){
	idSucursal = $('#inpSucursalDescripcionId').val();

	if($('#inpConsumosFechaDesde').val()=="" || $('#inpConsumosFechaHasta').val() == ""){
		alert('Debe ingresar ambas fechas.');
		return;
	}	
	
	cargarAjaxGenericoJson("ajaxSucursalDetalleConsumos.php",{'sucursalId':idSucursal,'fechaDesde': $('#inpConsumosFechaDesde').val() ,'fechaHasta':$('#inpConsumosFechaHasta').val()} ,"resultado","templateConsumos","divConsumos");	
}
function verDetalleArreglosDeStock(fecha){
	
	$("#frmVerDetalleArreglosDeStock input[name=filtroSucursalesTodas]").val($('#inpSucursalDescripcionId').val());	
	$("#frmVerDetalleArreglosDeStock input[name=inpFechaDesde]").val(fecha);
	$("#frmVerDetalleArreglosDeStock input[name=inpFechaHasta]").val(fecha);
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=renstockrep';
	
	$('#frmVerDetalleArreglosDeStock').attr('action',action);
	$("#frmVerDetalleArreglosDeStock" ).submit();	
	
	
}


function verDetallePromociones(idpromocion){
	

	$("#frmPromociones input[name=id]").val(idpromocion);
	$("#frmPromociones input[name=token]").val($('#mToken').val());
	

	action = 'principal.php';
	
	$('#frmPromociones').attr('action',action);
	$("#frmPromociones" ).submit();	
	
	
}

function verDetalleConsumo(fechaDesde,fechaHasta,usuarioId){
	
	$("#frmVerDetalleConsumos input[name=filtroSucursalesTodas]").val($('#inpSucursalDescripcionId').val());	
	$("#frmVerDetalleConsumos input[name=inpFechaDesde]").val(fechaDesde);
	$("#frmVerDetalleConsumos input[name=inpFechaHasta]").val(fechaHasta);
	$("#frmVerDetalleConsumos input[name=inpUsuarioId]").val(usuarioId);
	$("#frmVerDetalleConsumos input[name=inpSucursalId]").val($('#inpSucursalDescripcionId').val());

	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptvtsdescdtlle';
	
	$('#frmVerDetalleConsumos').attr('action',action);
	$("#frmVerDetalleConsumos" ).submit();	
	
	
}

function verDetalleVentas(fecha){
	
	$("#frmVerDetalleVentas input[name=inpSucursales]").val($('#inpSucursalDescripcionId').val());	
	$("#frmVerDetalleVentas input[name=inpFechaDesde]").val(fecha);
	$("#frmVerDetalleVentas input[name=inpFechaHasta]").val(fecha);
	$("#frmVerDetalleVentas input[name=token]").val($('#mToken').val());
	$("#frmVerDetalleVentas input[name=pagina]").val('rptsvtsagrrbr');	

	
	action = 'principal.php';
	
	$('#frmVerDetalleVentas').attr('action',action);
	$("#frmVerDetalleVentas" ).submit();	
	
	
}
/*
function cargarAjaxGenerico(idSucursal){
	$.ajax({
		url : 'ajaxSucursalesDescripcion.php?token='+$('#mToken').val(),
		type : 'POST',datatype : 'json',async : true,
		data : {'sucursalId': idSucursal},
		success : function(resultado) {
			json = $.parseJSON(resultado);
			mostrarTemplateGeneral(json,"resultado","templateEncabezado","divEncabezado");
		},
		error : function() { alert('error al obtener los registros'); }	
	});	
}

function mostrarDetalleLiquidacion(idLiquidacion,div){
	
	$.ajax({
		url : 'ajaxLiquidacionesGrilla.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'periodoId':"",
				'liquidacionId':idLiquidacion,
				'fechaHasta':"",
				'fechaDesde':""
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			datosReporte = json;
			if(datosReporte["error"]==1){
				alert(datosReporte["mensajeError"]);
			}else{
				_.templateSettings.variable = "liquidacion";
				
			    var template = _.template(
			            $( "#templateLiquidacionesListaDetalle2" ).html()
			        );
			    liquidaciones = json['liquidaciones'];
			    liq = liquidaciones[0];
			    liq['indice'] = 0; 
			    $( "#"+div ).html(
			            template(liq)
			        );				
			}
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});	
}*/
