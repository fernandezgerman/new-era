window.onbeforeunload = preguntarAntesDeSalir;
var letras ;
function nuevoArticuloAjax()
{
	ajaxAbrirVentana();
	
	  $.ajax({
		  url: 'articuloAltaCompra.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {'agregarDesdeCompras':1,
			     'inpCosto': $('#inpSeleccionarCompraCosto').val(),
			     'inpCodigo': $('#inpSeleccionarCompraCodigo').val(),
			  	'funcionFinal':'aceptarArticulo'},
		  success: function(resultado){
					document.getElementById('divAjaxContenido').innerHTML = resultado;
				},
			  error: function(){
					alert('Error al cargar alta de articulo. Pagina inexistente') ;
				}
			});
}
function calcularCantidadXPrecio() {
	var cantidad = $("#inpCantidad").val();
	var costo = $("#inpCosto").val();

	var res = clipFloat(costo * cantidad, 3);
	if (isNaN(res)) {
		$("#auxCantidadXPrecio").text(formatearPrecio(0));
	} else {
		$("#auxCantidadXPrecio").text(res);
	}
}
function totalIVA(){
	indiceIVa = "";
	var totalIVA = 0;
	cantidad = $("#inpTotalImpuestos").val();

	tipoFactura = $("#inpTipoFactura").val();
	for (i = 0; i < cantidad; i++) {
		importe = parseFloat($("#inpImpuesto" + i).val());
		if($("#inpImpuestoId" + i).val()==2)
		{
			indiceIVa = i;
			if (!isNaN(parseFloat(importe))) {
				totalIVA = totalIVA + importe;
			}
		}
	}
	//$('#sugeridoIVA'+indiceIVa).html(formatearPrecio(totalIVA));
	return totalIVA;
}
function totalEnImpuestos() {
	var totalImpuestos = 0;
	cantidad = $("#inpTotalImpuestos").val();

	tipoFactura = $("#inpTipoFactura").val();
	for (i = 0; i < cantidad; i++) {
		importe = parseFloat($("#inpImpuesto" + i).val());
		discrimina = $("#inpImpuestoDiscrimina" + i).val();
		suma = $("#inpImpuestoSuma" + i).val();

		if (!isNaN(parseFloat(importe))) {
			if (suma == '1') {
				if (discrimina) {
					totalImpuestos = totalImpuestos + importe;
				} else {
					if (tipoFactura == "discrimina") {
						totalImpuestos = totalImpuestos + importe;
					}
				}
			} else {
				if (discrimina) {
					totalImpuestos = totalImpuestos - importe;
				} else {
					if (tipoFactura == "discrimina") {
						totalImpuestos = totalImpuestos - importe;
					}
				}

			}
		}
	}

	return totalImpuestos;
}
function calcularTotalFactura() {
	var totalCalculado = 0;
	// Total ingresado en el detalle

	$("#inpTotalFacturado").val(formatearPrecio($("#inpTotalFacturado").val()));
	totalCalculado = parseFloat($("#inpCompraTotal").val())
			+ totalEnImpuestos();

	if (isNaN(totalCalculado)) {
		totalCalculado = 0;
	}
	ingresado = parseFloat($("#inpTotalFacturado").val());
	diferencia = clipFloat(ingresado - totalCalculado, 3);

	$("#divTotalFacturaCalculado").removeClass();

	if (isNaN(totalCalculado) || isNaN(diferencia)) {
		$("#divTotalFacturaCalculado").addClass("edicion_campos_titulos_rojo");
		$("#divTotalFacturaCalculado").text(
				"Datos insuficientes para el calculo");
	} else {
		if (diferencia != 0) {
			$("#divTotalFacturaCalculado").addClass(
					"edicion_campos_titulos_rojo");
		} else {
			$("#divTotalFacturaCalculado").addClass("edicion_campos_titulos");
		}
		$("#divTotalFacturaCalculado").text(
				formatearPrecio(totalCalculado) + "("
						+ formatearPrecio(diferencia) + ")");
	}
	// Calcula el total final del precio de venta por linea aplicando recargos y
	// descuentos
	calcularCostoFinalPorLinea();

}
function enterEnCodigoArticuloDetalle(e) {
	if (validateEnter(e)) {
		aceptarArticulo();
	}
}
function datosValidosCompras() {
	var mensaje = "";

	if ($('#inpNumero').val() == "") {
		mensaje = 'No ingreso un numero de factura \n';
	}
	if ($('#inpFechaEmision').val() == "") {
		mensaje = mensaje + 'No ingreso una fecha de emision  \n';
	}

	if ($('#inpSucursalId').val() == "0") {
		mensaje = mensaje + 'Debe seleccionar una sucursal \n';
	}
	if ($('#inpModoDePago').val() == "0") {
		mensaje = mensaje + 'Debe seleccionar un modo de pago. \n';
	}
	if ($('#inpProveedorId').val() == "0") {
		mensaje = mensaje + 'Debe seleccionar un proveedor \n';
	}
	if (!validarfecha($('#inpFechaEmision').val())) {
		mensaje = mensaje + 'La fecha debe tener el formato aaaa-mm-dd \n';
	}
	if ($('#inpTipoFactura').val() == "0") {
		mensaje = mensaje + 'Debe seleccionar un tipo de factura \n';
	}
	dif = calcularDiferenciaIngresado();
	if (dif != 0) {
		mensaje = mensaje
				+ 'La diferencia del total de factura ingresado versus calculado debe ser cero y no '
				+ dif + ' \n';
	}

	letraSel = false;
	for(l=0; l < letras.length ;l++){
		letra = letras[l];
		if(letra['id']==$('#inpLetraId').val()){
			letraSel = letra;
		}
	}
	if (letraSel){
		totalIva = totalIVA();
		totalImpuestos = totalEnImpuestos();
		totalFactura = parseFloat($("#inpTotalFacturado").val());
		totalBruto = totalFactura - totalImpuestos;
		if(parseFloat(letraSel['discriminaiva'])==1){
			if( ((totalBruto * 0.21) + 2) <  totalIva){
				mensaje = mensaje + 'Se cargo mas IVA del esperado. Se esperaba: '+ formatearPrecio(totalBruto * 0.21) +'  \n';
			}
			if( ((totalBruto * 0.21) - 2) >  totalIva){
				mensaje = mensaje + 'Se cargo menos IVA del esperado. Se esperaba: '+ formatearPrecio(totalBruto * 0.21) +'  \n';
			}
		}else{
			if (parseFloat(totalIva) != 0){
				mensaje = mensaje + 'Las facturas de tipo '+letraSel['letra'] + ' no discriminan IVA \n';
			}
		}
	}else{
		mensaje = mensaje + 'Debe seleccionar una letra \n';
	}

	if (mensaje) {
		alert('Surgieron los siguientes errores en la validacion: \n\n'
				+ mensaje);
		return false;
	} else {
		return true;
	}

}
function asignacionReal() {
	$("#inpSucursalIdReal").val($("#inpSucursalId").val());
}
function guardarFactura() {
	if (datosValidosCompras()) {
		bPreguntar = false;
		$("#frmCompras").submit();
	}
}
function calcularDiferenciaIngresado() {
	var totalImpuestos = 0;
	// Total ingresado en el detalle
	totalImpuestos = parseFloat($("#inpCompraTotal").val());

	// Total en impuestos
	cantidad = $("#inpTotalImpuestos").val();

	tipoFactura = $("#inpTipoFactura").val();
	for (i = 0; i < cantidad; i++) {
		importe = parseFloat($("#inpImpuesto" + i).val());
		discrimina = $("#inpImpuestoDiscrimina" + i).val();
		suma = $("#inpImpuestoSuma" + i).val();
		if (!isNaN(parseFloat(importe))) {
			if (suma == '1') {
				if (discrimina) {
					totalImpuestos = totalImpuestos + importe;
				} else {
					if (tipoFactura == "discrimina") {
						totalImpuestos = totalImpuestos + importe;
					}
				}
			} else {
				if (discrimina) {
					totalImpuestos = totalImpuestos - importe;
				} else {
					if (tipoFactura == "discrimina") {
						totalImpuestos = totalImpuestos - importe;
					}
				}

			}
		}
	}
	if (isNaN(totalImpuestos)) {
		totalImpuestos = 0;
	}
	ingresado = parseFloat($("#inpTotalFacturado").val());
	diferencia = clipFloat(ingresado - totalImpuestos, 3);

	return diferencia;

}
function calcularCostoFinalPorLinea() {
	$totalImpuestos = totalEnImpuestos();
	$totalLineas = parseFloat($("#inpCompraTotal").val());
	$totalConImpuestos = $totalLineas + $totalImpuestos;

	$totalArticulos = $("#inpCompraTotalArticulos").val();

	for ($i = 1; $i <= $totalArticulos; $i++) {
		$precioLinea = $("#inpCompraCosto" + $i).val()
				* $("#inpCompraCantidad" + $i).val();
		$cantidad = $("#inpCompraCantidad" + $i).val();
		// Por regla de tres saco cuanto es el valor final del costo aplicando
		// impuestos
		$precioFinal = clipFloat(($totalConImpuestos * $precioLinea)
				/ $totalLineas, 3);
		$("#precioCostoCalculado" + $i).text(formatearPrecio($precioFinal));
		$("#inpCostoActualizacion" + $i).val(
				formatearPrecio($precioFinal / $cantidad));
	}

}
function presionaTeclaEnCodigo(tecla){
    if (tecla.keyCode == 113) { 
    	abrirBuscador('inpSeleccionarCompraCodigo','articulos');
    }
	
}
function clickEnCheck(idSeleccionado,indice){
	compra = compras.get({id : idSeleccionado});
	
	if ($('#inpActualizarPrecio'+indice).is(':checked')){
		compra.set({actualizarCosto : 1});
		$("#fila"+indice).removeClass();
		$("#fila"+indice).addClass("tblFilaParVerde");		
	}else{
		compra.set({actualizarCosto : 0});
		$("#fila"+indice).removeClass();
		$("#fila"+indice).addClass("tblFilaParAzul");		
	}
}
function mostrarDetalleFacturaCompra(compraId) {
	$('#idCompra').val(compraId);
	document.getElementById('frmEditar').submit();
}