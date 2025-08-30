
var datosAjax = Array();
var totales = [];
var puedeEditar = false;

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

		  $.ajax({
			  url: 'ajaxSolicitudDePagoLista.php?token='+document.getElementById('mToken').value,
			  type: 'POST',
			  datatype :'json',
			  async: false,
			  data: {
				     'sucursalId': $('#inpFiltroSucursales').val(),
				     'proveedores': $('#inpFiltroProveedores').val(),
				     'quitarCtasCtesEnCero': '',
				     'agrupacion':''
				     },
			  success: function(resultado){

				  		contenedorDeResultados = Array();
				  		res = $.parseJSON(resultado);

						datosAjax = res;

				  		renderPantalla();
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
function seleccionPantalla(){
	//if($('#selFormatoPresentacion').val()==2) {
		this.totales = [];
		_.templateSettings.variable = "resultado";
		var template = _.template($("#SolicitudDePagoResumenDiaTemplate").html());
		$("#reporteDatos").html(template(datosAjax));

/*
	}else{

		_.templateSettings.variable = "resultado";
		var template = _.template($("#SolicitudDePagoDetalleFacturaTemplate").html());
		$("#reporteDatos").html(template(datosAjax));

		recalcularTotalesSeleccion();


	}*/
}
function renderPantalla(){

	this.totales = [];
	_.templateSettings.variable = "resultado";
	var template = _.template($("#SolicitudDePagoListaTemplate").html());
	$("#main").html(template(datosAjax));

/*	if($('#selFormatoPresentacion').val()==2) { */

		this.totales = [];
		_.templateSettings.variable = "resultado";
		var template = _.template($("#SolicitudDePagoResumenDiaTemplate").html());
		$("#reporteDatos").html(template(datosAjax));

		maximizarListado('datosResultado');
	/* }else{

		_.templateSettings.variable = "resultado";
		var template = _.template($("#SolicitudDePagoDetalleFacturaTemplate").html());
		$("#reporteDatos").html(template(datosAjax));
	}*/


};
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

function mostrarFacturaCompra(idcompra)
{
		
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=prmteditfaccmp';
	
	
	$("#frmDetalleCompra input[name=idCompra]").val(idcompra);
	
	$('#frmDetalleCompra').attr('action',action);
	$('#frmDetalleCompra').submit();	
}
function setTotal(clave,valor){
	this.totales[clave] = parseFloat(formatearPrecio(valor));
}
function sumTotal(clave,valor){
	if(this.totales[clave]){
		this.totales[clave] = parseFloat(formatearPrecio(valor)) + this.totales[clave];
	}else{
		this.totales[clave] = parseFloat(formatearPrecio(valor));
	}

}
function getTotal(clave){
	return this.totales[clave] ;
}
function asignaCantidadPago(clave,indice,claveFactura){
	registros = datosAjax['registros'];
	facturas = registros[clave];
	factura = facturas[indice];
	factura['importePagoParcial']=$('#txtCantidadPago'+claveFactura).val();

	facturas[indice] = factura;
	registros[clave] = facturas;
	datosAjax['registros'] = registros;


	recalcularTotalesSeleccion();
}
function seleccionaCantidadPago(clave,indice,claveFactura){
	registros = datosAjax['registros'];
	facturas = registros[clave];
	factura = facturas[indice];


	if($('#selCantidadPago'+claveFactura).val()==2){

		factura['cantidadPago'] = 2
		$('#txtCantidadPago'+claveFactura).css('display','block');
		$('#selCantidadPago'+claveFactura).css('display','block');
		$('#txtCantidadPago'+claveFactura).val(formatearPrecio(factura['importePagoParcial']));
	}else{
		factura['cantidadPago'] = 1
		$('#selCantidadPago'+claveFactura).css('display','block');
		$('#txtCantidadPago'+claveFactura).css('display','none');
	}

	facturas[indice] = factura;
	registros[clave] = facturas;
	datosAjax['registros'] = registros;


	recalcularTotalesSeleccion();
}
function seleccionoFactura(clave,indice,claveFactura){
	registros = datosAjax['registros'];
	facturas = registros[clave];
	factura = facturas[indice];

	if($('#chkfac'+clave+'fac'+indice).is(':checked')) {
		factura['seleccionada'] = 1;

		if(factura['cantidadPago'] == 2){
			$('#selCantidadPago'+claveFactura).css('display','block');
			$('#txtCantidadPago'+claveFactura).css('display','block');
			$('#txtCantidadPago'+claveFactura).val(formatearPrecio(factura['importePagoParcial']));
		}else{
			$('#selCantidadPago'+claveFactura).css('display','block');
			$('#txtCantidadPago'+claveFactura).css('display','none');
		}

	}else{
		factura['seleccionada'] = 0;
		$('#selCantidadPago'+claveFactura).css('display','none');
		$('#txtCantidadPago'+claveFactura).css('display','none');
	}



	facturas[indice] = factura;
	registros[clave] = facturas;
	datosAjax['registros'] = registros;


	recalcularTotalesSeleccion();
}
function recalcularTotalesSeleccion(){
	proveedores = datosAjax['proveedores'];
	dias = datosAjax['dias'];
	valores = datosAjax['registros'];

	for(indiceDia in dias) {
		dia = dias[indiceDia];
		setTotal(dia['numero'] + 'tsel', 0);
	}
	setTotal('totalSeleccionado', 0);
	setTotal('ftsel', 0);
	setTotal('vtsel', 0);


	for(proveedorId in proveedores) {
		proveedor = proveedores[proveedorId];
		setTotal('selProveedor'+proveedorId, 0);

		/* RECORRO LOS DIAS */
		for(indiceDia in dias) {
			dia = dias[indiceDia];
			facturas = valores['prv'+proveedorId+'d'+dia['numero']];
			setTotal(dia['numero']+'sel'+proveedorId,0);

			keyPrvDia = dia['numero']+'sel'+proveedorId;
			if(facturas){
				for(indiceFactura in facturas) {
					factura = facturas[indiceFactura];
					keyFac = 'prv'+proveedorId+'d'+dia['numero']+'fac'+indiceFactura;

					if(factura['seleccionada']){

						val = factura['deuda'];
						if(factura['cantidadPago'] == 2){
							val = factura['importePagoParcial'];
						}

						sumTotal(keyPrvDia,val);
						sumTotal(dia['numero']+'tsel',val);
						sumTotal('totalSeleccionado',val);
						sumTotal('selProveedor'+proveedorId, val);

						$('#tr2fac'+keyFac).addClass('spFacturaSeleccionada');
						$('#tr1fac'+keyFac).addClass('spFacturaSeleccionada');

						$("#chkfac"+keyFac).prop("checked", 'checked');
					}else{
						$('#tr2fac'+keyFac).removeClass('spFacturaSeleccionada');
						$('#tr1fac'+keyFac).removeClass('spFacturaSeleccionada');

					}
				}
			}
			$('#divTotal'+keyPrvDia).html(
				'$'+formatearPrecio(getTotal(keyPrvDia)
				));


		}
		/* FACTURAS VENCIDAS */

		facturas = valores['prv'+proveedorId+'v'];
		setTotal('vsel'+proveedorId,0);

		keyPrvDia = 'vsel'+proveedorId;
		if(facturas){
			for(indiceFactura in facturas) {
				factura = facturas[indiceFactura];
				keyFac = 'prv'+proveedorId+'vfac'+indiceFactura;

				if(factura['seleccionada']){
					val = factura['deuda'];
					if(factura['cantidadPago'] == 2){
						val = factura['importePagoParcial'];
					}

					sumTotal(keyPrvDia,val);
					sumTotal('vtsel',val);
					sumTotal('totalSeleccionado',val);
					sumTotal('selProveedor'+proveedorId, val);

					$('#tr2fac'+keyFac).addClass('spFacturaSeleccionada');
					$('#tr1fac'+keyFac).addClass('spFacturaSeleccionada');
					$("#chkfac"+keyFac).prop("checked", 'checked');
				}else{
					$('#tr2fac'+keyFac).removeClass('spFacturaSeleccionada');
					$('#tr1fac'+keyFac).removeClass('spFacturaSeleccionada');

				}
			}
		}
		$('#divTotal'+keyPrvDia).html(
			'$'+formatearPrecio(getTotal(keyPrvDia)
			));

		/* facturas futuras */

		facturas = valores['prv'+proveedorId+'f'];
		setTotal('fsel'+proveedorId,0);

		keyPrvDia = 'fsel'+proveedorId;
		if(facturas){
			for(indiceFactura in facturas) {
				factura = facturas[indiceFactura];
				keyFac = 'prv'+proveedorId+'ffac'+indiceFactura;

				if(factura['seleccionada']){

					val = factura['deuda'];
					if(factura['cantidadPago'] == 2){
						val = factura['importePagoParcial'];
					}

					sumTotal(keyPrvDia,val);
					sumTotal('ftsel',val);
					sumTotal('totalSeleccionado',val);
					sumTotal('selProveedor'+proveedorId, val);

					$('#tr2fac'+keyFac).addClass('spFacturaSeleccionada');
					$('#tr1fac'+keyFac).addClass('spFacturaSeleccionada');
					$("#chkfac"+keyFac).prop("checked", 'checked');
				}else{
					$('#tr2fac'+keyFac).removeClass('spFacturaSeleccionada');
					$('#tr1fac'+keyFac).removeClass('spFacturaSeleccionada');

				}
			}
		}
		$('#divTotal'+keyPrvDia).html(
			'$'+formatearPrecio(getTotal(keyPrvDia)
			));

		$('#totalProveedor'+proveedorId).html('$'+formatearPrecio(getTotal('selProveedor'+proveedorId)));




	}

	$('#divTotalv').html('$'+formatearPrecio(getTotal('vtsel')))
	$('#divTotalf').html('$'+formatearPrecio(getTotal('ftsel')))

	$('#divTotalSeleccionado').html(formatearPrecio(getTotal('totalSeleccionado')))


	for(indiceDia in dias) {
		dia = dias[indiceDia];
		keyDia = dia['numero']+'tsel';
		$('#divTotal'+keyDia).html(
			'$'+formatearPrecio(getTotal(keyDia)
			));

	}
}
function getFacturasSeleccionadas(){
	proveedores = datosAjax['proveedores'];
	dias = datosAjax['dias'];
	valores = datosAjax['registros'];

	proveedoresSeleccion=[];

	for(proveedorId in proveedores) {
		proveedor = proveedores[proveedorId];

		/* FACTURAS VENCIDAS */
		facturas = valores['prv'+proveedorId+'v'];
		facturasSeleccion=[];
		if(facturas) {
			for (indiceFactura in facturas) {
				factura = facturas[indiceFactura];
				if (factura['seleccionada']) {
					facturasSeleccion.push(factura);
				}
			}
		}

		/* FACTURAS POR DIA */
		facturas = valores['prv'+proveedorId+'v'];
		if(facturas) {
			for(indiceDia in dias) {
				dia = dias[indiceDia];
				facturas = valores['prv'+proveedorId+'d'+dia['numero']];

				for (indiceFactura in facturas) {
					factura = facturas[indiceFactura];
					if (factura['seleccionada']) {
						facturasSeleccion.push(factura);
					}
				}
			}
		}

		/* FACTURAS FUTURAS */
		facturas = valores['prv'+proveedorId+'f'];
		if(facturas) {
			for (indiceFactura in facturas) {
				factura = facturas[indiceFactura];
				if (factura['seleccionada']) {
					facturasSeleccion.push(factura);
				}
			}
		}

		if(facturasSeleccion.length > 0){
			proveedor['facturas'] = facturasSeleccion;
			proveedoresSeleccion.push(proveedor);
		}
	}
	return proveedoresSeleccion;
}
function continuarSolicitud(){



	mostrarTemplateGeneral(getFacturasSeleccionadas(), 'seleccion',
		'SolicitudDePagoListaSeleccionTemplate',
		'main');
}
function mostrarDetalleCtaCte(idproveedor,idsucursal,pagina,divDestino){


	$('#datosResultado').addClass('divBuscandoInformacion');
	$("#tr"+divDestino).css("display", "");
	cargarAjaxGenericoJson('ajaxSolicitudDePagoExtracto.php',
			{'proveedorId': idproveedor,
				'sucursalId':idsucursal,
				'pagina':pagina,
				'divDestino':divDestino},
		'extracto',
		'SolicitudDePagoExtractoTemplate',
		         divDestino,
			{'div': divDestino},
				'finalizacionCargaCtaCte('+idproveedor+',json)');
}
function finalizacionCargaCtaCte(idproveedor,extracto){
	proveedores = datosAjax['proveedores'];
	proveedor = proveedores[idproveedor];
	proveedor['ctacte'] = extracto['ctacte'];
	proveedores[idproveedor] = proveedor;
	datosAjax['proveedores'] = proveedores;

	$('#datosResultado').removeClass('divBuscandoInformacion');
}

function cerrarDetalleCtaCte(divDestino){
	$("#"+divDestino).html("");
	$("#tr"+divDestino).css("display", "none");
}
function mostrarDetalleSemana(semana,semanasVisibles){
	$("#tdAbrirSemana"+semana).css('display','none');
	$("#tdCerrarSemana"+semana).css('display','');
	$(".tdSemana"+semana).each(function(){
		$(this).css('display','');
	});
	$('#thSemana'+semana).attr('colspan',semanasVisibles + 1);
}
function ocultarDetalleSemana(semana){


	$("#tdAbrirSemana"+semana).css('display','');
	$("#tdCerrarSemana"+semana).css('display','none');
	$(".tdSemana"+semana).each(function(){
		$(this).css('display','none');
	});

	$('#thSemana'+semana).attr('colspan',1);
}
function detallarComprasYPagos(div,idcompra){

	$('#reporteCompleto').addClass('divBuscandoInformacion');
	$.ajax({
		url: 'ajaxBusquedaDeCompras.php?token='+document.getElementById('mToken').value,
		type: 'POST',
		datatype :'json',
		async: true,
		data: {
			'idcompra': idcompra,
			'div': div
		},
		success: function(resultado){
			contenedorDeResultados = Array();
			res = $.parseJSON(resultado);

			_.templateSettings.variable = "resultado";

			var template = _.template($( "#visorDeCompraTemplate").html());
			$( "#"+res.div ).html(template(res));

			$('#reporteCompleto').removeClass('divBuscandoInformacion');

		},
		error: function(){
			alert('Error al cargar los datos.') ;
			$('#idBotonBuscar').show();
			$('#reporteCompleto').removeClass('divBuscandoInformacion');
		}
	});
}
function cerrarCompra(div){
	$('#'+div).html("");
}
function editarCompra(compraId){
	$('#idCompra').val(compraId);
	document.getElementById('frmEditar').submit();
}
function seleccionarFactura(proveedorId,indiceCompra){
	proveedores = datosAjax['proveedores'];
	proveedor = proveedores[proveedorId];
	ctacte = proveedor['ctacte'];
	extracto = ctacte['extracto'];
	compra = extracto[indiceCompra];

	if($('#chkSelPago'+compra['id']).is(':checked')) {
		$('#txtSelPago'+compra['id']).val(formatearPrecio(compra['saldo']));
	}else{
		$('#txtSelPago'+compra['id']).val('');
	}
	calcularTotalAPagar(proveedorId);
}
function calcularTotalAPagar(proveedorId){
	proveedores = datosAjax['proveedores'];
	proveedor = proveedores[proveedorId];
	ctacte = proveedor['ctacte'];
	extracto = ctacte['extracto'];

	valido = true;
	pago = 0;
	for(indice in extracto){
		compra = extracto[indice]
		pago = pago + parseFloat( formatearPrecio($('#txtSelPago'+compra['id']).val() ) );
	}
	$('#divTotalSeleccionado'+proveedorId).html(formatearPrecio(pago));
	return pago ;
}
function generarSolicitudDePago(proveedorId){
	proveedores = datosAjax['proveedores'];
	proveedor = proveedores[proveedorId];
	ctacte = proveedor['ctacte'];
	extracto = ctacte['extracto'];

	seleccionadas = [];
	totalpago = 0 ;
	for(indice in extracto){
		compra = extracto[indice]
		pago = Math.abs(parseFloat( formatearPrecio($('#txtSelPago'+compra['id']).val() ) ));
		saldo = Math.abs(parseFloat(compra['saldo']));
		compra['importeAPagar'] = formatearPrecio($('#txtSelPago'+compra['id']).val() );

		if( parseFloat( $('#txtSelPago'+compra['id']).val() ) > 0 &&
			parseFloat(parseFloat(compra['saldo']) )< 0
		){
			alert('Las NC deben cargarse en negativo.');
			$('#txtSelPago'+compra['id']).focus();
			return;
		}
		if(pago > 0 && pago > saldo)
		{
			alert('El importe de pago no puede ser mayor al saldo');
			$('#txtSelPago'+compra['id']).focus();
			return;
		}

		if(pago > 0){
			totalpago = parseFloat($('#txtSelPago'+compra['id']).val() ) + totalpago;
			seleccionadas.push(compra);
		}

	}

	if(seleccionadas.length ==0){
		alert('Debe seleccionar alguna factura');
		return;
	}

	if(!confirm('Se generara una solicitud de pago por $'+formatearPrecio(totalpago)+'. Desea continuar???' )){
		return;
	}

	cargarAjaxGenericoJson('ajaxSolicitudDePagoGuardar.php',
		{
			'pagos':seleccionadas
		},
		'resultado',
		'SolicitudDePagoExtractoResGuardarTemplate',
		'divErrorExtracto'+proveedorId,
			false,
			'finalizaProcesoGuardarSolicitud('+proveedorId+',json,'+ctacte['idsucursal']+')'
			);


}
function finalizaProcesoGuardarSolicitud(proveedorId,json,sucursalId){
	$('#trErrorExtracto'+proveedorId).show(500);
	if(!json['error']){
		alert('La solicitud de pago se genero correctamente!! Se cargaran los datos nuevamente.');
		$('divAg1').html('CARGANDO...');
		mostrarDetalleCtaCte(proveedorId,sucursalId,1,'DetalleExtracto'+proveedorId);
		//mostrarDatos();
	}
}
function mostrarLeyenda(id){
	$('#'+id).css('visibility','visible');
}

function ocultarLeyenda(id){
	$('#'+id).css('visibility','hidden');
}