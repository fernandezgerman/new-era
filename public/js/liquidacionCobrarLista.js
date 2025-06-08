var datosReporte = Array();
var datosPlanillaLiq = Array();
var liquidacionEnEdicion = Array();
var idLiquidacionACobrar;

function mostrarDetalleLiquidacion(idLiquidacion){
    idLiquidacionACobrar = idLiquidacion;
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
function cancelarCobroLiquidacion(idLiquidacionDetalle){
	if(confirm("Está seguro que desea cancelar el cobro?"))
	{
		
		$.ajax({
			url : 'ajaxLiquidacionCancelar.php?token='+$('#mToken').val(),
			type : 'POST',
			datatype : 'json',
			async : true,
			data : {
					'liquidacionId':idLiquidacionDetalle
					 },
			success : function(resultado) {
				json = $.parseJSON(resultado);
					
					if(json.error==1){
						alert(json.mensajeError)
					}else{
						location.reload();
					}
				},
			error : function() {
				alert('error al obtener los registros');
			}	
		});			
	}
}
function cerrarDetalleLiquidacion(indice){

    $("#detalleLiquidacion"+indice).each(function(){
        $(this).html("");
    });

}
function mostrarDetalleConcepto(indiceLiquidacion,indiceDetalle){
	liquidaciones = datosReporte['liquidaciones'];
	liquidacion = liquidaciones[indiceLiquidacion];


	detalles = liquidacion['detalles'];
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

function cargarDatos(datos)
{
    return true;
}
function mostrarDetalleCompletoDeRendicion(idLiquidacionDetalle,idLiquidacion){
	$( "#frmMostrarDetalleLiquidacion input[name=inpLiquidacionId]").val(idLiquidacion);
	$( "#frmMostrarDetalleLiquidacion  input[name=inpLiquidacionDetalleId]").val(idLiquidacionDetalle);
	
	$("#frmMostrarDetalleLiquidacion" ).submit();
}

function mostrarDetalleDeMovimientosPendientes(liquidacionId){
    $('#divResultado').addClass('divBuscandoInformacion');
	$.ajax({
		url : 'ajaxListaLiquidacionesMovimientosPendientes.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'liquidacionId':liquidacionId
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
				
				if(json.error==1){
					alert(json.mensajeError)
				}else{
					_.templateSettings.variable = "resultado";
					
				    var template = _.template(
				            $( "#templateLiquidacionesListaMovimientosPendientes" ).html()
				        );
				    $( "#divDetalleMovimientosPendientes").html(
				            template(json)
				        );  
				    
				}
            $('#divResultado').removeClass('divBuscandoInformacion');
			},
		error : function() {
			alert('error al obtener los registros');
		}	
	});				
}
function cerrarDetalleMovimientosPend(){
    $( "#divDetalleMovimientosPendientes").html(""); 	
}
function cobrarLiquidacionResumida(idLiquidacion,detalleId,indice){
    $('#divResultado').addClass('divBuscandoInformacion');
    $.ajax({
        url : 'ajaxLiquidacionesGrilla.php?token='+$('#mToken').val(),
        type : 'POST',
        datatype : 'json',
        async : true,
        detalleId:detalleId,
        indice:indice,
        data : {
            'periodoId':"",
            'liquidacionId':idLiquidacion,
            'fechaHasta':"",
            'fechaDesde':"",
			'detallarSucursales':1,
            'detallarUsuarios':1,
            'solicitaClave':1
        },
        success : function(resultado) {
            json = $.parseJSON(resultado);

            liquidacionEnEdicion = json;
            liquidacionEnEdicion['detalleEnEdicion'] = this.detalleId;
            liquidacionEnEdicion['indiceEnEdicion'] = this.indice;

            if(liquidacionEnEdicion["error"]==1){
                alert(liquidacionEnEdicion["mensajeError"]);
            }else{
                liqs = liquidacionEnEdicion['liquidaciones'];
                liq = liqs[0];
                detalles = liq['detalles'];

                for(d = 0; d < liq['totalDetalles'];d++){
                	detalle = detalles[d];
                    cancelarCobroRapido("detalleLiquidacionCON"+detalle['id']);
				}

                _.templateSettings.variable = "resultado";
                liquidacionEnEdicion["indice"]= this.indice;
                liquidacionEnEdicion["div"] = "detalleLiquidacionCON"+this.detalleId;
                var template = _.template(
                    $( "#liquidacionesCobrarSimplificado" ).html()
                );
                $( "#detalleLiquidacionCON"+this.detalleId).html(
                    template(liquidacionEnEdicion)
                );
                traerMovimientosCaja();
                $('#divResultado').removeClass('divBuscandoInformacion');
            }
        },
        error : function() {
            alert('error al obtener los registros');
        }
    });
}
function  traerMovimientosCaja(){
    $idSucursalOrigen = "";
    $idUsuarioOrigen = "";
    $idUsuarioDestino = "";

    $("#liqMovimientosDeCaja").html("");
    if ($("#inpIdSucursalMovimientoOrigen").val()!= ""){
        $idSucursalOrigen = $("#inpIdSucursalMovimientoOrigen").val();
    }else{

        $("#liqMovimientosDeCaja").html("- Seleccione una sucursal.</br>");
        return;
    }
    if ($("#inpIdUsuarioMovimientoOrigen").val()!= ""){
        $idUsuarioOrigen = $("#inpIdUsuarioMovimientoOrigen").val();
    }else{
        $("#liqMovimientosDeCaja").html($("#liqMovimientosDeCaja").html()+"- Seleccione un usuario.");
        return;
    }
    $('#divResultado').addClass('divBuscandoInformacion');

    $( "#liqMovimientosDeCaja" ).html('<img style="width:40px;" src="css/images/aguarde.gif">');

    $idUsuarioDestino = $("#idusuarioLogin").val();

    $.ajax({
        url : 'ajaxMovimientosCajaLiquidacion.php?token='+$('#mToken').val(),
        type : 'POST',
        datatype : 'json',
        async : true,
        data : {
            'idUsuarioOrigen':$idUsuarioOrigen,
            'idSucursalOrigen':$idSucursalOrigen,
            'incluirMovimientosAceptados': $('#inpIncluirMovAceptados').is(':checked')
        },
        success : function(resultado) {
            json = $.parseJSON(resultado);
            $('#divTotalMovimientosSeleccionados').html('$'+formatearPrecio($("#inpTotalMovimientosAnteriores").val()));

            if(json["error"]==1){
                alert(json["mensajeError"]);
            }else{
                _.templateSettings.variable = "movimientos";
                var template = _.template(
                    $( "#templateLiquidacionesCobrarMovimientos" ).html()
                );

                $( "#liqMovimientosDeCaja" ).html(
                    template(json)
                );
                recalcularTotalCobrado();
                $('#divResultado').removeClass('divBuscandoInformacion');
            }
        },
        error : function() {
            alert('error al obtener los registros');
        }
    });
}
function recalcularTotalCobrado(){

    tMov = parseFloat($("#totalMovimientos").val());
    total = parseFloat($("#inpTotalMovimientosAnteriores").val() );

    for(m=0;m<tMov;m++){
        if($('#chkMovimiento'+m).is(':checked')){
            total = total + parseFloat($('#inpMovImporte'+m).val());

            $('#liqFilaMov'+m).removeClass("cbContenedorCentralTablaFila");
            $('#liqFilaMov'+m).addClass("cbContenedorCentralTablaFilaSel");
            $('#liqFilaMovBis'+m).removeClass("cbContenedorCentralTablaFila");
            $('#liqFilaMovBis'+m).addClass("cbContenedorCentralTablaFilaSel");

        }else{
            $('#liqFilaMov'+m).removeClass("cbContenedorCentralTablaFilaSel");
            $('#liqFilaMov'+m).addClass("cbContenedorCentralTablaFila");
            $('#liqFilaMovBis'+m).removeClass("cbContenedorCentralTablaFilaSel");
            $('#liqFilaMovBis'+m).addClass("cbContenedorCentralTablaFila");

        }
    }
    $('#divTotalMovimientosSeleccionados').html("$"+formatearPrecio(total));

    return total;

}
function cancelarCobroRapido(div) {
	$('#'+div).html('');
}
function validarDatosCobrar(){
    $sugerido = parseFloat($("#inpTotalImporteSugerido").val());
    $cobrado = parseFloat(recalcularTotalCobrado());
    if($cobrado==0){
        if (!confirm("ATENCION! El total es igual a cero, ¿Está seguro que deseea cerrar la liquidacion igual?")){
            return false;
        }
    }else{
        if($sugerido +1 < $cobrado || $sugerido > $cobrado + 1){
            if (!confirm("ATENCION! El valor sugerido ("+$sugerido+") es diferente al valor cobrado ("+$cobrado+") ¿Está seguro que deseea cerrar la liquidacion igual?")){
                return false;
            }
        }else{
            if (!confirm("¿Está seguro que deseea cerrar la liquidacion igual?")){
                return false;
            }
        }
    }
    return true;
}
function finalizarLiqudiacion(){
    if (!validarDatosCobrar()){
        return;
    }

    detalleId = liquidacionEnEdicion['detalleEnEdicion'];
    indice = liquidacionEnEdicion['indiceEnEdicion'] ;

    liqs = liquidacionEnEdicion['liquidaciones'];
    liq = liqs[0];
    detalles = liq['detalles'];
    detalle = detalles[indice];



    tMov = $('#totalMovimientos').val();
    data =
        {
            'inpClaveOperacion':liquidacionEnEdicion['claveOperacion'],
            'idLiquidacionDetalle':detalle['idLiquidacionDetalle'],
            'inpTotalImporteSugerido':detalle['importesugerido'],
            'totalMovimientos':tMov,
            'inpTotalMovimientosAnteriores':$('#inpTotalMovimientosAnteriores').val(),
            'ajax':1

        };
    variable = 'resultado';
    template = '';
    divResultado = '';
    extra = '';
    callback = '';



    for(m=0; m < tMov;m++){

        data['chkMovimiento' + m] = '';
        if($('#chkMovimiento'+m).is(':checked')) {
            data['chkMovimiento' + m] = 1;
        }
        data['inpMovFechaHora' + m] = $('#inpMovFechaHora'+m).val() ;
        data['inpMovUsuarioId' + m] = $('#inpMovUsuarioId'+m).val() ;
        data['inpMovImporte' + m] = $('#inpMovImporte'+m).val() ;
        data['inpMovSucursalId' + m] = $('#inpMovSucursalId'+m).val() ;

    }

    $('#divResultado').addClass('divBuscandoInformacion');

    $.ajax({
        url : 'liquidacionCobrarGuardar.php?token='+$('#mToken').val(),
        type : 'POST',
        datatype : 'json',
        async : true,
        data :data,
        success : function(resultado) {
            json = $.parseJSON(resultado);

            if(json["err"]==1){
                alert('ERROR! '+json["errMensaje"]);
            }else{
                alert("La liquidacion se cerro correctamente.");
            }
            mostrarDetalleLiquidacion(idLiquidacionACobrar);
            $('#divResultado').removeClass('divBuscandoInformacion');

        },
        error : function() {
            alert('error al obtener los registros');
        }
    });
}
/*
function verPlanillaLiquidacion(idSucursal){

    $("#frmPlanillaLiquidacion input[name=sucursalId]").val(idSucursal);

    action = 'principal.php?token='+$('#mToken').val()+'&pagina=lqdscplnll';
    $('#frmPlanillaLiquidacion').attr('action',action);
    $("#frmPlanillaLiquidacion" ).submit();

}
*/
function verPlanillaLiquidacion(idSucursal,origen,oEvent){


    $('#frmPlanillaLiquidacion').attr('target', '');

    if(oEvent) {
        if (oEvent.ctrlKey) {
            $('#frmPlanillaLiquidacion').attr('target', '_blank');
        }
    }

    $("#frmPlanillaLiquidacion input[name=sucursalId]").val(idSucursal);
    $("#inpPaginaRetorno").val(origen);


    action = 'principal.php?token='+$('#mToken').val()+'&pagina=lqdscplnll';
    $('#frmPlanillaLiquidacion').attr('action',action);
    $("#frmPlanillaLiquidacion" ).submit();

}