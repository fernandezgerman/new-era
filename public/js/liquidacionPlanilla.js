var datos = Array();
$(document).ready(function() {

    url = 'ajaxLiquidacionPlanillaDatos.php';
    data = {'sucursalId':sucursalId};
    variable  = 'datos';
    template = 'templateLiquidacionesPlanilla';
    divResultado = 'contenedorPlanillaNueva';
    extra = false;
    callback = 'carg' +
        'arDatos(json)';
    if(parseFloat(sucursalId) < 3 ) {
        alert('No se pudo establecer la sucursal.');
    }else{
        cargarAjaxGenericoJson(url, data, variable, template, divResultado, extra, callback);
    }
});
function cargarDatos(datos)
{
    this.datos = datos;

    if(!datos['error']==1) {
        //mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanilla', 'contenedorPlanillaNueva');
        mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleGastos', 'divDetalleDeGastos');
        mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleSueldos', 'divDetalleDeSueldos');
        mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleDinero', 'divDetalleDeDinero');

        calcularTotalesAlPie();

        habilitarcheck();
    }


}
function getItemCtaCteYaSeleccionada(uf,su,idusuario){
    sueldos = datos['sueldos'];
    sueldoUsuario = sueldos[su];

    for(auxSu in sueldos){
        usrSueldo = sueldos[auxSu];
        if(usrSueldo['indiceCtaCte']==uf && su != auxSu && idusuario == usrSueldo['idusuario'] ){
            return 1;
        }
    }
    return 0;
}
function seleccionSueldoCtaCte(indiceUsuario){
    indiceCtaCte = $('#cmbConceptoCargaSueldo'+indiceUsuario).val();

    sueldos = datos['sueldos'];
    sueldoUsuario = sueldos[indiceUsuario];
    sueldoUsuario['indiceCtaCte'] = indiceCtaCte;

    usuarios = datos['usuariosSueldosLocal'];

    usuario = usuarios[sueldoUsuario['idusuario']];
    usuarioCtaCte = usuario['ctacte'];

    if(!(indiceCtaCte=='')) {
        itemCtaCte = usuarioCtaCte[indiceCtaCte];
        sueldoUsuario['importe'] = formatearPrecio(itemCtaCte['importe']);
    }else{

        sueldoUsuario['importe'] = '-.--';
    }
    sueldos[indiceUsuario] = sueldoUsuario;
    datos['sueldos'] = sueldos;

    mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleSueldos', 'divDetalleDeSueldos');
    habilitarcheck();
    calcularTotalesAlPie();

}

function agregarNuevoSueldo(indice)
{

    sueldos = datos['sueldos'];
    if(!sueldos){
        sueldos=Array();
    }
    if(indice > -1) {
        sueldo = sueldos[indice];
        i= indice;
    }else{
        sueldo  = Array();
        i= '';
    }
    ctacteCF = datos['ctacte_sueldos'];

    if(ctacteCF['ctacte_habilitada']==1){
        sueldo['idusuario'] = $( "#cmbUsuarioCargaSueldo" ).val();
    }else{
        sueldo['idusuario'] = $( "#cmbUsuarioCargaSueldo"+i ).val();
        sueldo['texto'] = $( "#txtDescripcionSueldo"+i ).val();
        sueldo['importe'] = $( "#txtImporteSueldo"+i ).val();
    }




    if(indice > -1) {
        sueldos = datos['sueldos'];
        sueldos[indice] = sueldo;
        i= indice;
    }else{
        sueldos[sueldos.length] = sueldo;
    }
    datos['sueldos'] = sueldos;



    mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleSueldos', 'divDetalleDeSueldos');
    habilitarcheck();
    marcarTotalesComoVisados();

}

