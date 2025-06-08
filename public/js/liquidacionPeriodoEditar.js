var resultadoPeriodos = Array();
var liquidacionPorSucursal = Array();
var datosPorSucursal;
function mostrarCabeceraPeriodo(idPeriodo){
	periodoId = idPeriodo;
	$.ajax({
		url : 'ajaxLiquidacionPeriodoLista.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'filtroIdLiquidacionPeriodo':idPeriodo,
				'detallarLiquidaciones':1,
				'detallarGastos':1,
				'detallarRevalorizacionesDeSucursal':1,
				'detallarTotalesPorSucursal':1,
				'detallarPagos':1
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			resultadoPeriodos = json;
			
			_.templateSettings.variable = "resultado";

			var template = _.template($("#templateLiquidacionesPeriodosEditarCabecera").html());
			$("#divCabeceraPeriodo").html(
					template(json));
			
			_.templateSettings.variable = "resultado";
			var template = _.template($("#templateLiquidacionesPeriodosResumenPorSucursal").html());
			$("#divDetallePorSucursal").html(
					template(resultadoPeriodos));			

		},
		error : function() {
			alert('error al obtener los registros');
		}	
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
}
/*
function mostrarDetalleLiquidacion(indiceLiquidacion,div){
	
	
	_.templateSettings.variable = "liquidacion";
	
    var template = _.template(
            $( "#templateLiquidacionesListaDetalle2" ).html()
        );
    $periodos = resultadoPeriodos['periodos'];
    $periodo = $periodos[0];
    $liquidaciones = $periodo['liquidaciones'];
    $liquidacion = $liquidaciones [indiceLiquidacion];
    $liquidacion['indice'] = indiceLiquidacion;
    indiceLiquidacion
    $( "#"+div ).html(
            template($liquidacion)
        );				
	
}*/
function mostrarDetalleGastos(json){
	_.templateSettings.variable = "resultado";

	var template = _.template($("#templateLiquidacionesPeriodosEditarGastosPorRubro").html());
	$("#divLeGastos").html(
			template(resultadoPeriodos));
	
}
function mostrarDetallePorSucursal(json){
	_.templateSettings.variable = "resultado";

	var template = _.template($("#templateLiquidacionesPeriodosEditarGastosPorRubro").html());
	$("#divLeGastos").html(
			template(resultadoPeriodos));
	
}

function mostrarDetalleGastosAgrupadoArt(idperiodo,idrubro,contenedor,idsucursal){
	
	$.ajax({
		url : 'ajaxLiquidacionPeriodoListaDetalleGastosPorArt.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'idperiodo':idperiodo,
				'idrubro':idrubro,
				'contenedor':contenedor,
				'idsucursal':idsucursal
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			
			if(json["error"]==1){
				alert(json["mensajeError"]);
			}else{
				_.templateSettings.variable = "resultado";
				
			    var template = _.template(
			            $( "#templateLiquidacionesPeriodosEditarGastosPorArticulo" ).html()
			        );

			    $( "#"+json['contenedor']).html(
			            template(json)
			        );				
			}
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});	
}
function mostrarDetalleGastosPorSucursal(idperiodo,idsucursal,contenedor){
	
	$.ajax({
		url : 'ajaxLiquidacionPeriodoLista.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'filtroIdLiquidacionPeriodo':idperiodo,
				'idsucursal':idsucursal,
				'detallarGastos':1,
				'contenedor':contenedor
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			
			if(json["error"]==1){
				alert(json["mensajeError"]);
			}else{
				
				_.templateSettings.variable = "resultado";

				var template = _.template($("#templateLiquidacionesPeriodosEditarGastosPorRubro").html());
				
			    $( "#"+json['contenedor']).html(
			            template(json)
			        );				
			}
		},
		error : function() {
			alert('error al obtener los registros');
		}	
	});	
}
function mostrarDetalleGastosDesAgrupado(idperiodo,idarticulo,contenedor,idsucursal){
	
	$.ajax({
		url : 'ajaxLiquidacionPeriodoListaDetalleGastos.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'idperiodo':idperiodo,
				'idarticulo':idarticulo,
				'contenedor':contenedor,
				'idsucursal':idsucursal
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			
			if(json["error"]==1){
				alert(json["mensajeError"]);
			}else{
				_.templateSettings.variable = "resultado";
				
			    var template = _.template(
			            $( "#templateLiquidacionesPeriodosEditarGastos" ).html()
			        );

			    $( "#"+json['contenedor']).html(
			            template(json)
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
	
}*/
function mostrarDivCerrarLiquidacion(){
	_.templateSettings.variable = "resultado";
	
	var template = _.template($("#templateLiquidacionesPeriodosEditarCerrarPeriodo").html());
	$("#idCerrarLiquidacion").html(
			template(resultadoPeriodos));
	
}
function cancelarCerrarPeriodo(){
	$("#idCerrarLiquidacion").html("");	
}
function calcularImporteSigCaja(){
	$("#inpImporteDivision").val(formatearPrecio($("#inpImporteDivision").val()))
	recaudado = parseFloat($("#inpTotalRecaudado").val());
	inicial = parseFloat(0 + recaudado) - parseFloat(0 + parseFloat($("#inpImporteDivision").val()));



	$("#divInicialProximoPeriodo").html(formatearPrecio(inicial));
	
}
function validarDivision(){
	mensaje = "ATENCION! Esta a punto de cerrar el periodo. Los importes quedaran: \n" +
			  " - a dividir: " + formatearPrecio($("#inpImporteDivision").val()) + "\n" +			  
			  " - caja inicial: " + $("#divInicialProximoPeriodo").html() + 
			  "\n \n                       ¿Desea continuar? ";
	if(confirm(mensaje)){
		action = 'principal.php?token='+$('#mToken').val()+'&pagina=admprdsctblseditsave';
		
		$('#frmCerrarPeriodo').attr('action',action);
		$("#frmCerrarPeriodo" ).submit();
	}
			  
			 
}
function ordenarRubrosCostoSucursal(subreporte){
	contenedorResultado = contenedorDeResultados[subreporte];
	
	lista = contenedorResultado['registros'];
	filtros = contenedorResultado['filtros'];
	cont = filtros['contenedor'];	
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	
	
	if (contenedorResultado['ordenCostoSucursal']==1){
		contenedorResultado['ordenCostoSucursal']=-1;
	}else{
		contenedorResultado['ordenCostoSucursal']=1;
	}
	lista = _.sortBy(lista, function(fila){ 
		return parseFloat(fila['costosucursal'])*contenedorResultado['ordenCostoSucursal']; 
		});
	contenedorResultado['registros'] = lista ;
	contenedorDeResultados[subreporte] = contenedorResultado;
	_.templateSettings.variable = "resultados";
	
    var template = _.template($( "#"+contenedorResultado['template'] ).html());
    $( "#"+cont ).html(template(contenedorResultado));
    
	$('#reporteCompleto').removeClass('divBuscandoInformacion');
	
}
function cerrarDetalle(contenedor){
	$('#'+contenedor).html("");	
}
function ordenarListaPorNombre(){

	periodos = resultadoPeriodos['periodos'];
	periodo = periodos[0]; 
	registros = periodo['resultadosPorSucursal'];

	
	lista = _.sortBy(registros, function(fila){ 
		return fila['nombre']; 
		});	
	 
	periodo['resultadosPorSucursal'] = lista;
	periodos[0] = periodo;
	resultadoPeriodos['periodos'] = periodos;
	
	_.templateSettings.variable = "resultado";
	var template = _.template($("#templateLiquidacionesPeriodosResumenPorSucursal").html());
	$("#divDetallePorSucursal").html(
			template(resultadoPeriodos));
}
function ordenarListaPorRecaudado(){
	
	periodos = resultadoPeriodos['periodos'];
	periodo = periodos[0]; 
	registros = periodo['resultadosPorSucursal'];

	if (resultadoPeriodos['ordenRecaudado']==1){
		resultadoPeriodos['ordenRecaudado']=-1;
	}else{
		resultadoPeriodos['ordenRecaudado']=1;
	}	
	
	lista = _.sortBy(registros, function(fila){ 
		return parseFloat(fila['importeLiquidaciones']) * parseFloat(resultadoPeriodos['ordenRecaudado']); 
		});	
	 
	periodo['resultadosPorSucursal'] = lista;
	periodos[0] = periodo;
	resultadoPeriodos['periodos'] = periodos;
	
	_.templateSettings.variable = "resultado";
	var template = _.template($("#templateLiquidacionesPeriodosResumenPorSucursal").html());
	$("#divDetallePorSucursal").html(
			template(resultadoPeriodos));
	
	
}
function ordenarListaPorGastos(){
	
	periodos = resultadoPeriodos['periodos'];
	periodo = periodos[0]; 
	registros = periodo['resultadosPorSucursal'];

	if (resultadoPeriodos['ordenGastos']==1){
		resultadoPeriodos['ordenGastos']=-1;
	}else{
		resultadoPeriodos['ordenGastos']=1;
	}	
	
	lista = _.sortBy(registros, function(fila){ 
		return parseFloat(fila['importeGastos']) * parseFloat(resultadoPeriodos['ordenGastos']); 
		});	
	 
	periodo['resultadosPorSucursal'] = lista;
	periodos[0] = periodo;
	resultadoPeriodos['periodos'] = periodos;
	
	_.templateSettings.variable = "resultado";
	var template = _.template($("#templateLiquidacionesPeriodosResumenPorSucursal").html());
	$("#divDetallePorSucursal").html(
			template(resultadoPeriodos));
		
	
}
function ordenarListaPorSaldo(){
	
	periodos = resultadoPeriodos['periodos'];
	periodo = periodos[0]; 
	registros = periodo['resultadosPorSucursal'];

	if (resultadoPeriodos['ordenSaldo']==1){
		resultadoPeriodos['ordenSaldo']=-1;
	}else{
		resultadoPeriodos['ordenSaldo']=1;
	}	
	
	lista = _.sortBy(registros, function(fila){ 
		return parseFloat((fila['importeGastos']) - parseFloat(fila['importeLiquidaciones']) )* parseFloat(resultadoPeriodos['ordenSaldo']); 
		});	
	 
	periodo['resultadosPorSucursal'] = lista;
	periodos[0] = periodo;
	resultadoPeriodos['periodos'] = periodos;
	
	_.templateSettings.variable = "resultado";
	var template = _.template($("#templateLiquidacionesPeriodosResumenPorSucursal").html());
	$("#divDetallePorSucursal").html(
			template(resultadoPeriodos));
			
}

function mostrarDetalleSucursalLiquidaciones(idsucursal,idperiodo,div)
{
    url = 'ajaxLiquidacionesDeSucursal.php';
    data = {'sucursalId':idsucursal,'periodoId':idperiodo,'contenedor':div};
    variable ='resultado';
    template = 'templateLiquidacionesPeriodosResumenPorSucursalLiq';
    divResultado = div;
    extra = false;

    callback = 'cargarDatosPS(json)';
    cargarAjaxGenericoJson(url, data, variable, template, divResultado,extra,callback);
}
function cargarDatosPS(datosPS)
{
    datosPorSucursal = datosPS;
}
function mostrarDetalleConceptoPorSucursal(indiceLiquidacion,indiceDetalle){

    detalles = datosPorSucursal['detalles'];
    detalle = detalles[indiceDetalle];
    conceptos = detalle['conceptos'];
    conceptos['indice'] = indiceDetalle;
    detalle['conceptos'] = conceptos;

    if(parseInt(detalle['planillaLiquidacionId'])> 0 && parseInt(detalle['idestadoaudicion']) == 1 ) {

        url = 'ajaxLiquidacionPlanillaDatos.php';
        data = {'inpPlanillaLiquidacionId':detalle['planillaLiquidacionId']};
        variable  = 'datos';
        template = 'templateLiquidacionesPlanillaVisor';
        divResultado = "detalleLiquidacionCON"+detalle['id'];
        extra = {'indice':detalle['id']};
        callback = 'carg' +
            'arDatos(json)';

        cargarAjaxGenericoJson(url, data, variable, template, divResultado, extra, callback);

    }else{
        _.templateSettings.variable = "detalleLiquidacion";

        var template = _.template(
            $( "#templateLiquidacionesListaDetalleConcepto" ).html()
        );
        $( "#detalleLiquidacionCON"+detalle['id'] ).html(
            template(detalle)
        );
    }

}
