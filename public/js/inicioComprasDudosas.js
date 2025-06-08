var comprasDudosas = Array();
var guardandoDuda = false;
function cargarComprasDudosas(dat) {
	_.templateSettings.variable = "datos";

	var template = _.template($("#templateComprasDudosasPlural").html());
	$("#divComprasDudosasGeneral").html(template(dat));

}
$(document).ready(function(){
	cargarComprasDudosas(comprasDudosas);
});

function mostrarDescripcionExtra(indice) {
    filas = comprasDudosas['compras'];
    fila = filas[indice];
    fila['contenedor'] = "icdIdDescripcionExtra" + indice;
    _.templateSettings.variable = "fila";

    if (fila['idcompradetallecomparacion']) {
        var template = _.template($("#templateComprasDudosasSingularNuevo").html());
    } else{

    	var template = _.template($("#templateComprasDudosasSingular").html());
	}

	$("#icdIdDescripcionExtra"+indice).html(template(fila));	
}
function cerrarDetalleDeCompras(div){
	$("#"+div).html("");
}
function icdBuscarInfo()
{
	if($('#icdFiltroFechaDesde').val()==""){
		alert("Debe ingresar una fecha desde").
		return;
	}
	if($('#icdFiltroFechaHasta').val()==""){
		alert("Debe ingresar una fecha hasta").
		return;
	}	
	
	$('#divComprasDudosasGeneral').addClass('divBuscandoInformacion');
  $.ajax({
	  url: 'ajaxComprasDudosasLista.php?token='+document.getElementById('mToken').value,
	  type: 'POST',
	  datatype :'json',
	  async: true,
	  data: {
		     'fechaDesde': $('#icdFiltroFechaDesde').val(),
		     'fechaHasta': $('#icdFiltroFechaHasta').val(),
		     'audicionTipoDuda': $('#icdAudicionTipoDuda').val()
		     },
	  success: function(resultado){
		  		comprasDudosas = $.parseJSON(resultado);
		  		cargarComprasDudosas(comprasDudosas);
		  		$('#divComprasDudosasGeneral').removeClass('divBuscandoInformacion');
			},
		  error: function(){
				alert('Error al cargar los datos.') ;
				$('#divComprasDudosasGeneral').removeClass('divBuscandoInformacion');
			}
		});
}
function verOtrasCompras(codigo,idSucursal){
	
	$("#frmVerOtrasCompras input[name=inpIdSucursalSel]").val(idSucursal);
	$("#frmVerOtrasCompras input[name=inpArticuloCodigo]").val(codigo);
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptcompras';
	
	$('#frmVerOtrasCompras').attr('action',action);
	$("#frmVerOtrasCompras" ).submit();	
}
function icdAuditarComprasDudosas(){
	_.templateSettings.variable = "datos";

	var template = _.template($("#templateComprasDudosasAuditar").html());
	$("#icdDivAudicion").html(template(comprasDudosas));

}
function icdCancelarAudicion(){
	$("#icdDivAudicion").html("");
}
function strIdsDetalles(){
	strs = ',';
	for(i=0; i < comprasDudosas['totalComprasDudosas'];i++){
		if ($('#inpIcdSelector'+i).is(':checked')){
			strs =strs + $('#inpIcdSelector'+i).val()+',';
		}
	}
	if (strs == ','){
		return false;
	}else{
		return strs;
	}
} 
function icdGuardarAudicion(){
	
	if(guardandoDuda){
		alert("Aguarde!");
		return;
	}	
	if($('#icdAudicionMotivos').val()=="0"){
		alert("Debe seleccionar un motivo");
		return;
	}
	if (!strIdsDetalles()){
		alert("Debe seleccionar alguna factura para auditar.");
		return;		
	}
	if($('#icdFiltroFechaHasta').val()==""){
		alert("Debe ingresar una fecha hasta");
		return;
	}	
	if($('#icdFiltroFechaDesde').val()==""){
		alert("Debe ingresar una fecha desde");
		return;
	}	
	guardandoDuda = true;
	
	
	$('#divComprasDudosasGeneral').addClass('divBuscandoInformacion');
	  $.ajax({
		  url: 'ajaxComprasDudosasLista.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {
			     'fechaDesde': $('#icdFiltroFechaDesde').val(),
			     'fechaHasta': $('#icdFiltroFechaHasta').val(),
			     'icdAuditarMotivo': $('#icdAudicionMotivos').val(),
			     'icdAuditarObservaciones': $('#icdAudicionObservaciones').val(),
			     'icdAuditarDetalles': strIdsDetalles(),
			     'icdAuditar':1
			     },
			     
		  success: function(resultado){
			  		
			  		comprasDudosas = $.parseJSON(resultado);
			  		cargarComprasDudosas(comprasDudosas);
			  		$('#divComprasDudosasGeneral').removeClass('divBuscandoInformacion');
			  		guardandoDuda = false;
				},
			  error: function(){
					alert('Error al cargar los datos.') ;
					$('#divComprasDudosasGeneral').removeClass('divBuscandoInformacion');
					guardandoDuda = false;
				}
			});
}