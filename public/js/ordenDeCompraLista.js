var contenedorFiltros = Array();
var datos = false;
$(document).ready(function(){
	_.templateSettings.variable = "filtros";
	
    var template = _.template($( "#filtrosGeneralesFechaDesdeTemplate" ).html());
    $( "#filtroFechaDesde" ).html(template(contenedorFiltros));    

    var template = _.template($( "#filtrosGeneralesFechaHastaTemplate" ).html());
    $( "#filtroFechaHasta" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesSucursalesTemplate" ).html());
    $( "#filtroSucursales" ).html(template(contenedorFiltros)); 
    
    var template = _.template($( "#filtrosGeneralesUsuariosTemplate" ).html());
    $( "#filtroUsuarios" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesProveedoresTemplate" ).html());
    $( "#filtroProveedores" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesRubrosTemplate" ).html());
    $( "#filtroRubros" ).html(template(contenedorFiltros));    

    cargaInstantanea = obtenerParametroDesdeRequest('inpCargaInstantanea');
    
    
    if(cargaInstantanea==1){
    	sucursales = obtenerParametroDesdeRequest('inpSucursales');
    	rubros = obtenerParametroDesdeRequest('inpRubros');
    	proveedores = obtenerParametroDesdeRequest('inpProveedores');
    	usuarios = obtenerParametroDesdeRequest('inpUsuarios');
    	fechaDesde = obtenerParametroDesdeRequest('inpFechaDesde');
    	fechaHasta = obtenerParametroDesdeRequest('inpFechaHasta');

    	$("#inpFiltroFechaDesde").val(fechaDesde);
    	$("#inpFiltroFechaHasta").val(fechaHasta);
    	$("#inpFiltroHoraDesde").val(horaDesde);
    	$("#inpFiltroHoraHasta").val(horaHasta);
    	
    	seleccionarMultiSelectArreglo('inpFiltroSucursales',sucursales.split(','));
    	seleccionarMultiSelectArreglo('inpFiltroUsuarios',usuarios.split(','));
    	seleccionarMultiSelectArreglo('inpFiltroProveedores',proveedores.split(','));
    	seleccionarMultiSelectArreglo('inpFiltroRubros',rubros.split(','));
    	
    	mostrarDatos();
    	
    }
    cargaInstantanea = obtenerParametroDesdeRequest('inpCargaInstantanea');

    $("#divPresentacionDiscriminarsucursal").hide();
});
function mostrarBusqueda(){
    url = 'ajaxOrdenesDeCompraReporte.php';
    data = {'sucursales':$('#inpFiltroSucursales').val(),
            'usuarios':$('#inpFiltroUsuarios').val(),
            'proveedores':$('#inpFiltroProveedores').val(),
            'fechaDesde':$('#inpFiltroFechaDesde').val(),
            'fechaHasta':$('#inpFiltroFechaHasta').val()};
    variable = 'resultado';
    template = 'templateOrdenesDeCompraReporte';
    divResultado = 'main';
    extra = false;
    callback = 'asignarDatos(json)';

    cargarAjaxGenericoJson(url,data,variable,template,divResultado,extra,callback);
}
function asignarDatos(datosJson){
    datos = datosJson;
    $('#reporteCompleto').removeClass('divBuscandoInformacion');
}
function verDetalleDeArticulos(indice){

    template ='templateOrdenesDeCompraReporteDetalle';
    variable = 'resultado';
    registros = datos['registros'];
    json = registros[indice];
    divResultado = 'divDetalleArticulo'+indice;
    json['div'] = divResultado;

    mostrarTemplateGeneral(json, variable, template, divResultado);
}
function cerrarDetalle(div){
    $('#'+div).html('');
}
function agregarOrdenDeCompra(){
    $("#frm").submit();
}
function ExportarOrdenAPDF($idOrden){
    $("#idOrdenCompraPDF").val($idOrden);
    $("#frmExportarPDF").submit();
}
function EliminarOrdenDeCompra(idOrden){
    if(!confirm('Esta seguro que desea eliminar la Orden De Compra #'+idOrden+"?")){
       return;
    }

    $('#reporteCompleto').addClass('divBuscandoInformacion');
    $.ajax({
        url : 'ajaxEliminarOrdenDeCompra.php?token='+$('#mToken').val(),
        type : 'POST',
        datatype : 'json',
        async : true,
        d: idOrden,
        data : {
            'ordenDeCompraId':idOrden
        },
        success : function(resultado) {
            json = $.parseJSON(resultado);

            if (json.err == 1){
                alert(json.mensaje);
            }else{
                $( "#divOrdenDeCompraResumen"+this.d).remove();

            }
            $('#reporteCompleto').removeClass('divBuscandoInformacion');
        },
        error : function() {
            alert('error al obtener los registros');
        }
    });
}