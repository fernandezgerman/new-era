$(document).ready(function() {
    ntfVerDetalleTodos($('#hddNtfIdTipoAlerta').val());
});
function ntfVerDetalleTodos(idTipoAlerta){
    $('#divTaponNotificaciones').css({'display':'block'});
    cargarAjaxGenericoJson('ajaxAlertasInicioDetalle.php',
        {'alertaTipoId':idTipoAlerta,'IncluirVistas':1},
        'resultado',
        'notificacionesBarraTopDetalleTodasTemplate',
        'ntfDetalleNotificacionVerTodas',
        {'alertaTipoId':idTipoAlerta});

}
function notificacionMarcarComoVistoDesdeTodos(detalleId,idAlertaDestinatario)
{
    notificacionMarcarComoVisto(detalleId,idAlertaDestinatario,1);
    ntfVerDetalleTodos($('#hddNtfIdTipoAlerta').val());
}

function ntfVerInformeDesdeTodos(idInforme,detalleId,idAlertaDestinatario){
    notificacionMarcarComoVisto(detalleId,idAlertaDestinatario,1);
    ntfVerInforme(idInforme);
}
function ntfVerInformeAgenoDesdeTodos(idInforme){
    ntfVerInforme(idInforme);
}
function ntfVerDetallesAgenosTodos(idTipoAlerta){

    cargarAjaxGenericoJson('ajaxAlertasInicioDetalle.php',
        {'alertaTipoId':idTipoAlerta,'IncluirVistas':1,'inpUsuarioAlertasId': $('#inpUsuarioAlertasId').val()},
        'resultado',
        'notificacionesBarraTopDetalleTodasTemplate',
        'ntfDetalleNotificacionVerTodas',
        {'alertaTipoId':idTipoAlerta});
}
