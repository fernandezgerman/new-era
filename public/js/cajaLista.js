function editarCaja(idusuario,idsucursal,numerocaja)
{

    $('#usuarioId').val(idusuario);
    $('#sucursalId').val(idsucursal);
    $('#numeroCaja').val(numerocaja);

    form = document.getElementById('formulario');
    form.action ="principal.php?withFrame=1&pagina=cjaactual&token="+$('#mToken').val();
    form.target = "_blank";

    form.submit();

}
function buscarCaja()
{

	if( $('#inpFechaAperturaDesde').val()=='' && $('#inpFechaCierreDesde').val()=='' && $('#inpEstadoCaja').val()!=2 ){
		alert('Debe seleccionar una fecha desde.');
		return;
	}
    if($('#inpFechaAperturaHasta').val()=='' && $('#inpFechaCierreHasta').val()==''  && $('#inpEstadoCaja').val()!=2 ){
        alert('Debe seleccionar una fecha hasta.');
        return;
    }

    form = document.getElementById('formulario');
    form.target = "_self";
    form.action ="principal.php?pagina=cajal&token="+$('#mToken').val();
    form.submit();

}

function mostrarDetalleDeCaja(idUsuario, idSucursal, numeroCaja){
    /*
    const div = document.getElementById('visualizar-historico-costos');
    div.setAttribute('data-articulo-id', idarticulo); */

    const mensaje = {
        tipo: 'IFRAME_EVENT',
        accion: 'MOSTRAR_DETALLE_DE_CAJA',
        payload: {
            idUsuario,
            idSucursal,
            numeroCaja
        }
    };

    // Obtiene: https://sitio.com
    const baseUrl = window.location.origin;

    // Enviar mensaje al padre (React)
    window.parent.postMessage(mensaje, baseUrl); // Cambia por tu dominio en producción

}
