var perfiles = Array();
var datosReporte = Array();
function mostrarResultados(resultado) {
	_.templateSettings.variable = "resultado";

	var template = _.template($("#templateBalanceTotalSucursal").html());
	$("#divResultado").html(
			template(resultado) + '<br />' + $("#divResultado").html());
}

$(document).ready(function() {
	if (showResult){
		mostrarResultados(datosReporte);	
	}
	
});
function buscarDatos(){
	if ($("#inpFechaDesde").val()==""){
		alert('Debe ingresar una fecha desde.');
		return;
	}
	if ($("#inpFechaHasta").val()==""){
		alert('Debe ingresar una fecha hasta.');
		return;
	}	
	
	$("#frm" ).submit();		
}
function verDetalleVentas(idsucursal){
	
	
	$("#formRentabilidadVentas input[name=inpSucursalBalance]").val(idsucursal);
	$("#formRentabilidadVentas input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptvspr';
	
	$('#formRentabilidadVentas').attr('action',action);
	$("#formRentabilidadVentas" ).submit();	
}
function verDetalleGastos(idsucursal){
	
	$("#formGastos input[name=inpIdSucursalSel]").val(idsucursal);
	$("#formGastos input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptcompras';
	
	$('#formGastos').attr('action',action);
	$("#formGastos" ).submit();	
}
function verDetalleArreglosStock(idsucursal){
	$("#formRentControlesDeStock input[name=inpSucursalBalance]").val(idsucursal);	
	$("#formRentControlesDeStock input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptbalsuc';
	
	$('#formRentControlesDeStock').attr('action',action);
	$("#formRentControlesDeStock" ).submit();	
}
function verDetalleSobrantes(idsucursal){
	$("#formRentSobrantes input[name=inpSucursalBalance]").val(idsucursal);	
	$("#formRentSobrantes input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptbalsuc';
	
	$('#formRentSobrantes').attr('action',action);
	$("#formRentSobrantes" ).submit();	
}
function verDetalleMovimientosStock(idsucursal){
	$("#formMovimientosDeStock input[name=inpSucursalIdUnico]").val(idsucursal);	
	$("#formMovimientosDeStock input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptstckbjs';
	
	$('#formMovimientosDeStock').attr('action',action);
	$("#formMovimientosDeStock" ).submit();	
}
function cargarPerfilesYUsuarios(idSucursal){
	
	
  $.ajax({
	  url: 'ajaxDescripcionSucursalPerfiles.php?token='+document.getElementById('mToken').value,
	  type: 'POST',
	  datatype :'json',
	  async: true,
	  data: {
		     'idSucursal': idSucursal
		     
		     },
	  success: function(resultado){

		  		perfiles = $.parseJSON(resultado);
		  		
		  		
			},
		  error: function(){
				alert('Error al cargar los datos.') ;
				
			}
		});	
}
