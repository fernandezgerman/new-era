var datos = Array();
function agregarGasto() {
	_.templateSettings.variable = "datos";

	var template = _.template($("#templateAgregarNuevoGasto").html());
	$("#resultado").html(template(datos));

}
function listarGastosCargados(dat) {
	_.templateSettings.variable = "dat";

	var template = _.template($("#templateAgregarListadoDeAgregados").html());
	$("#gastosAgregados").html(template(dat));
}

$(document).ready(function() {
	listarGastosCargados(datos);
});
function mostrarDatosExtra() {
	indice = $('#agregarGastoArticuloId').val();
	desc = "";
	if (!indice == "") {
		articulos = datos['articulos'];
		articulo = articulos[indice];
		desc = "Rubro " + articulo['rubroNombre'] + ", tipo de gasto "
				+ articulo['tipoGastoDescripcion'];
	}
	$('#gastoNuevoDivDescripcionExtra').html(desc);
}

function getIndiceArticulosPorId(id) {
	articulos = datos['articulos'];
	totalarticulos = datos['totalarticulos'];
	indice = -1;
	for (a = 0; a < totalarticulos; a++) {
		articulo = articulos[a];
		if (articulo['articuloId'] == id) {
			indice = a;
		}
	}
	return indice;
}
function validarDatosAgregar() {
	if ($('#agregarGastoPeriodoId').val() == "") {
		alert('Debe selecccionar un periodo.');
		$('#agregarGastoPeriodoId').focus();
		return false;
	}	
	if ($('#agregarGastoSucursalId').val() == "") {
		alert('Debe selecccionar una sucursal.');
		$('#agregarGastoSucursalId').focus();
		return false;
	}
	if ($('#agregarGastoProveedorId').val() == "") {
		alert('Debe selecccionar un proveedor.');
		$('#agregarGastoProveedorId').focus();
		return false;
	}
	if ($('#agregarGastoFechaEmision').val() == "") {
		alert('Debe ingresar una fecha.');
		$('#agregarGastoFechaEmision').focus();
		return false;
	}
	if ($('#gastoNuevoAgregarNumero').val() == "") {
		alert('Debe ingresar un numero.');
		$('#gastoNuevoAgregarNumero').focus();
		return false;
	}
	if ($('#agregarGastoArticuloId').val() == "") {
		alert('Debe seleccionar un gasto.');
		$('#agregarGastoArticuloId').focus();
		return false;
	}
	if ($('#gastoNuevoAgregarImporte').val() == "") {
		alert('Debe ingresar un importe del gasto.');
		$('#gastoNuevoAgregarImporte').focus();
		return false;
	}
	
	
	return true;
}
function eliminarGasto(indice) {
	gastos = datos['gastosingresados'];
	gasto = gastos[indice];
	articulo = gasto['articulo'];
	importe = gasto['importe'];
	if (confirm('Esta seguro que desea quitar el gasto "'
			+ articulo['articuloNombre'] + '" de $' + importe)) {
		aux = Array();
		i = 0;
		for (a = 0; a < gastos.length; a++) {
			if (a != indice) {
				aux[i] = gastos[a];
				i++;
			}
		}
	}
	datos['gastosingresados'] = aux;
	datos['totalGastos'] = aux.length;

	listarGastosCargados(datos);
}
function agregarArticulo() {
	if (validarDatosAgregar()) {

		ingresados = datos['gastosingresados'];
		fila = Array();

		indiceSucursal = $('#agregarGastoSucursalId').val();
		indiceProveedor = $('#agregarGastoProveedorId').val();
		indicePeriodo = $('#agregarGastoPeriodoId').val();
		fechaEmision = $('#agregarGastoFechaEmision').val();
		numero = $('#gastoNuevoAgregarNumero').val();
		indiceArticulo = $('#agregarGastoArticuloId').val();
		importe = $('#gastoNuevoAgregarImporte').val();
		observaciones = $('#gastoNuevoAgregarObservaciones').val();

		articulos = datos['articulos'];
		proveedores = datos['proveedores'];
		sucursales = datos['sucursales'];
		periodos = datos['periodos'];
		
		fila['articulo'] = articulos[indiceArticulo];
		fila['proveedor'] = proveedores[indiceProveedor];
		fila['sucursal'] = sucursales[indiceSucursal];
		fila['periodo'] = periodos[indicePeriodo];
		fila['numero'] = numero;
		fila['fecha'] = fechaEmision;
		fila['importe'] = importe;
		fila['observaciones'] = observaciones;

		ingresados.push(fila);
		datos['gastosingresados'] = ingresados;
		datos['totalGastos'] = ingresados.length;
		$("#resultado").html("");
		listarGastosCargados(datos);
	}
}
function agregarSimilar() {
	indiceSucursal = $('#agregarGastoSucursalId').val();
	indiceProveedor = $('#agregarGastoProveedorId').val();
	indicePeriodo = $('#agregarGastoPeriodoId').val();
	fechaEmision = $('#agregarGastoFechaEmision').val();
	numero = $('#gastoNuevoAgregarNumero').val();
	indiceArticulo = $('#agregarGastoArticuloId').val();

	agregarArticulo();
	agregarGasto();

	$('#agregarGastoSucursalId').val(indiceSucursal);
	$('#agregarGastoProveedorId').val(indiceProveedor);
	$('#agregarGastoPeriodoId').val(indicePeriodo);
	$('#agregarGastoFechaEmision').val(fechaEmision);
	$('#gastoNuevoAgregarNumero').val(numero);
	$('#agregarGastoArticuloId').val(indiceArticulo);
}
function calcelarTodo() {
	listarGastosCargados(datos);
	$("#resultado").html("");
}
function guardarGastos()
{
	if (confirm("Esta seguro que desea guardar los gastos?")){
		action = 'principal.php?token='+$('#mToken').val()+'&pagina=gstsaddnvosave';
		
		$('#frmGastosGuardar').attr('action',action);
		$("#frmGastosGuardar").action
		$("#frmGastosGuardar").submit();		
	}

}