function agregarNuevoGasto(indice)
{

    gastosCargados = datos['gastosCargados'];
    if(!gastosCargados){
        gastosCargados=Array();
    }


    if(indice > -1) {
        gastoCargado = gastosCargados[indice];
        i= indice;
    }else{
        gastoCargado  = Array();
        i= '';
    }

    gastoCargado['articuloid'] = $( "#cmbCargaGasto option:selected" ).val();
    gastoCargado['texto'] = $( "#txtTextoGasto"+i ).val();
    gastoCargado['nombre'] = $( "#cmbCargaGasto option:selected" ).text();
    gastoCargado['importe'] = $( "#txtImporteGasto"+i ).val();

    if(indice > -1) {
        gastosCargados = datos['gastosCargado'];
        gastosCargados[indice] = gastoCargado;
        i= indice;
    }else{
        gastosCargados[gastosCargados.length] = gastoCargado;
    }
    datos['gastosCargados'] = gastosCargados;



    mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleGastos', 'divDetalleDeGastos');
    habilitarcheck();
    marcarTotalesComoVisados();
    calcularTotalesAlPie();

}
function eliminarSueldoLocal(indice)
{
    sueldos = datos['sueldos'];
    sueldos.splice(indice, 1);



    mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleSueldos', 'divDetalleDeSueldos');
    habilitarcheck();
    calcularTotalesAlPie();
}
function agregarNuevoSueldoOficina(indice)
{

    sueldos = datos['sueldosOficinaDetalle'];
    if(!sueldos){
        sueldos=Array();
    }
    if(indice > -1) {

        sueldo = sueldos[indice];
        i= indice;
    }else{
        sueldo  = Array();
        i= '';
    }

    sueldo['idusuario'] = $( "#cmbUsuarioCargaSueldoOfi"+i ).val();
    sueldo['texto'] = $( "#txtDescripcionSueldoOfi"+i ).val();
    sueldo['importe'] = $( "#txtImporteSueldoOfi"+i ).val();

    if(indice > -1) {
        sueldos = datos['sueldosOficinaDetalle'];
        sueldos[indice] = sueldo;
        i= indice;
    }else{
        sueldos[sueldos.length] = sueldo;
    }
    datos['sueldosOficinaDetalle'] = sueldos;



    mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleSueldos', 'divDetalleDeSueldos');
    habilitarcheck();

}
function eliminarSueldoOficina(indice)
{
    sueldos = datos['sueldosOficinaDetalle'];
    sueldos.splice(indice, 1);



    mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleSueldos', 'divDetalleDeSueldos');
    habilitarcheck();
    calcularTotalSueldosOficina();
    calcularTotalesAlPie();

}
/*
function cargarValorGasto(indice)
{
    gastos = datos['gastos'];
    gasto = gastos[indice];
    gasto['importe'] = formatearPrecio($( "#txtImporteGasto"+indice ).val());
    gasto['texto'] = $( "#txtTextoGasto"+indice ).val();

    total = 0;
    for(g=0; g < gastos.length; g++)
    {
        gasto = gastos[g];
        if(gasto['importe']){
            total = total + parseFloat(gasto['importe']);
        }

    }
    $("#lblTotalGastoDetalle").html(formatearPrecio(total));

    calcularTotalesAlPie();

}*/
function cargarValorGasto(indice)
{
    gastos = datos['gastosCargados'];
    gasto = gastos[indice];

    gasto['importe'] = formatearPrecio($( "#txtImporteGasto"+indice ).val());
    gasto['texto'] = $( "#txtTextoGasto"+indice ).val();

    total = 0;
    for(g=0; g < gastos.length; g++)
    {
        gasto = gastos[g];
        if(gasto['importe']){
            total = total + parseFloat(gasto['importe']);
        }

    }
    $("#lblTotalGastoDetalle").html(formatearPrecio(total));

    calcularTotalesAlPie();

}
function eliminarGasto(indice){
    $( "#txtImporteGasto"+indice ).val('');
    $( "#txtTextoGasto"+indice ).val('');

    gastos = datos['gastosCargados'];
    g = 0;
    gastosAux = Array();
    i = 0;

    for(g = 0; g < gastos.length; g++) {
        gasto = gastos[g];
        if (g != indice) {
            gastosAux[i] = gasto;
            i = i + 1;
        }
    }

    datos['gastosCargados'] = gastosAux;

    //cargarValorGasto(indice);
    mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionesPlanillaDetalleGastos', 'divDetalleDeGastos');
    marcarTotalesComoVisados();
    calcularTotalesAlPie();

}
function cargarValorSueldosLocal(indice)
{
    sueldos = datos['sueldos'];
    sueldo = sueldos[indice];

    sueldo['idusuario'] = $( "#cmbUsuarioCargaSueldo"+indice ).val();
    sueldo['texto'] = $( "#txtDescripcionSueldo"+indice ).val();
    sueldo['importe'] = $( "#txtImporteSueldo"+indice ).val();

    sueldos[indice] = sueldo;

    total = 0;
    for(g=0; g < sueldos.length; g++)
    {
        sueldo = sueldos[g];
        if(sueldo['importe']){
            total = total + parseFloat(sueldo['importe']);
        }

    }
    $("#lblTotalSueldoLocalDetalle").html(formatearPrecio(total));


    calcularTotalesAlPie();
}
function cargarTotalSueldosOficina()
{
    datos['totalSueldosOficina'] = $( "#txtTotalSueldosOficina" ).val();

    calcularTotalSueldosOficina();

    calcularTotalesAlPie();
}
function calcularTotalSueldosOficina()
{
    sueldosOficina = datos['sueldosOficinaDetalle'];
    total = 0;
    if(sueldosOficina) {
        for (so = 0; so < sueldosOficina.length; so++) {
            sueldo = sueldosOficina[so];
            total = total + parseFloat(formatearPrecio(sueldo['importe']));
        }
    }
    if(datos['totalSueldosOficina']){
        dif  =parseFloat(formatearPrecio(datos['totalSueldosOficina'])) - total;
    }else{
        dif  =- total;
    }

    if(dif >= 0){
        $("#divDifSueldosOficina").html(" + " + formatearPrecio(dif));
        $("#divDifSueldosOficina").removeClass("liqPlanillaSueldosOficinaDifRojo");
        $("#divDifSueldosOficina").addClass("liqPlanillaSueldosOficinaDifVerde");
    }else{

        $("#divDifSueldosOficina").html("" + formatearPrecio(dif));
        $("#divDifSueldosOficina").removeClass("liqPlanillaSueldosOficinaDifVerde");
        $("#divDifSueldosOficina").addClass("liqPlanillaSueldosOficinaDifRojo");
    }

    if(dif==0){
        $("#lblAtencionSueldosOfi").hide();
    }else {
        $("#lblAtencionSueldosOfi").show();
    }
    return dif;

}
function cargarDetalleSueldoOficina(indice)
{
    sueldosOficina = datos['sueldosOficinaDetalle'];
    sueldo = sueldosOficina[indice];

    sueldo['idusuario'] = $( "#cmbUsuarioCargaSueldoOfi"+indice ).val();
    sueldo['texto'] = $( "#txtDescripcionSueldoOfi"+indice ).val();
    sueldo['importe'] = $( "#txtImporteSueldoOfi"+indice ).val();

    calcularTotalSueldosOficina();
    calcularTotalesAlPie();
}
function cargarEfectivo(){
    datos['totalEfectivo'] = calcularEfectivoPie();

    calcularTotalesAlPie();
}
function cargarPosnet(){
    datos['totalPosnet'] = parseFloat($('#inpPosnetPie').val());

    calcularTotalesAlPie();
}
function calcularTotalesAlPie(){
    totalGastos = 0;
    totalSueldosOficina = 0;
    totalSueldosLocal = 0;
    totalPosnet = parseFloat(formatearPrecio(datos['totalPosnet']));
    totalEfectivo = calcularEfectivoPie();
    total = 0;
    sugerido = 0;

    gastos = datos['gastosCargados'];
    /*CALCULO TOTAL GASTOS  */
    for(g=0; g < gastos.length; g++)
    {
        gasto = gastos[g];
        if(gasto['importe']){
            totalGastos = totalGastos + parseFloat(gasto['importe']);
        }

    }


    /* SUELDOS DE OFICINA */
   /* sueldosOficina = datos['sueldosOficinaDetalle'];
    if(sueldosOficina) {
        for (so = 0; so < sueldosOficina.length; so++) {
            sueldo = sueldosOficina[so];
            totalSueldosOficina = totalSueldosOficina + parseFloat(formatearPrecio(sueldo['importe']));
        }
    }*/
    totalSueldosOficina  = parseFloat(formatearPrecio(datos['totalSueldosOficina']));

    /* SUELDOS DEL LOCAL  */

    for(g=0; g < sueldos.length; g++)
    {
        sueldo = sueldos[g];
        if(sueldo['importe']){
            totalSueldosLocal = totalSueldosLocal + parseFloat(formatearPrecio(sueldo['importe']));
        }

    }

    if(datos['liquidacion']){
        sugerido = parseFloat((datos['liquidacion'])['importesugerido']);
    }

    total = totalPosnet
            + totalEfectivo
            + totalSueldosOficina
            + totalSueldosLocal
            + totalGastos;

    $('#lblTotalGastosPie').html('$'+formatearPrecio(totalGastos));

    $('#inpTotalGastos').val(formatearPrecio(totalGastos));

    $('#lblTotalSueldosPie').html('$'+formatearPrecio(totalSueldosOficina + totalSueldosLocal));

    $('#lblTotalSueldosOficinaPie').html('$'+formatearPrecio(totalSueldosOficina));

    $('#lblTotalSueldosLocalPie').html('$'+formatearPrecio(totalSueldosLocal));

    $('#lblTotalLiquidacionPie').html('$'+formatearPrecio(total));

    $('#lblTotalPosnetPie').html('$'+formatearPrecio($('#inpPosnetPie').val()));

    if(sugerido) {
        $('#lblTotalSugeridoPie').html('$'+formatearPrecio(sugerido));
        $('#lblDiferenciaPie').html('$'+formatearPrecio(sugerido - total));
        if(0 > (sugerido - total)){
            $('#lblDiferenciaPie').addClass('liqPlanillaContenedorTotalesDetalleDiferenciaNegativa');
        }else{
            $('#lblDiferenciaPie').removeClass('liqPlanillaContenedorTotalesDetalleDiferenciaNegativa');
        }
    }else{
        $('#lblTotalSugeridoPie').html('-.--');
        $('#lblDiferenciaPie').html('-.--');
    }
    marcarTotalesComoVisados();
}
function validarCierre(){

    if(calcularTotalSueldosOficina()!=  0)
    {
        alert('Los sueldos de oficina cargados no son correctos.');
        return false;
    }
    if(parseFloat($('#inpEfectivoPie').val()) < 0){
        alert('El importe en efectivo no puede ser menor a cero.');
        return false;
    }
    if(parseFloat($('#inpPosnetPie').val()) < 0){
        alert('El importe de POSNET no puede ser menor a cero');
        return false;
    }

    if($('#inpUsuarioRecivePosNet').val()=='' &&  !(parseFloat($('#inpPosnetPie').val()) <=0)){
        alert('Debe seleccionar un destinatario para el valor de POSNET.');
        return false;
    }
    if($('#inpUsuarioReciveEfectivo').val()=='' &&  !(parseFloat($('#inpEfectivoPie').val()) <=0)){
        alert('Debe seleccionar un destinatario para el EFECTIVO.');
        return false;
    }
    if($('#inpUsuarioEncargadoId').val()=='' || !$('#inpUsuarioEncargadoId').val() ){
        alert('No puede cerrar la liquidacion si no tiene encargado la sucursal.');
        return false;
    }
    return true;
}

