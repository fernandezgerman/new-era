function inicioAbrirLiquidacion(){
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=admprdsctblsadd';
	
	$('#frmAgregar').attr('action',action);
	$("#frmAgregar" ).submit();	
	
}
function guardarPeriodo(){
	if($("#inpDescripcion" ).val()==""){
		alert("Debe ingresar una descripcion");
		return;
	}
	
	$("#frm" ).submit();		
	
}
function volverAlListado(){
	$("#frm" ).submit();
}
function mostrarLiquidacionPeriodoLista(resultado){
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateLiquidacionesPeriodosLista" ).html()
        );
    $( "#divResultado" ).html(
            template(resultado)
        );  
    
}
function buscarLiquidacionPeriodos(){
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$.ajax({
		url : 'ajaxLiquidacionPeriodoLista.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'filtroFechaHasta':$('#inpFechaHasta').val(),
				'filtroFechaDesde':$('#inpFechaDesde').val(),
				'filtroIdLiquidacionPeriodo':$('#inpPeriodoId').val()
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			mostrarLiquidacionPeriodoLista(json);

			$('#reporteCompleto').removeClass('divBuscandoInformacion');
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});
	
}
function editarLiquidacionPeriodo(idPeriodo){
	$("#inpLiquidacionPerioId" ).val(idPeriodo);
	$("#frmEditarPeriodo" ).submit();		
	
}