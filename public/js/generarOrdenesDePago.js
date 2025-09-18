var seleccionados = Array();


$(document).ready(function(){
	_.templateSettings.variable = "filtros";

    var template = _.template($( "#filtrosGeneralesSucursalesTemplate" ).html());
    $( "#filtroSucursales" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesProveedoresTemplate" ).html());
    $( "#filtroProveedores" ).html(template(contenedorFiltros));

    $("#divPresentacionDiscriminarsucursal").hide();
});
function cargarDetalles(fechaDesde,fechaHasta,idSucursal,idProveedor,div,ag1,ag2){

	datos = {
			'fechaDesde':fechaDesde,
			'fechaHasta':fechaHasta,
			'idSucursal':idSucursal,
			'idProveedor':idProveedor
	};
	cargarAjaxGenericoJson('ajaxGenerarOrdenesDePagoDetalle.php',
			datos,'resultado','GenerarOrdenesListaDetalleTemplate',div,{'div': div,'ag1':ag1,'ag2':ag2});
}

function mostrarDatos(){
	if (validarDatosBusqueda()){
		$('#idBotonBuscar').hide();
		$('#reporteCompleto').addClass('divBuscandoInformacion');
		$( "#main" ).html("");
		quitarCtasCtesEnCero = 0;
		if($('#inpQuitarCtasEnCero').is(':checked')){
			quitarCtasCtesEnCero = 1;
		}
		agrupacion = 'PROVEEDOR';
		if($('#inpChkAgruparPorSucursal').is(':checked')){
			agrupacion = 'SUCURSAL';
		}

		  $.ajax({
			  url: 'ajaxGenerarOrdenesDePagoListado.php?token='+document.getElementById('mToken').value,
			  type: 'POST',
			  datatype :'json',
			  async: false,
			  data: {
				     'filtroSucursales': $('#inpFiltroSucursales').val(),
				     'filtroProveedores': $('#inpFiltroProveedores').val(),
				     'quitarCtasCtesEnCero': quitarCtasCtesEnCero,
				     'agrupacion':agrupacion
				     },
			  success: function(resultado){
				  		contenedorDeResultados = Array();
				  		res = $.parseJSON(resultado);

				  		semanas=res['semanas'];
						semanas = _.sortBy(semanas, function(fila){
							cadena = parseFloat(fila['semanaNumero'])+'-'+parseFloat(fila['anio']);
							return cadena;
						});

						_.templateSettings.variable = "resultado";

						var template = _.template($( "#GenerarOrdenesListaTemplate").html());
					    $( "#main" ).html(template(res));


				  		$('#reporteCompleto').removeClass('divBuscandoInformacion');
				  		$('#idBotonBuscar').show();
					},
				  error: function(){
						alert('Error al cargar los datos.') ;
						$('#idBotonBuscar').show();
						$('#reporteCompleto').removeClass('divBuscandoInformacion');
					}
				});
	}

}

function mostrarSucursalSeparado(){
	if($('#inpChkMostrarSucursal').is(':checked')){
		$("#divPresentacionDiscriminarsucursal").show(500);
	}else{
		$("#divPresentacionDiscriminarsucursal").hide(500);

	}
}
function validarDatosBusqueda(){
	if($('#inpFiltroFechaDesde').val()==""){
		alert("Debe ingresar una fecha desde.");
		$('#inpFiltroFechaDesde').focus();
		return false;
	}
	if($('#inpFiltroFechaHasta').val()==""){
		alert("Debe ingresar una fecha hasta.");
		$('#inpFiltroFechaHasta').focus();
		return false;
	}
	return true;
}

function cerrarDetalle(contenedor){
	$('#'+contenedor).html("");
	contenedorDeResultados[contenedor] = Array();

}
function cerrarDetalleFacturas(div,ag1,ag2){
	$('#'+div).html("");
	$('#divAg1-'+ag1+'Ag2-'+ag2+'SF').css({'display':'none'});
	setCalcularTotalSeleccionado();
}
function seleccionarTodasAg2(ag1,forzar,seleccion){
	totalAg2 = parseFloat($('#ag1-'+ag1+'TotalAg2').val());

	for(t=0; t <= totalAg2;t++){

		chkAg2 = 'chkAg1-'+ag1+'Ag2-'+t;

		div = 'divAg1-'+ag1+'Ag2-'+t;
		if(forzar){
			sel = seleccion;
		}else{
			sel = $('#'+chkAg2).is(':checked');
		}
		if(sel){
			$("#"+chkAg2).prop('checked', "checked");
		}else{
			$("#"+chkAg2).prop('checked', "");
		}
		seleccionarDiv(div,chkAg2);

		//ACCIONO SOBRE TODAS LAS FACTURAS
		totalFacturas = parseFloat($('#ag1-'+ag1+'ag2-'+t+'tf').val());
		if(totalFacturas){
			for(i=0;i < totalFacturas; i++){
				inpF = "inpAg1-"+ag1+"Ag2-"+t+"F"+i;
				id = parseFloat($('#'+inpF).val());
				chk = 'chkFac'+id;

				if($('#'+chkAg2).is(':checked')){
					$( "#Tr1Fac"+id).addClass('opDetalleFilaDeudaSel');
					$( "#Tr2Fac"+id).addClass('opDetalleFilaDeudaSel');
					$("#"+chk).prop('checked', "checked");
					$('#divAg1-'+ag1+'Ag2-'+t+'SF').css({'display':'none'});
				}else{
					$( "#Tr1Fac"+id).removeClass('opDetalleFilaDeudaSel');
					$( "#Tr2Fac"+id).removeClass('opDetalleFilaDeudaSel');
					$('#divAg1-'+ag1+'Ag2-'+t+'SF').css({'display':'none'});
					$("#"+chk).prop('checked', "");
				}
			}
		}

	}
}
function clickEnAgrupacion1(ag1){

	chk = 'chkAg1-'+ag1;
	div = 'divAg1-'+ag1;

	seleccionarDiv(div,chk);

	seleccionarTodasAg2(ag1,true,$('#'+chk).is(':checked'));
	setCalcularTotalSeleccionado();
}
function seleccionarDiv(div,chk){

	if($('#'+chk).is(':checked')){
		$( "#"+div ).addClass('opDivSeleccionadoSeleccionada');
	}else{
		$( "#"+div ).removeClass('opDivSeleccionadoSeleccionada');
	}

}

function todosFacturasSeleccionados(ag1,ag2){
	totalFacturas = parseFloat($('#ag1-'+ag1+'ag2-'+ag2+'tf').val());

	for(i=0;i < totalFacturas; i++){
		inpF = "inpAg1-"+ag1+"Ag2-"+ag2+"F"+i;
		id = parseFloat($('#'+inpF).val());
		chk = 'chkFac'+id;

		if(!$('#'+chk).is(':checked')){
			return false;
		}
	}

	return true;
}
function todosAg1Seleccionados(ag1){
	tag2 = parseFloat($('#ag1-'+ag1+'TotalAg2').val());

	for(i=0; i < tag2; i++){
		chk = 'chkAg1-'+ag1+'Ag2-'+i;
		if(!$('#'+chk).is(':checked')){
			return false;
		}
	}
	return true;
}
function seleccionarAgrupacion2(ag1,ag2,nodesseleccionar){
	chkAg1 = 'chkAg1-'+ag1;
	chkAg2 = 'chkAg1-'+ag1+'Ag2-'+ag2;
	divAg2 = 'divAg1-'+ag1+'Ag2-'+ag2;
	divAg1 = 'divAg1-'+ag1;

	seleccionarDiv(divAg2,chkAg2);


	//ACCIONO SOBRE TODAS LAS FACTURAS
	totalFacturas = parseFloat($('#ag1-'+ag1+'ag2-'+ag2+'tf').val());
	if(totalFacturas){
		if(!nodesseleccionar){
			for(i=0;i < totalFacturas; i++){
				inpF = "inpAg1-"+ag1+"Ag2-"+ag2+"F"+i;
				id = parseFloat($('#'+inpF).val());
				chk = 'chkFac'+id;

				if($('#'+chkAg2).is(':checked')){
					$( "#Tr1Fac"+id).addClass('opDetalleFilaDeudaSel');
					$( "#Tr2Fac"+id).addClass('opDetalleFilaDeudaSel');
					$("#"+chk).prop('checked', "checked");
					$('#divAg1-'+ag1+'Ag2-'+ag2+'SF').css({'display':'none'});
				}else{
					$( "#Tr1Fac"+id).removeClass('opDetalleFilaDeudaSel');
					$( "#Tr2Fac"+id).removeClass('opDetalleFilaDeudaSel');
					$('#divAg1-'+ag1+'Ag2-'+ag2+'SF').css({'display':'none'});
					$("#"+chk).prop('checked', "");
				}
			}
		}
	}

	if($('#'+chkAg2).is(':checked')){
		if(todosAg1Seleccionados(ag1)){
			$("#"+chkAg1).prop('checked', "checked");
			clickEnAgrupacion1(ag1);
		}
	}else{
		$( "#"+divAg1 ).removeClass('opDivSeleccionadoSeleccionada');
		$("#"+chkAg1).prop('checked', "");
	}
	setCalcularTotalSeleccionado();
	return true;
}

function seleccionarFactura(idfactura,ag1,ag2){
	chkFac = 'chkFac'+idfactura;
	chkAg2 = 'chkAg1-'+ag1+'Ag2-'+ag2;

	if($('#'+chkFac).is(':checked')){
		$( "#Tr1Fac"+idfactura).addClass('opDetalleFilaDeudaSel');
		$( "#Tr2Fac"+idfactura).addClass('opDetalleFilaDeudaSel');
		if(todosFacturasSeleccionados(ag1,ag2)){
			$("#"+chkAg2).prop('checked', "checked");
			seleccionarAgrupacion2(ag1,ag2);
		}

	}else{
		$( "#Tr1Fac"+idfactura).removeClass('opDetalleFilaDeudaSel');
		$( "#Tr2Fac"+idfactura).removeClass('opDetalleFilaDeudaSel');
		$("#"+chkAg2).prop('checked', "");
		seleccionarAgrupacion2(ag1,ag2,true);
	}
	setCalcularTotalSeleccionado();
}

function getRegistrosSeleccionados(){
	totalAg1 = parseFloat( $('#totalAg1').val() );

	arrAg1 = Array();
	arrAg1Ag2 = Array();
	arrAg1Ag2Fac = Array();

	for(ag1=0;ag1 < totalAg1; ag1++){
		chkAg1 = 'chkAg1-'+ag1;
		idAg1 = $('#'+chkAg1).val();
		if($('#'+chkAg1).is(':checked')){
			//AGRUPACIONES UNO SELECCIONADO
			arrAg1[arrAg1.length] = idAg1;
		}else{

			totalAg2 = parseFloat($('#ag1-'+ag1+'TotalAg2').val());
			for(ag2=0;ag2 < totalAg2; ag2++){
				//AGRUPACIONES DOS DE AGRUPACIONES UNO SELECCIONADOS
				chkAg2 = 'chkAg1-'+ag1+'Ag2-'+ag2;
				if($('#'+chkAg2).is(':checked')){
					idAg2 = $('#'+chkAg2).val();
					arrAg1Ag2[arrAg1Ag2.length] =idAg1+'#'+idAg2 ;
				}else{
					totalFacturas = parseFloat($('#ag1-'+ag1+'ag2-'+ag2+'tf').val());
					if(totalFacturas > 0){
						for(f = 0; f < totalFacturas;f++){
							//FACTURAS SELECCIONADAS
							idFactura = $('#inpAg1-'+ag1+'Ag2-'+ag2+'F'+f).val();
							if($('#chkFac'+idFactura).is(':checked')){
								arrAg1Ag2Fac[arrAg1Ag2Fac.length] = idFactura;

							}
						}
					}
				}

			}

		}
	}
	resultado = Array();

	resultado['agrupacion1'] = serialize(arrAg1);
	resultado['agrupacion2'] = serialize(arrAg1Ag2);
	resultado['facturas'] = serialize(arrAg1Ag2Fac);
	resultado['tipoAgrupacion'] = $('#tipoDeAgrupacion').val();


	$("#inpSeleccionAgrupacion1").val(resultado['agrupacion1']);
	$("#inpSeleccionAgrupacion2").val(resultado['agrupacion2']);
	$("#inpSeleccionFactura").val(resultado['facturas']);
	$("#inpSeleccionAgrupacion").val(resultado['tipoAgrupacion']);

	return resultado;
}
function exportarPDF(){
	getRegistrosSeleccionados();
	action = 'pdfOPGenerarExportar.php?token='+$('#mToken').val()+'&pagina=gnrordnpgoprview';

	$("#inpSeleccionPrv").val($("#inpFiltroProveedores").val() );
	$("#inpSeleccionSuc").val($("#inpFiltroSucursales").val() );

	$('#frmMostrarImpresion').attr('action',action);
	$('#frmMostrarImpresion').submit();
}

function generarOrdenesDePago(){
	getRegistrosSeleccionados();

	$("#inpSeleccionPrv").val($("#inpFiltroProveedores").val() );
	$("#inpSeleccionSuc").val($("#inpFiltroSucursales").val() );

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=gnrordnpgoprview';

	$('#frmMostrarImpresion').attr('action',action);
	$('#frmMostrarImpresion').submit();
}



function setCalcularTotalSeleccionado(){
	totalAg1 = parseFloat( $('#totalAg1').val() );

	arrAg1 = Array();
	arrAg1Ag2 = Array();
	arrAg1Ag2Fac = Array();
	totalSeleccionado = 0;
	for(ag1=0;ag1 < totalAg1; ag1++){
		chkAg1 = 'chkAg1-'+ag1;
		idAg1 = $('#'+chkAg1).val();
		if($('#'+chkAg1).is(':checked')){
			//AGRUPACIONES UNO SELECCIONADO
			arrAg1[arrAg1.length] = idAg1;
			totalSeleccionado = totalSeleccionado + parseFloat($('#inputTotalAg1-'+ag1).val());
		}else{

			totalAg2 = parseFloat($('#ag1-'+ag1+'TotalAg2').val());
			for(ag2=0;ag2 < totalAg2; ag2++){
				//AGRUPACIONES DOS DE AGRUPACIONES UNO SELECCIONADOS
				chkAg2 = 'chkAg1-'+ag1+'Ag2-'+ag2;

				if($('#'+chkAg2).is(':checked')){
					idAg2 = $('#'+chkAg2).val();
					arrAg1Ag2[arrAg1Ag2.length] =idAg1+'#'+idAg2 ;
					totalSeleccionado = totalSeleccionado + parseFloat($('#inputTotalAg1-'+ag1+'Ag2-'+ag2).val());

					$('#divAg1-'+ag1+'Ag2-'+ag2+'SF').css({'display':'none'});
				}else{
					totalFacturas = parseFloat($('#ag1-'+ag1+'ag2-'+ag2+'tf').val());

					if(totalFacturas > 0){
						sel = 0;

						for(f = 0; f < totalFacturas;f++){
							//FACTURAS SELECCIONADAS
							idFactura = $('#inpAg1-'+ag1+'Ag2-'+ag2+'F'+f).val();
							if($('#chkFac'+idFactura).is(':checked')){
								totalSeleccionado = totalSeleccionado + parseFloat($('#inpImporteFac'+idFactura).val());
								sel = sel + parseFloat($('#inpImporteFac'+idFactura).val());
							}
						}
						if(sel > 0){
							$('#divAg1-'+ag1+'Ag2-'+ag2+'SF').html('($'+formatearPrecio(sel)+')')
							$('#divAg1-'+ag1+'Ag2-'+ag2+'SF').css({'display':'block'});
						}else{
							$('#divAg1-'+ag1+'Ag2-'+ag2+'SF').css({'display':'none'});
						}

					}
				}
			}
		}
	}
	$('#divTotalSeleccionado').html(formatearPrecio(totalSeleccionado));
}
function maximizarListado(div)
{
	if ($('#' + div).hasClass('divPantallaCompleta')) {
		$('#' + div).removeClass('divPantallaCompleta');
		$('#divRef').addClass('opPosicionReferencias');
		$('#divRef').removeClass('opPosicionReferenciasFijo');
		$('#divTotalSeleccionadoGeneral').removeClass('opTotalSeleccionadoMax');

	} else {
		$('#' + div).addClass('divPantallaCompleta');
		$('#divRef').removeClass('opPosicionReferencias');
		$('#divRef').addClass('opPosicionReferenciasFijo');
		$('#divTotalSeleccionadoGeneral').addClass('opTotalSeleccionadoMax');
	}


}
function seleccionarTodosAg1(){
	tAg1 = parseFloat($('#totalAg1').val());
	for(a = 0; a < tAg1; a++){
		chk = 'chkAg1-'+a;

		if($('#inpSeleccionarTodosAg1').is(':checked')){
			$("#"+chk).prop('checked', "checked");
		}else{
			$("#"+chk).prop('checked', "");
		}
		clickEnAgrupacion1(a);
	}


}
function modificarFechaDeVencimiento(idcompra,aumentaSemana,
									fechaDesde,fechaHasta,idSucursal,idProveedor,div,ag1,ag2){
	// ajaxGenerarOrdenesDePagoModificarVencimiento.php

	cargarDetalles(fechaDesde,fechaHasta,idSucursal,idProveedor,div,ag1,ag2)

	extra = Array();
	extra['fechaDesde'] = fechaDesde;
	extra['fechaHasta'] = fechaHasta;
	extra['idSucursal'] = idSucursal;
	extra['idProveedor'] = idProveedor;
	extra['div'] = div;
	extra['ag1'] = ag1;
	extra['ag2'] = ag2;
	$('#reporteCompleto').addClass('divBuscandoInformacion');
	  $.ajax({
		  url: 'ajaxGenerarOrdenesDePagoModificarVencimiento.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datosExtra: extra,
		  datatype :'json',
		  async: true,
		  data: {
			     'idCompra': idcompra,
			     'aumentaSemana': aumentaSemana
			     },
		  success: function(resultado){
			  		contenedorDeResultados = Array();
			  		resx = $.parseJSON(resultado);

			  		if(resx['error']==1){
			  			alert(resx['mensaje']);
			  		}else{
			  			mostrarDatos(false);

			  			maximizarListado('datosResultado');

			  			cargarDetalles(this.datosExtra['fechaDesde'],
			  			               this.datosExtra['fechaHasta'],
			  			               this.datosExtra['idSucursal'],
			  			               this.datosExtra['idProveedor'],
			  			               this.datosExtra['div'],
			  			               this.datosExtra['ag1'],
			  			               this.datosExtra['ag2']);

			  			cmps = resx['compra'];
			  			cmp = cmps[0];

			  			cargarDetalles(cmp['fechadesdesup'],
		  			               cmp['fechahastasup'],
		  			               this.datosExtra['idSucursal'],
		  			               this.datosExtra['idProveedor'],
		  			               'detalleS'+this.datosExtra['idSucursal']+
		  			               'P'+this.datosExtra['idProveedor']+
		  			               'S'+cmp['semana'],
		  			               this.datosExtra['ag1'],
		  			               this.datosExtra['ag2']);


			  		};
			  		$('#reporteCompleto').removeClass('divBuscandoInformacion');

			  		$('#idBotonBuscar').show();
				},
			  error: function(){
					alert('Error al cargar los datos.') ;
					$('#idBotonBuscar').show();
					$('#reporteCompleto').removeClass('divBuscandoInformacion');
				}
			});


}
function mostrarFacturaCompra(idcompra)
{

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=prmteditfaccmp';


	$("#frmDetalleCompra input[name=idCompra]").val(idcompra);

	$('#frmDetalleCompra').attr('action',action);
	$('#frmDetalleCompra').submit();
}