function guardarDatos(concierre){

    if(concierre){
        $("#inpCerrarLiquidacion").val(1);

        if(!validarCierre()){
            return false;
        }
    }else{
        $("#inpCerrarLiquidacion").val(0);
    }
    $("#frmPlanillaLiquidacionGuardar").submit();

}

function volverPlanillaLiquidacion(){

    pagina = $("#frmPlanillaLiquidacionVolver input[name=inpPaginaRetorno]").val();

    if(pagina){
        action = 'principal.php?token='+$('#mToken').val()+'&pagina='+pagina;
        $('#frmPlanillaLiquidacionVolver').attr('action',action);
        $("#frmPlanillaLiquidacionVolver" ).submit();
    }else{
        history.go(-1);
    }

}
function calcularEfectivoPie(){
    efe = $('#inpEfectivoPie').val();
    acuenta = $('#inpACuentaPie').val();

    if(!acuenta){
        acuenta = 0;
    }
    if(!efe){
        efe = 0;
    }

    totl = parseFloat(efe) + parseFloat(acuenta);
    $('#lblTotalEfectivoPie').html("$"+formatearPrecio(totl));

    return totl;


}
function seleccionarGasto(indice){
    if( $('#chkSelGasto'+indice).prop('checked') ) {
        $("#filaSeleccionableGasto"+indice).addClass("liqPlanillaSeleccionadosVerde");
    }else{
        $("#filaSeleccionableGasto"+indice).removeClass("liqPlanillaSeleccionadosVerde");
    }
    marcarTotalesComoVisados();
}
function seleccionarDinero(indice){
    if( $('#chkSelDinero'+indice).prop('checked') ) {
        $("#filaSeleccionableDinero"+indice).addClass("liqPlanillaSeleccionadosVerde");
    }else{
        $("#filaSeleccionableDinero"+indice).removeClass("liqPlanillaSeleccionadosVerde");
    }
    marcarTotalesComoVisados()
}
function seleccionarSueldoLocal(indice){
    if( $('#chkSelSueldoLocal'+indice).prop('checked') ) {
        $("#filaSeleccionableSueldoLocal"+indice).addClass("liqPlanillaSeleccionadosVerde");
    }else{
        $("#filaSeleccionableSueldoLocal"+indice).removeClass("liqPlanillaSeleccionadosVerde");
    }
    marcarTotalesComoVisados();
}
function seleccionarSueldoOficina(indice){
    if( $('#chkSelSueldoOficina'+indice).prop('checked') ) {
        $("#filaSeleccionableSueldoOficina"+indice).addClass("liqPlanillaSeleccionadosVerde");
    }else{
        $("#filaSeleccionableSueldoOficina"+indice).removeClass("liqPlanillaSeleccionadosVerde");
    }

    marcarTotalesComoVisados();
}
function habilitarcheck(){
    $("input[name='chkSelCheck[]']").each(function(indice, elemento) {
        permisos = datos['permisos'];
        if(permisos['cierra_liquidacion']){
            $(this).removeClass('liqClaseOcultarElemento');
        }else{
            $(this).addClass('liqClaseOcultarElemento');
        }
    });
}
function marcarTotalesComoVisados(){
    permisos = datos['permisos'];


    if(permisos['cierra_liquidacion']) {
        /* GASTOS VISADOS    */
        $gastosVisados = true;
        $("input[name='chkSelCheck[]']").each(function(indice, elemento) {
                if(parseFloat(formatearPrecio($('#txtImporteGasto'+indice).val())) > 0){
                    if( !$(this).prop('checked') ) {
                        $gastosVisados = false;
                        return;
                    }
                }
            });

        if($gastosVisados){
            $('#divRenglonTotalGastos').addClass("liqPlanillaSeleccionadosVerde");
        }else{
            $('#divRenglonTotalGastos').removeClass("liqPlanillaSeleccionadosVerde");
        }

        /* SUELDOS DEL LOCAL VISADOS */
        $sueldosLocalVisados = true;
        $("input[name='txtImporteSueldo[]']").each(function(indice, elemento) {
            if(parseFloat(formatearPrecio($('#txtImporteSueldo'+indice).val())) > 0){
                if( !$('#chkSelSueldoLocal'+indice).prop('checked') ) {
                    $sueldosLocalVisados = false;
                    return;
                }
            }
        });


        /* SUELDOS OFICINA VISADOS */
        $sueldosOficinaVisados = true;
        $("input[name='txtImporteSueldoOfi[]']").each(function(indice, elemento) {
            if(parseFloat(formatearPrecio($('#txtImporteSueldoOfi'+indice).val())) > 0){
                if( !$('#chkSelSueldoOficina'+indice).prop('checked') ) {
                    $sueldosOficinaVisados = false;
                    return;
                }
            }
        });

        d = calcularTotalSueldosOficina();

        if(d != 0){
            $sueldosOficinaVisados = false;
        }


        if($sueldosLocalVisados && $sueldosOficinaVisados){
            $('#divRenglonTotalSueldos').addClass("liqPlanillaSeleccionadosVerde");
        }else{
            $('#divRenglonTotalSueldos').removeClass("liqPlanillaSeleccionadosVerde");
        }

        /* DINERO VISADO */


        if($('#chkSelDinero0').prop('checked')){
            $('#divRenglonTotalPosnet').addClass("liqPlanillaSeleccionadosVerde");
        }else{
            $('#divRenglonTotalPosnet').removeClass("liqPlanillaSeleccionadosVerde");
        }


        if($('#chkSelDinero1').prop('checked') && $('#chkSelDinero2').prop('checked')){
            $('#divTotalLiquidadoPie').addClass("liqPlanillaSeleccionadosVerde");
        }else{
            $('#divTotalLiquidadoPie').removeClass("liqPlanillaSeleccionadosVerde");
        }


    }
}
function mostrarDetallePosnet(){
    $('#divDetallePosnet').show();
}
function ocultarDetallePosnet(){
    $('#divDetallePosnet').hide();
}