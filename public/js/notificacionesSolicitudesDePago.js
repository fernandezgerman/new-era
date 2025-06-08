$(document).ready(function() {
    refrescarSolicitudesNotificaciones()
});
function refrescarSolicitudesNotificaciones(){

    cargarAjaxGenericoJson('ajaxSolicitudesPAgoNotificaciones.php',
                {nada:'nada'},
        'solicitudes',
        'notificacionesSolicitudesPendientes',
        'panelIzqInfoExtra',false,
        'finalizaciónCargaSolicitudes(json)');
}

function finalizaciónCargaSolicitudes(json){
    setTimeout(refrescarSolicitudesNotificaciones, 5*60*1000);
    //setTimeout(refrescarBarraDeNotificaciones, 10*1000);
    if(json['solicitudes']){
     //   mostrarTemplateGeneral(json['solicitudes'], 'solicitudes', 'notificacionesSolicitudesPendientes', 'panelIzqInfoExtra');
        $('#panelIzqInfoExtra').css('display','block');
    }else{
        $('#panelIzqInfoExtra').css('display','none');
    }
}

function SolicitudMostrarSeleccionInicio(estado){
    $("#estado").val(estado);
    $("#frmSolVerResumen").submit();
}