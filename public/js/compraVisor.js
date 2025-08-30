var datosReporte = Array();
function mostrarDetalleLiquidacion(idLiquidacion){
	
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
			    $( "#divResultado" ).html(
			            template(liq)
			        );				
			}
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});	
}


function editarLiquidacion(idLiquidacionDetalle,idLiquidacion){
	$( "#inpLiquidacionId").val(idLiquidacion);
	$( "#inpLiquidacionDetalleId").val(idLiquidacionDetalle);
	
	$("#frmLiquidacionEditar" ).submit();
}
function cerrarDetalleLiquidacion(indice){
	$( "#detalleLiquidacion"+indice ).html("");
}
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
    $( "#detalleLiquidacionCON"+indiceDetalle ).html(
            template(detalle)
        );  	
	
}
