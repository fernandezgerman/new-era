var datos = Array();
$(document).ready(function() {
	liquidacionConfiguracionNotificarMostrar();

});
function liquidacionConfiguracionNotificarMostrar()
{
	mostrarTemplateGeneral(datos, 'datos', 'templateLiquidacionConfiguracionDestinatariosMostrar', 'contenedorNotificacionLiquidacion');
}
function liquidacionConfiguracionNotificarEliminar(indice){
	destinatarios2 = datos['usuariosNotificables'];
	destinatarios = destinatarios2['lista'];
	usr = destinatarios[indice];
	usr['eliminado'] = true;

	liquidacionConfiguracionNotificarMostrar();
}
function agregarUsuarioLiquidacionNot()
{
	mostrarTemplateGeneral(datos['usuariosDisponibles'], 'usuariosDisponibles', 'templateLiquidacionConfiguracionDestinatariosAgregar', 'contenedorNotificacionLiquidacion');
}
function liquidacionNotificacionesAgregarUser()
{
	if(agregarUsuarioSeleccionado()) {
		liquidacionConfiguracionNotificarMostrar();
	}
}
function agregarUsuarioSeleccionado()
{
	indice = $("#inpUsuarioNotificar").val();

	usuariosDisponibles = (datos['usuariosDisponibles'])['lista'];
	usuarioSeleccionado = usuariosDisponibles[indice];

	usuariosNotificables = datos['usuariosNotificables'];
	for(un=0;un < usuariosNotificables['total'];un++)
	{
		usrn = 	(usuariosNotificables['lista'])[un];
		if(usrn['id']==usuarioSeleccionado['id'])
		{
			if(usrn['eliminado'])
			{
				usrn['eliminado'] = false;
				return true;
			}else{
				alert('El usuario ya esta incluido en la lista de notificados');
				return false;
			}
		}
	}
	(usuariosNotificables['lista']).push(usuarioSeleccionado);
	usuariosNotificables['total'] = parseFloat(usuariosNotificables['total']) + 1;

	return true;
}
function guardarDatos(){
	$('#formGuardar').submit();
}