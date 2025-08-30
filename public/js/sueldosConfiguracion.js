var datos = [];

$(document).ready(function() {

    url = 'ajaxSueldosConfiguracion.php';
    data={};
    variable = 'resultado';
    template = 'sueldosConfiguracionTemplate';
    divResultado = 'mainSueldosCF';
    extra = false;
    callback = 'finalizaLlamada(json)';

    cargarAjaxGenericoJson(url, data, variable, template, divResultado,extra,callback)
});
function finalizaLlamada(json){
    datos = json;
}
/* CARGA DE BASICOS ********************************************************/
function addPerfilBasico(){

    template = 'sueldosConfiguracionAgregarPerfilTemplate';
    variable = 'perfiles';
    divResultado = 'addSueldoPerfil';
    json = datos['perfiles'];
    mostrarTemplateGeneral(json, variable, template, divResultado);
    $('#addSueldoPerfil').show(500);
}
function cancelarAgregarBasico(){
    $('#addSueldoPerfil').hide(500);
}
function agregarPerfilABasicos(){
    if($('#inpPerfil').val()==''){
        alert('Debe seleccionar un perfil');
        return;
    }
    if($('#inpValorBasico').val()==''){
        alert('Debe ingresar un basico');
        return;
    }
    perfiles = datos['perfiles'];
    perfil = perfiles[$('#inpPerfil').val()];

    nuevoBasico = {
        'idsueldoconfiguracion': 0,
        'idperfil': perfil['id'],
        'basico': formatearCantidad($('#inpValorBasico').val()),
        'activo': 1,
        'cantidadusuarios':perfil['cantidadusuarios'],
        'perfil':perfil['nombre'],
        'id':0
    };

    configuracion = datos['configuracion'];
    basicos =configuracion['basicos'];
    if(basicos){

        basicos[basicos.length]=nuevoBasico;
    }else{
        basicos = [nuevoBasico];
    }
    configuracion['basicos'] = basicos;
    datos['configuracion'] = configuracion;

    mostrarTemplateGeneral(basicos, 'basicos', 'sueldosConfiguracionBasicosTemplate', 'divBasicos');



}
function estaCargadoEnBasicos(perfilId){
    perfiles = datos['perfiles'];

    configuracion = datos['configuracion'];
    basicos =configuracion['basicos'];

    for(indiceB in basicos){
        basico = basicos[indiceB];
        if(basico['idperfil']==perfilId){
            return true;
        }
    }
    return false;
}

/* CARGA DE ITEMS **************************************/

function addItemSueldo(){

    template = 'sueldosConfiguracionAgregarItemTemplate';
    variable = 'items';
    divResultado = 'divAgregarItemSueldo';
    json = datos['items'];
    mostrarTemplateGeneral(json, variable, template, divResultado);
    $('#divAgregarItemSueldo').show(500);
}

