var datos=false;
var indiceAnterior = -1;
var contenedorFiltros;
$(document).ready(function(){
    _.templateSettings.variable = "filtros";

    var template = _.template($( "#filtrosGeneralesRubrosTemplate" ).html());
    $( "#filtroRubros" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesMarcasTemplate" ).html());
    $( "#filtroMarcas" ).html(template(contenedorFiltros));

});

function buscarDatos(){
	if(!datosValidos()){
		return false;
	}
	data = {'proveedorId': $('#inpProveedorId').val(),
        	'sucursalId': $('#inpSucursalId').val(),
        	'rubroId': $('#inpFiltroRubros').val(),
            'marcaId': $('#inpFiltroMarcas').val(),
			'diasVentas': $('#inpEstadisticaId').val()
	};
	variable = 'resultado';
    template = 'templateOrdenesDeCompraLista';
    divResultado = 'divGrilla';
    extra = false;
    callback = 'asignarDatos(json)';
    $('#reporteCompleto').addClass('divBuscandoInformacion');
    cargarAjaxGenericoJson('ajaxOrdenesDeCompraLista.php', data, variable, template, divResultado,extra,callback);
}
function asignarDatos(datosJson){
	datos = datosJson;
    $('#reporteCompleto').removeClass('divBuscandoInformacion');
}
function datosValidos(){
	if($('#inpSucursalId').val()==""){
		alert('Debe seleccionar una sucursal.');
		return false;
	}

    if(!$('#inpFiltroRubros').val()){
        alert('Debe seleccionar un rubro.');
        return false;
    }
    if($('#inpProveedorId').val()==""){
        alert('Debe seleccionar un proveedor.');
        return false;
    }
    if($('#inpEstadisticaId').val()==""){
        alert('Debe seleccionar los dias para la estadistica de ventas.');
        return false;
    }
    return true;
}
function ordenarPorCantidad(){
	if(datos) {

        articulos = datos['articulos'];

        $('#reporteCompleto').addClass('divBuscandoInformacion');

        if (datos['ordenCantidad'] == -1) {
            datos['ordenCantidad'] = 1;
        } else {
            datos['ordenCantidad'] = -1;
        }
        articulos = _.sortBy(articulos, function (fila) {
        	if(fila['cantidad']) {
                return parseFloat(fila['cantidad']) * datos['ordenCantidad'];
            }else{
        		return 0;
			}
        });
        datos['articulos'] = articulos;

        mostrarTemplateGeneral(datos, 'resultado', 'templateOrdenesDeCompraLista', 'divGrilla');

        $('#reporteCompleto').removeClass('divBuscandoInformacion');
    }
}
function ordenarPorPromedioVenta(){
    if(datos) {

        articulos = datos['articulos'];

        $('#reporteCompleto').addClass('divBuscandoInformacion');

        if (datos['ordenPromedioVentas'] == -1) {
            datos['ordenPromedioVentas'] = 1;
        } else {
            datos['ordenPromedioVentas'] = -1;
        }
        articulos = _.sortBy(articulos, function (fila) {
            if(fila['promedioVentas']) {
                return parseFloat(fila['promedioVentas']) * datos['ordenPromedioVentas'];
            }else{
                return 0;
            }
        });
        datos['articulos'] = articulos;

        mostrarTemplateGeneral(datos, 'resultado', 'templateOrdenesDeCompraLista', 'divGrilla');

        $('#reporteCompleto').removeClass('divBuscandoInformacion');
    }
}
function ordenarPorCantidadIngresada(){
    if(datos) {

        articulos = datos['articulos'];

        $('#reporteCompleto').addClass('divBuscandoInformacion');

        if (datos['ordenCantidadIngresada'] == -1) {
            datos['ordenCantidadIngresada'] = 1;
        } else {
            datos['ordenCantidadIngresada'] = -1;
        }
        articulos = _.sortBy(articulos, function (fila) {
            if(fila['cantidadIngresada']) {
                return parseFloat(fila['cantidadIngresada']) * datos['ordenCantidadIngresada'];
            }else{
                return 0;
            }
        });
        datos['articulos'] = articulos;

        mostrarTemplateGeneral(datos, 'resultado', 'templateOrdenesDeCompraLista', 'divGrilla');

        $('#reporteCompleto').removeClass('divBuscandoInformacion');
    }
}
function ordenarArticulo(){
    if(datos) {
        articulos = datos['articulos'];
        $('#reporteCompleto').addClass('divBuscandoInformacion');

        articulos = _.sortBy(articulos, function(fila){
            cadena = fila['articuloNombre'];
            if(fila['articuloNombre']){
                cadena = cadena.toUpperCase();
            }
            return cadena;
        });
        datos['articulos'] = articulos;

        mostrarTemplateGeneral(datos, 'resultado', 'templateOrdenesDeCompraLista', 'divGrilla');

        $('#reporteCompleto').removeClass('divBuscandoInformacion');
    }
}

function ordenarRubro(){
    if(datos) {
        articulos = datos['articulos'];
        $('#reporteCompleto').addClass('divBuscandoInformacion');

        articulos = _.sortBy(articulos, function(fila){
            cadena = fila['rubroNombre'];
            if(fila['rubroNombre']){
                cadena = cadena.toUpperCase();
            }
            return cadena;
        });
        datos['articulos'] = articulos;

        mostrarTemplateGeneral(datos, 'resultado', 'templateOrdenesDeCompraLista', 'divGrilla');

        $('#reporteCompleto').removeClass('divBuscandoInformacion');
    }
}
function ordenarMarca(){
    if(datos) {
        articulos = datos['articulos'];
        $('#reporteCompleto').addClass('divBuscandoInformacion');

        articulos = _.sortBy(articulos, function(fila){
            cadena = fila['marcaNombre'];
            if(fila['marcaNombre']){
                cadena = cadena.toUpperCase();
            }
            return cadena;
        });
        datos['articulos'] = articulos;

        mostrarTemplateGeneral(datos, 'resultado', 'templateOrdenesDeCompraLista', 'divGrilla');

        $('#reporteCompleto').removeClass('divBuscandoInformacion');
    }
}

function asignarCantidad(articuloId,indice){
	autoFormatearCantidad('inpCantidadIngresada'+articuloId);
    articulos = datos['articulos'];
    articulo = articulos[indice];
    articulo['cantidadIngresada']  = $('#inpCantidadIngresada'+articuloId).val();
    articulos[indice] = articulo;
    calcularTotales()
}
function calcularTotales(){
	total = 0;
	articulos = datos['articulos'];
	for(t=0;t < datos['totalArticulos'];t++){
		articulo = articulos[t];
        if((articulo['costo'] * 1) * (articulo['cantidadIngresada'] * 1)) {
            total = total + (articulo['costo'] * 1) * (articulo['cantidadIngresada'] * 1);
            imp = (articulo['costo'] * 1) * (articulo['cantidadIngresada'] * 1);
        }else{
			imp = 0;
		}
        $('#divCostoFila'+t).html('$'+formatearPrecio(imp));

	}
    $('#divTotal').html('$'+formatearPrecio(total));

}
function mostrarDetalleArticulo(indice){
    articulos = datos['articulos'];
    articulo = articulos[indice];
    mostrarTemplateGeneral(articulo, 'articulo', 'templateBusquedaDeComprasDetalle', 'divFila'+indice);
    $('#inpCantidadIngresada'+articulo['articuloId']).css('background-color','#c6f4d3');
    $('#fila'+indice).addClass('ordenesDeCompraFilaSeleccionada');
    $('#filaPlus'+indice).addClass('ordenesDeCompraFilaSeleccionada');

    if(indiceAnterior!= -1 && indiceAnterior!=indice){
        articulo = articulos[indiceAnterior];
        $('#divFila'+indiceAnterior).html('');
        $('#inpCantidadIngresada'+articulo['articuloId']).css('background-color','white');
        $('#fila'+indiceAnterior).removeClass('ordenesDeCompraFilaSeleccionada');
        $('#filaPlus'+indiceAnterior).removeClass('ordenesDeCompraFilaSeleccionada');
    }
    indiceAnterior = indice;
}
function guardarDatos(agregarOtro){
    cantidades = 0;
    articulos = datos['articulos'];
    for(t=0;t < datos['totalArticulos'];t++){
        articulo = articulos[t];
        if((articulo['costo'] * 1) * (articulo['cantidadIngresada'] * 1)) {
            cantidades = cantidades + (articulo['cantidadIngresada'] * 1);
        }
    }
    if(cantidades == 0){
        alert('No cargo ninguna orden.');
        return;
    }
    action = 'principal.php?token='+$('#mToken').val()+'&pagina=ordcmpgrdr';


    $('#ordenDeCompraAgregarOtro').val(agregarOtro);
    $('#frmOrdenDeCompra').attr('action',action);
    $("#frmOrdenDeCompra").submit();
}

