var resultado = Array();
$(document).ready(function() {

    _.templateSettings.variable = "filtros";

    var template = _.template($( "#filtrosGeneralesSucursalesTemplate" ).html());
    $( "#filtroSucursales" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesPeriodosSueldosTemplate" ).html());
    $( "#filtroPeriodosSueldos" ).html(template(contenedorFiltros));



    cargaInstantanea = obtenerParametroDesdeRequest('inpCargaInstantanea');


    if(cargaInstantanea==1){
        sucursales = obtenerParametroDesdeRequest('inpSucursales');
        seleccionarMultiSelectArreglo('inpFiltroSucursales',sucursales.split(','));
        mostrarDatos();

    }
    cargaInstantanea = obtenerParametroDesdeRequest('inpCargaInstantanea');

});
function mostrarDatos(){
    url = "ajaxSueldosHistorico.php";
    data = {'sucursales': $('#inpFiltroSucursales').val() ,
        'sueldos': $('#inpFiltroPeriodosSueldos').val() };
    variable = 'datos';
    template = 'sueldosHistoricoTemplate';
    divResultado = 'main';
    extra = false;
    callback = 'finalizaCarga(json)';
    cargarAjaxGenericoJson(url, data, variable, template, divResultado,
        extra,callback);
}
function mostrarDetallePorSucursal(sueldoId){
    url = "ajaxSueldosHistoricoSucursal.php";
    data = {'sueldoId':sueldoId,
            'sucursales': $('#inpFiltroSucursales').val() };
    variable = 'sucursales';
    template = 'sueldosHistoricoSucursalTemplate';
    divResultado ='divS'+sueldoId+'D';
    extra = {'divResultado':'trS'+sueldoId+'D'};
    callback = "finalizaCargaDetalleSucursal(json,'"+sueldoId+"')";
    cargarAjaxGenericoJson(url, data, variable, template, divResultado,
        extra,callback);
}
function finalizaCargaDetalleSucursal(json,sueldoId){
    $('#trS'+sueldoId+'D').show(1000);

}
function finalizaCarga(json){
    resultado = json;

}
function mostrarDetallePorUsuario(sueldoSucursalId){
    url = "ajaxSueldosHistoricoSucursalUsuarios.php";
    data = {'sueldoSucursalId':sueldoSucursalId};
    variable = 'usuarios';
    template = 'sueldosHistoricoSucursalUsuarioTemplate';
    divResultado ='divSS'+sueldoSucursalId;
    extra = {'divResultado':'trSS'+sueldoSucursalId};

    callback = "finalizaCargaDetalleSucursalUsuario(json,'"+sueldoSucursalId+"')";
    cargarAjaxGenericoJson(url, data, variable, template, divResultado,
        extra,callback);
}
function finalizaCargaDetalleSucursalUsuario(json,sueldoSucursalId){
    $('#trSS'+sueldoSucursalId).show(1000);
}
function cerrarDetalleGeneral(div){
    $('#'+div).hide(1000,function(div){
        $('#'+div).html('');
    })
}