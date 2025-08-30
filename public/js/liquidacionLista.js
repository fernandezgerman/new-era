var datosReporte = Array();
function mostrarLiquidacionLista(resultado){
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateLiquidacionesLista" ).html()
        );
    $( "#divResultado" ).html(
            template(resultado)
        );  
    
}
function buscarLiquidaciones(){
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$.ajax({
		url : 'ajaxLiquidacionesGrilla.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'periodoId':$('#inpPeriodoId').val(),
				'liquidacionId':"",
				'fechaHasta':$('#inpFechaHasta').val(),
				'fechaDesde':$('#inpFechaDesde').val()
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			datosReporte = json;
			mostrarLiquidacionLista(json);
				
			$('#reporteCompleto').removeClass('divBuscandoInformacion');
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});
	
}

function mostrarDetalleLiquidacion(indice,idLiquidacion){
	liquidaciones = datosReporte['liquidaciones'];
	liquidacion = liquidaciones[indice];
	liquidacion['indice'] = indice;

	_.templateSettings.variable = "liquidacion";
	
    var template = _.template(
            $( "#templateLiquidacionesListaDetalle2" ).html()
        );
    $( "#detalleLiquidacion"+idLiquidacion ).html(
            template(liquidacion)
        );	
	
	
}
function cerrarDetalleLiquidacion(indice){
	$( "#detalleLiquidacion"+indice ).html("");
}
/*
function mostrarDetalleConcepto(indiceLiquidacion,indiceDetalle){
	liquidaciones = datosReporte['liquidaciones'];
	liquidacion = liquidaciones[indiceLiquidacion];
	detalles = liquidacion['detalles'];
	detalle = detalles[indiceDetalle];
	conceptos = detalle['conceptos']; 
	conceptos['indice'] = indiceDetalle;
	detalle['conceptos'] = conceptos;
	
	_.templateSettings.variable = "detalleLiquidacion";
	
    var template = _.template(
            $( "#templateLiquidacionesListaDetalleConcepto" ).html()
        );
    $( "#detalleLiquidacionCON"+detalle['id'] ).html(
            template(detalle)
        );  	
	
}
*/