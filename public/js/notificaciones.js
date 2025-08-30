$(document).ready(function() {
    variablex = 'resultado';
    jsonntf = {nada:'nada'};
    mostrarTemplateGeneral(jsonntf, variablex, 'notificacionesBarraTopTemplate', 'divTop');

    let x = getCookie('notificaciones'+$('#idusuarioLogin').val());
    console.log(x);
    if(x == "true") {
        refrescarBarraDeNotificaciones()
    }
});
function refrescarBarraDeNotificaciones(){
    //document.cookie = "notificaciones=true";
    setCookie('notificaciones'+$('#idusuarioLogin').val(),'true',999);
    $('#divTaponNotificaciones').css({'display':'block'});

    cargarAjaxGenericoJson('ajaxAlertasInicio.php', {nada:'nada'}, 'resultado', 'notificacionesBarraTopItemsTemplate', 'ntfNotificaciones','','finalizaciónCargaNotificaciones()');
}
function deshabilitarNotificaciones(){
    setCookie('notificaciones'+$('#idusuarioLogin').val(),'false',999);
    finalizaciónCargaNotificaciones();
}
function finalizaciónCargaNotificaciones(){
    desbloquearBarra();
    let x = getCookie('notificaciones'+$('#idusuarioLogin').val());
    console.log(x);
    if(x == "true") {
        setTimeout(refrescarBarraDeNotificaciones, 5*60*1000);
    }else{
        $('#ntfNotificaciones').html(
            '<div style="clear:both;color: #cccccc;\n' +
            '            font-family: \'Rockwell Bold\';\n' +
            '            margin-left:20px;\n' +
            '            font-size: 15px;">\n' +
            '            <p> <a href="#" style="\n' +
            '                color: #ff9900;\n' +
            '\n' +
            '                text-decoration: underline;\n' +
            '                cursor: hand;\n' +
            '" onclick="refrescarBarraDeNotificaciones()">HABILITAR ALERTAS</a></p>\n' +
            '            </div>'
        );
    }
}
function ntfVerDetalle(idTipoAlerta){
    $('#divTaponNotificaciones').css({'display':'block'});
    cargarAjaxGenericoJson('ajaxAlertasInicioDetalle.php',
                            {'alertaTipoId':idTipoAlerta},
                            'resultado',
                            'notificacionesBarraTopDetalleTemplate',
                            'ntfDetalleNotificacion',
                            {'alertaTipoId':idTipoAlerta},
                            'desbloquearBarra()');

}
function desbloquearBarra(){
    $('#divTaponNotificaciones').css({'display':'none'});
}
 function ntfCerrarDetalle(){
     $("#ntfDetalleNotificacion").html("");
 }
 function ntfVerInforme(idInforme){

        if (idInforme) {
            $("#alertaInforme"+ idInforme).submit();
        }else{
            $("#alertaInforme").submit();
        }

 }
function notificacionMarcarComoVisto(idTipoAlerta,idAlertaDestinatario,ocultarDetalle){
     div = 'ntfDetalleNotificacion';
    if(ocultarDetalle==1){
        div = '';
    }

    $('#divTaponNotificaciones').css({'display':'block'});
    cargarAjaxGenericoJson('ajaxAlertasInicioDetalle.php',
                            {'alertaTipoId':idTipoAlerta, 'idAlertaDestinatario':idAlertaDestinatario,'marcarVisto':1},
                            'resultado',
                            'notificacionesBarraTopDetalleTemplate',
                            div,
                            {'alertaTipoId':idTipoAlerta},
                            'notificacionRefrescarIndividual(json)');

}
function notificacionRefrescarIndividual(resultado){
    variable = 'resultado';
    json = {nada:'nada'};
    tipoalerta = resultado['tipoAlerta'];
    mostrarTemplateGeneral(resultado, variable, 'notificacionesBarraTopIndividualTemplate', 'divAlertaTipo'+tipoalerta['id']);
    desbloquearBarra();
}
function ntfVerTodasLasAlertas(){

    $("#ntfVerTodasAlertas").submit();
}