function cancelarAgregarItem(){
    $('#divAgregarItemSueldo').hide(500);
}
function finalizarAgregarItemSueldo(){

    if($('#inpNombreItem').val()==''){
        alert('Debe ingresar un nombre');
        return;
    }

    if($('#inpActivo').val()==''){
        alert('Debe definir si esta activo o no');
        return;
    }
    if($('#inpEsRemunerativo').val()==''){
        alert('Debe definir si es REMUNERATIVO');
        return;
    }
    if($('#inpResta').val()==''){
        alert('Debe definir si RESTA');
        return;
    }

    nuevoItem = {
        'idsueldoconfiguracion': 0,
        'nombre': $('#inpNombreItem').val(),
        'esremunerativo': $('#inpEsRemunerativo').val(),
        'resta': $('#inpResta').val(),
        'activo': $('#inpActivo').val(),
        'id':0
    };

    configuracion = datos['configuracion'];
    items =configuracion['items'];
    if(items){
        items[items.length]=nuevoItem;
    }else{
        items = [nuevoItem];
    }
    configuracion['items'] = items;
    datos['configuracion'] = configuracion;

    mostrarTemplateGeneral(items, 'items', 'sueldosConfiguracionItemsTemplate', 'divItemSueldo');


}
function cargarValoresItemsEnArreglo(){
    configuracion = datos['configuracion'];
    items =configuracion['items'];

    for(indiceItem in items){
        item = items[indiceItem];
        item['activo'] = $('#inpActivo'+indiceItem).val();
        item['esremunerativo'] = $('#inpEsRemunerativo'+indiceItem).val();
        item['resta'] = $('#inpResta'+indiceItem).val();
        items[indiceItem] = item;
    }

    configuracion['items'] = items;
    datos['configuracion'] = configuracion;

}
function cargarValoresBasicoEnArreglo(){
    configuracion = datos['configuracion'];
    basicos =configuracion['basicos'];

    for(indiceBasico in basicos){
        basico = basicos[indiceBasico];

        basico['basico'] = $('#inpBasico'+indiceBasico).val();
        basicos[indiceBasico] = basico;
    }

    configuracion['basicos'] = basicos;
    datos['configuracion'] = configuracion;

}
function guardarDatos(){
    if(!validarItems()){
        return;
    }

    $("#frmSueldosConfiguracion").submit();
}
function validarItems(){
    generarSueldosElDia = parseFloat($('#inpGenerarSueldosElDia').val());
    diaDeCobro = parseFloat($('#inpDiaDeCobro').val());
    diaAdelanto = parseFloat($('#inpDiaAdelanto').val());
    maximoAdelanto = parseFloat($('#inpMaximoAdelanto').val());
    habilitarAguinaldo = parseFloat($('#inpHabilitarAguinaldo').val());

    if(isNaN(generarSueldosElDia) ){
        alert('Debe seleccionar el dia que se GENERARAN los sueldos.');
        return;
    }
    if(isNaN(diaDeCobro)){
        alert('Debe seleccionar el dia de COBRO de los sueldos.');
        return;
    }

    if(isNaN(diaAdelanto)){
        alert('Debe seleccionar el dia que estaran disponibles los ADELANTOS.');
        return;
    }

    if(isNaN(maximoAdelanto)){
        alert('Debe seleccionar el importe MAXIMO DE ADELANTOS.');
        return;
    }
    if(isNaN(habilitarAguinaldo)){
        alert('Debe seleccionar el dia de COBRO DE AGUINALDO.');
        return;
    }

    if(generarSueldosElDia > diaDeCobro){
        alert('Configuracion equivocada: No se puede cobrar antes de generar los sueldos.');
        return;
    }

    if(diaAdelanto > diaDeCobro){
        alert('Configuracion equivocada: No se puede habilitar adelanto despues del dia de cobro.');
        return;
    }

    if(diaAdelanto < generarSueldosElDia){
        alert('Configuracion equivocada: No se puede cobrar adelanto antes que se generen los sueldos.');
        return;
    }
    if(habilitarAguinaldo < generarSueldosElDia){
        alert('Configuracion equivocada: No se peude generar aguinaldo antes que se generen los sueldos.');
        return;
    }
    return true;

}

function eliminarBasico(indice){
    configuracion = datos['configuracion'];
    basicos =configuracion['basicos'];

    bas =[];
    i =0;
    for(indiceBasico in basicos){
        basico = basicos[indiceBasico];
        if(indice != indiceBasico){
            bas[i] = basico;
            i = i + 1;
        }
    }
    configuracion['basicos'] = bas;
    datos['configuracion'] = configuracion;

    mostrarTemplateGeneral(bas, 'basicos', 'sueldosConfiguracionBasicosTemplate', 'divBasicos');
}


function eliminarItem(indice){

    configuracion = datos['configuracion'];
    items =configuracion['items'];

    i = 0;
    it = [];
    for(indiceItem in items){
        item = items[indiceItem];
        if(indice !=indiceItem){
            it[i] = item;
            i = i+1
        }
    }

    configuracion['items'] = it;
    datos['configuracion'] = configuracion;

    mostrarTemplateGeneral(it, 'items', 'sueldosConfiguracionItemsTemplate', 'divItemSueldo');
}